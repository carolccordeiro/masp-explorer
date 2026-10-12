"""Compila os dados dos museus (data-src) para o app.

- Lê data-src/<museu>/museum.json e artworks.json
- Aplica traduções de data-src/i18n/cache.json
- Processa as imagens originais (se existirem em KORA_RAW/<museu>/raw/<src>.webp) em
  public/museums/<museu>/art/<id>.webp (1200 px) e thumb/<id>.webp (480 px)
- Gera src/data/generated/<museu>.json e src/data/generated/index.json

Uso: python3 scripts/build_data.py   (requer Pillow)
"""
import json, os, re, sys
from PIL import Image, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.environ.get("KORA_RAW", os.path.join(os.path.dirname(ROOT), "kora-data"))
MUSEUMS = ["masp", "ims", "mam"]
cache = {}
p = os.path.join(ROOT, "data-src/i18n/cache.json")
if os.path.exists(p):
    cache = json.load(open(p))

missing_tr = 0
def i18n(s):
    global missing_tr
    if not s:
        return {"pt": ""}
    t = cache.get(s)
    if not t:
        missing_tr += 1
        return {"pt": s}
    return {"pt": s, "en": t["en"], "es": t["es"]}

def no_dash(s):
    return re.sub(r"\s*[—–]\s*", ", ", s) if isinstance(s, str) else s

def process_image(museum, src, id_):
    out_dir = os.path.join(ROOT, "public/museums", museum)
    full = os.path.join(out_dir, "art", f"{id_}.webp")
    thumb = os.path.join(out_dir, "thumb", f"{id_}.webp")
    os.makedirs(os.path.dirname(full), exist_ok=True)
    os.makedirs(os.path.dirname(thumb), exist_ok=True)
    raw = os.path.join(RAW, museum, "raw", f"{src}.webp")
    if os.path.exists(raw) and (not os.path.exists(full) or os.path.getmtime(raw) > os.path.getmtime(full)):
        im = Image.open(raw).convert("RGB")
        a = im.copy(); a.thumbnail((1200, 1200)); a.save(full, "WEBP", quality=80, method=6)
        b = im.copy(); b.thumbnail((480, 480)); b.save(thumb, "WEBP", quality=72, method=6)
    if not os.path.exists(full):
        return None
    im = Image.open(thumb).convert("RGB")
    small = im.resize((8, 8))
    r, g, b_ = [int(x) for x in ImageStat.Stat(small).mean]
    return {
        "image": f"/museums/{museum}/art/{id_}.webp",
        "thumb": f"/museums/{museum}/thumb/{id_}.webp",
        "ratio": round(im.width / im.height, 3),
        "color": f"#{r:02x}{g:02x}{b_:02x}",
    }

def build(museum):
    mu = json.load(open(os.path.join(ROOT, f"data-src/{museum}/museum.json")))
    arts_src = json.load(open(os.path.join(ROOT, f"data-src/{museum}/artworks.json")))
    meta = {"masp": "MASP", "ims": "IMS", "mam": "MAM"}
    artworks = []
    for a in arts_src:
        img = process_image(museum, a["src"], a["id"])
        if not img:
            print(f"  sem imagem: {museum}/{a['id']}")
            continue
        credit = {
            "masp": "Acervo MASP · imagem pública via Wikimedia Commons ou Google Arts & Culture",
            "ims": "Acervo Instituto Moreira Salles · via Google Arts & Culture",
            "mam": "Acervo MAM São Paulo · via Google Arts & Culture",
        }[museum]
        artworks.append({
            "id": a["id"], "museum": museum,
            "title": {"pt": a["title"], "en": a.get("title_en") or a["title"], "es": a.get("title_es") or a["title"]},
            "artist": a["artist"], "artistLife": a.get("artist_life"), "year": a.get("year"),
            "medium": i18n(a.get("medium")) if a.get("medium") else None, "dimensions": a.get("dimensions"), "movement": i18n(a.get("movement")) if a.get("movement") else None,
            "tags": a.get("tags", []), "theme": a["theme"],
            "description": i18n(no_dash(a["description"])), "history": i18n(no_dash(a["history"])), "kids": i18n(no_dash(a["kids"])),
            **img, "credit": credit, "source": a.get("source_url"), "space": a.get("space"),
        })
    # capa
    cover_src = next((a for a in artworks if a["id"] == mu.get("cover_from")), artworks[0])
    cover = os.path.join(ROOT, "public/museums", museum, "cover.webp")
    raw_full = os.path.join(ROOT, "public", cover_src["image"].lstrip("/"))
    im = Image.open(raw_full).convert("RGB"); im.thumbnail((1600, 1600)); im.save(cover, "WEBP", quality=80, method=6)

    out = {
        "id": museum, "short": meta[museum],
        "about": i18n(mu["about"]), "metro": mu["metro"], "phone": mu.get("phone"), "site": mu["site"],
        "hours": [{"days": i18n(h["days"]), "time": h["time"], **({"note": i18n(h["note"])} if h.get("note") else {})} for h in mu["hours"]],
        "tickets": [{"label": i18n(t["label"]), "price": t["price"]} for t in mu["tickets"]],
        "free": [i18n(x) for x in mu["free"]],
        "accessibility": [i18n(x) for x in mu["accessibility"]],
        "services": [i18n(x) for x in mu["services"]],
        "timeline": [{"year": t["year"], "text": i18n(t["text"])} for t in mu["timeline"]],
        "exhibitions": [{**{k: v for k, v in e.items() if k != "description"}, "description": i18n(e["description"])} for e in mu["exhibitions"]],
        "spaces": [{**{k: v for k, v in s.items() if k != "description"}, "description": i18n(s["description"])} for s in mu["spaces"]],
        "quiz": [{"question": i18n(q["question"]), "options": [i18n(o) for o in q["options"]], "correct": q["correct"], "explanation": i18n(q["explanation"])} for q in mu["quiz"]],
        "stats": [{"value": s["value"], "label": i18n(s["label"])} for s in mu["stats"]],
        "artworks": artworks,
    }
    return out

def main():
    gen = os.path.join(ROOT, "src/data/generated")
    os.makedirs(gen, exist_ok=True)
    index = []
    for m in MUSEUMS:
        d = build(m)
        json.dump(d, open(os.path.join(gen, f"{m}.json"), "w"), ensure_ascii=False, separators=(",", ":"))
        for a in d["artworks"]:
            index.append({"id": a["id"], "museum": m, "title": a["title"]["pt"], "artist": a["artist"], "year": a.get("year"),
                          "thumb": a["thumb"], "color": a["color"], "theme": a["theme"]})
        print(f"{m}: {len(d['artworks'])} obras")
    json.dump(index, open(os.path.join(gen, "index.json"), "w"), ensure_ascii=False, separators=(",", ":"))
    ids = [i["id"] for i in index]
    assert len(ids) == len(set(ids)), "ids duplicados entre museus"
    print(f"índice: {len(index)} obras · textos sem tradução: {missing_tr}")

if __name__ == "__main__":
    main()
