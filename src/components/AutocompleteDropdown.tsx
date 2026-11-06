import type { ReactNode } from 'react';

type Props<T> = {
  id: string;
  label: string;
  items: T[];
  activeIndex: number;
  variant: 'names' | 'parties';
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onChoose: (item: T) => void;
  onActiveChange: (index: number) => void;
  status?: string;
};

export function AutocompleteDropdown<T>({ id, label, items, activeIndex, variant, getKey, renderItem, onChoose, onActiveChange, status }: Props<T>) {
  if (status) {
    return <div className={`autocomplete-dropdown autocomplete-dropdown--${variant}`} role="status">{status}</div>;
  }
  return <div className={`autocomplete-dropdown autocomplete-dropdown--${variant}`} role="listbox" id={id} aria-label={label}>
    {items.map((item, index) => <div role="option" id={`${id}-${index}`} aria-selected={index === activeIndex} className={`autocomplete-option autocomplete-option--${variant}${index === activeIndex ? ' is-active' : ''}`} key={getKey(item)} onPointerDown={event => { event.preventDefault(); onChoose(item); }} onPointerMove={() => onActiveChange(index)}>{renderItem(item)}</div>)}
  </div>;
}
