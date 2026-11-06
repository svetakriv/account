// User-approved prototype motion. Timings are defined in components.css;
// these are not measured parameters from tbank.ru or Figma motion tokens.
export function createFloatingLabelMotion(element) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let last = null;
  let animation = null;
  const stop = () => { animation?.cancel(); animation = null; };
  const onPreferenceChange = () => { if (reduced.matches) stop(); };
  reduced.addEventListener('change', onPreferenceChange);

  return {
    update(text, enabled = true) {
      const next = { left: text.left, top: text.top, fontSize: text.style.fontSize };
      const changed = last && Object.keys(next).some(key => next[key] !== last[key]);
      if (!changed) { last = next; if (!enabled) stop(); return; }
      const computed = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(computed.transform === 'none' ? undefined : computed.transform);
      // Reversals start at the currently visible position and size, rather
      // than restarting at the previous end state.
      const from = {
        left: last.left + matrix.e,
        top: last.top + matrix.f,
        fontSize: last.fontSize * matrix.a,
      };
      last = next;
      stop();
      if (!enabled || reduced.matches) return;
      const durationValue = computed.getPropertyValue('--tb-prototype-motion-duration').trim();
      const duration = parseFloat(durationValue) * (durationValue.endsWith('ms') ? 1 : 1000);
      const easing = computed.getPropertyValue('--tb-prototype-motion-easing').trim();
      if (!Number.isFinite(duration) || duration <= 0) return;
      animation = element.animate([
        { transform: `translate(${from.left - next.left}px, ${from.top - next.top}px) scale(${from.fontSize / next.fontSize})` },
        { transform: 'translate(0, 0) scale(1)' },
      ], { duration, easing });
    },
    destroy() { stop(); reduced.removeEventListener('change', onPreferenceChange); },
  };
}
