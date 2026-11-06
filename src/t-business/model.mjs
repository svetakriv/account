export function buttonStates(catalog, { family = 'button-desktop', appearance = 'primary', size = 'large' } = {}) {
  if (appearance.includes('glass')) throw new Error('Glass requires the captured background blur implementation; this template does not implement it.');
  const result = {};
  for (const item of catalog.buttons) {
    const p = item.properties;
    if (item.family === family && p.appearance === appearance && p.size === size && p.skeleton === 'off') result[p.state] = item;
  }
  for (const state of ['normal', 'hover', 'pressed', 'disabled']) {
    if (!result[state]) throw new Error(`Figma snapshot missing: ${family}/${appearance}/${size}/${state}. Refresh the skill; do not substitute a style.`);
  }
  return result;
}

export function inputStates(catalog) {
  const result = {};
  for (const item of catalog.inputs) {
    const p = item.properties;
    if (p.size === 'large' && p['show-label'] === 'on' && p.skeleton === 'off' && ['normal', 'focus'].includes(p.state)) result[`${p.state}/${p['is-filled']}`] = item;
  }
  for (const key of ['normal/off', 'normal/on', 'focus/off', 'focus/on']) {
    if (!result[key]) throw new Error(`Figma snapshot missing Input large/${key}. Refresh before using this template.`);
  }
  return result;
}
