"""Traduz os textos em PT dos arquivos data-src para EN e ES usando a API do Gemini (modelo Gemma, cota gratuita alta).
Uso: GEMINI_API_KEY=... python3 scripts/translate.py
Resultado: data-src/i18n/cache.json  {texto_pt: {"en": ..., "es": ...}}  (reaproveitado nas próximas execuções)
"""
import json, os, re, sys, time, glob, requests

KEY = os.environ.get("GEMINI_API_KEY")
MODELS = os.environ.get("TRANSLATE_MODELS", "gemini-3.6-flash,gemma-4-31b-it").split(",")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "data-src/i18n/cache.json")

def collect():
    out = []
    for m in ["masp", "ims", "mam"]:
        arts = json.load(open(f"{ROOT}/data-src/{m}/artworks.json"))
        for a in arts:
            out += [a["description"], a["history"], a["kids"]]
            if a.get("movement"): out.append(a["movement"])
            if a.get("medium"): out.append(a["medium"])
        mu = json.load(open(f"{ROOT}/data-src/{m}/museum.json"))
        out += [mu["about"]]
        for h in mu["hours"]:
            out.append(h["days"])
            if h.get("note"): out.append(h["note"])
        out += [t["label"] for t in mu["tickets"]]
        out += mu["free"] + mu["accessibility"] + mu["services"]
        out += [t["text"] for t in mu["timeline"]]
        out += [e["description"] for e in mu["exhibitions"]]
        out += [s["description"] for s in mu["spaces"]]
        out += [s["label"] for s in mu["stats"]]
        for q in mu["quiz"]:
            out += [q["question"], q["explanation"]] + q["options"]
    seen = set(); res = []
    for s in out:
        if s and s not in seen and not re.fullmatch(r"[\d\s.,:%+R$hàs-]+", s):
            seen.add(s); res.append(s)
    return res

def call(batch):
    prompt = (
        "Translate each Portuguese (Brazil) string in the JSON array into English and into Spanish (Latin American neutral). "
        "Keep proper names, artwork titles and place names as they are. Keep it natural and concise, same tone (museum guide, some texts for kids). "
        "Never use em dashes or en dashes. Return ONLY a JSON array with objects {\"en\": ..., \"es\": ...} in the same order and same length.\n\n"
        + json.dumps(batch, ensure_ascii=False)
    )
    for model in MODELS:
        for attempt in range(3):
            try:
                r = requests.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                    headers={"x-goog-api-key": KEY},
                    json={"contents": [{"parts": [{"text": prompt}]}], "generationConfig": {"temperature": 0.2, **({"thinkingConfig": {"thinkingLevel": "minimal"}} if model.startswith("gemini-3") else {})}},
                    timeout=180,
                )
                if r.status_code != 200:
                    print("  http", model, r.status_code, r.text[:120]); time.sleep(10 * (attempt + 1)); continue
                parts = r.json()["candidates"][0]["content"]["parts"]
                txt = "".join(p.get("text", "") for p in parts if not p.get("thought"))
                m = re.search(r"\[.*\]", txt, re.S)
                arr = json.loads(m.group(0))
                if len(arr) == len(batch) and all("en" in x and "es" in x for x in arr):
                    return arr
                print("  tamanho errado", len(arr), len(batch))
            except Exception as e:
                print("  erro", model, str(e)[:120]); time.sleep(5)
    return None

def main():
    if not KEY: sys.exit("Defina GEMINI_API_KEY")
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    todo = [s for s in collect() if s not in cache]
    print(f"{len(todo)} textos para traduzir")
    B = 25
    for i in range(0, len(todo), B):
        batch = todo[i:i + B]
        arr = call(batch)
        if not arr: print("falhou lote", i); continue
        for s, t in zip(batch, arr):
            clean = lambda x: re.sub(r"\s*[—–]\s*", ", ", x).strip()
            cache[s] = {"en": clean(t["en"]), "es": clean(t["es"])}
        json.dump(cache, open(CACHE, "w"), ensure_ascii=False, indent=0)
        print(f"ok {i + len(batch)}/{len(todo)}"); time.sleep(6)

if __name__ == "__main__":
    main()
