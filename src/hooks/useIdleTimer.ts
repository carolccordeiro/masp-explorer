import { useEffect, useRef, useCallback } from 'react';

/**
 * useIdleTimer
 * Detecta inatividade do usuário no totem e executa um callback após o timeout.
 * Útil para resetar a sessão e voltar à tela inicial automaticamente.
 *
 * @param onIdle   - Função chamada quando o usuário fica inativo
 * @param timeout  - Tempo em milissegundos (padrão: 60 segundos)
 * @param enabled  - Se o timer está ativo (padrão: true)
 */
export function useIdleTimer(
  onIdle: () => void,
  timeout: number = 60_000,
  enabled: boolean = true
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = useRef(onIdle);

  // Mantém a referência atualizada sem re-registrar eventos
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (enabled) {
      timerRef.current = setTimeout(() => {
        onIdleRef.current();
      }, timeout);
    }
  }, [timeout, enabled]);

  useEffect(() => {
    if (!enabled) return;

    const events = [
      'touchstart',
      'touchmove',
      'touchend',
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'click',
    ];

    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset(); // inicia o timer imediatamente

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reset, enabled]);

  return { reset };
}
