import { useEffect, useId, useRef, useState } from 'react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { FormField } from './FormField';

export type PartySuggestion = {
  value: string;
  inn: string;
  region: string;
  type: 'LEGAL' | 'INDIVIDUAL';
};

type SearchState = 'idle' | 'waiting' | 'loading' | 'ready' | 'empty' | 'error';
type Props = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onSelect: (party: PartySuggestion) => void;
};

export function PartyInput({ value, error, onChange, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<PartySuggestion[]>([]);
  const [state, setState] = useState<SearchState>('idle');
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(0);
  const [selectedValue, setSelectedValue] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const trimmed = value.trim();

  useEffect(() => {
    if (!focused || dismissed || !trimmed || trimmed === selectedValue) {
      setSuggestions([]);
      setState('idle');
      return;
    }

    const controller = new AbortController();
    setState('waiting');
    const timer = window.setTimeout(async () => {
      setState('loading');
      try {
        const response = await fetch('/api/party-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Party suggestions unavailable');
        const payload = await response.json() as { suggestions?: PartySuggestion[] };
        const next = Array.isArray(payload.suggestions) ? payload.suggestions.slice(0, 10) : [];
        const exactInn = /^\d{10}(?:\d{2})?$/.test(trimmed) ? next.find(item => item.inn === trimmed) : undefined;
        if (exactInn) {
          setSelectedValue(exactInn.value);
          setSuggestions([]);
          setState('idle');
          onSelect(exactInn);
          return;
        }
        setSuggestions(next);
        setActive(0);
        setState(next.length ? 'ready' : 'empty');
      } catch (requestError) {
        if ((requestError as Error).name !== 'AbortError') {
          setSuggestions([]);
          setState('error');
        }
      }
    }, 300);

    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [dismissed, focused, onSelect, selectedValue, trimmed]);

  function choose(party: PartySuggestion) {
    setSelectedValue(party.value);
    setSuggestions([]);
    setState('idle');
    setDismissed(true);
    onSelect(party);
    requestAnimationFrame(() => root.current?.querySelector('input')?.blur());
  }

  const status = state === 'waiting' || state === 'loading'
    ? 'Ищем организации…'
    : state === 'empty'
      ? 'Организация не найдена. Можно ввести ИНН вручную'
      : state === 'error'
        ? 'Поиск временно недоступен. Можно продолжить ручной ввод'
        : undefined;
  const expanded = focused && !dismissed && Boolean(status || suggestions.length);

  return <div ref={root} className="party-autocomplete">
    <FormField label="Название компании или ИНН" value={value} error={error} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded ? listId : undefined} aria-activedescendant={expanded && suggestions.length ? `${listId}-${active}` : undefined}
      onFocus={() => { setFocused(true); setDismissed(false); }}
      onBlur={() => setFocused(false)}
      onChange={event => { setSelectedValue(''); setDismissed(false); setActive(0); onChange(event.target.value); }}
      onKeyDown={event => {
        if (!expanded) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setDismissed(true); }
        if (suggestions.length && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault();
          const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
          setActive(next);
          root.current?.querySelector(`#${CSS.escape(listId + '-' + next)}`)?.scrollIntoView({ block: 'nearest' });
        }
        if (suggestions.length && event.key === 'Enter') { event.preventDefault(); choose(suggestions[active] || suggestions[0]); }
      }} />
    {expanded && <AutocompleteDropdown id={listId} label="Подсказки организаций" items={suggestions} activeIndex={active} variant="parties" getKey={item => `${item.inn}-${item.value}`} onChoose={choose} onActiveChange={setActive} status={status} renderItem={item => <><span className="party-option-name">{item.value}</span><span>{item.region}</span><span>ИНН: {item.inn}</span></>} />}
  </div>;
}
