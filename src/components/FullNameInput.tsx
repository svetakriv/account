import { useId, useRef, useState } from 'react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { FormField } from './FormField';

type Entry = { text: string; count: number; genders: string[]; baseNames: string[] };
type Dictionaries = { surnames: Entry[]; names: Entry[]; midnames: Entry[] };
let dictionariesPromise: Promise<Dictionaries> | undefined;
const normalize = (text: string) => text.toLocaleLowerCase('ru').replaceAll('ё', 'е');
function loadDictionaries() {
  dictionariesPromise ??= Promise.all(['surnames', 'names', 'midnames'].map(async file => {
    const response = await fetch(`/data/names/${file}.json`);
    if (!response.ok) throw new Error('Dictionary unavailable');
    return response.json() as Promise<Entry[]>;
  })).then(([surnames, names, midnames]) => ({ surnames, names, midnames })).catch(error => { dictionariesPromise = undefined; throw error; });
  return dictionariesPromise;
}
function knownGender(entries: Entry[], value: string) {
  const entry = entries.find(item => normalize(item.text) === normalize(value));
  return entry?.genders.length === 1 && ['m', 'f'].includes(entry.genders[0]) ? entry.genders[0] : undefined;
}
export function FullNameInput({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
  const [data, setData] = useState<Dictionaries>();
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(0);
  const [atEnd, setAtEnd] = useState(true);
  const [composing, setComposing] = useState(false);
  const [scroll, setScroll] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const parts = value.trimStart().split(/\s+/);
  const index = parts.length - 1;
  const query = parts[index] || '';
  const prefix = value.slice(0, value.length - query.length);
  const gender = data && (index === 2 ? knownGender(data.names, parts[1]) : index === 1 ? knownGender(data.surnames, parts[0]) : undefined);
  const pool = data ? [data.surnames, data.names, data.midnames][index] || [] : [];
  const options = pool.filter(item => normalize(item.text).startsWith(normalize(query)) && (!gender || !item.genders.length || item.genders.includes('u') || item.genders.includes(gender))).slice(0, 10);
  const expanded = focused && !dismissed && atEnd && !composing && value.length > 0 && index < 3 && options.length > 0;
  const selected = options[active] || options[0];
  const completion = expanded && selected ? selected.text.slice(query.length) : '';
  function choose(item: Entry) {
    onChange(prefix + item.text + (index < 2 ? ' ' : ''));
    setActive(0); setDismissed(index === 2);
    requestAnimationFrame(() => { const input = root.current?.querySelector('input'); input?.focus(); input?.setSelectionRange(input.value.length, input.value.length); });
  }
  return <div ref={root} className="fullname-autocomplete">
    <FormField label="Фамилия, имя и отчество" value={value} error={error} autoComplete="off" role="combobox" aria-autocomplete="both" aria-expanded={expanded} aria-controls={expanded ? listId : undefined} aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
      onFocus={() => { setFocused(true); setDismissed(false); loadDictionaries().then(setData).catch(() => {}); }}
      onBlur={() => setFocused(false)}
      onChange={event => { onChange(event.target.value); setActive(0); setDismissed(false); setAtEnd(event.target.selectionStart === event.target.value.length); setScroll(event.target.scrollLeft); }}
      onSelect={event => { const input = event.currentTarget; setAtEnd(input.selectionStart === input.value.length && input.selectionEnd === input.value.length); }}
      onScroll={event => setScroll(event.currentTarget.scrollLeft)}
      onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)}
      onKeyDown={event => {
        if (!expanded || event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setDismissed(true); }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault(); const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length; setActive(next);
          root.current?.querySelector(`#${CSS.escape(listId + '-' + next)}`)?.scrollIntoView({ block: 'nearest' });
        }
        if (event.key === 'Enter' || event.key === 'ArrowRight' && completion || event.key === 'Tab' && !event.shiftKey && completion) { event.preventDefault(); choose(selected); }
      }} />
    {expanded && completion && <div className="fullname-ghost" aria-hidden="true"><span style={{ transform: `translateX(${-scroll}px)` }}><span className="ghost-entered">{value}</span><span>{completion}</span></span></div>}
    {expanded && <AutocompleteDropdown id={listId} label="Подсказки ФИО" items={options} activeIndex={active} variant="names" getKey={item => item.text} onChoose={choose} onActiveChange={setActive} renderItem={item => prefix + item.text} />}
  </div>;
}
