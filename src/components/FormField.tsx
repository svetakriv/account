import { useId, useLayoutEffect, useState } from 'react';
import { Input } from '../t-business/components.jsx';
import type { InputHTMLAttributes } from 'react';
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & { label: string; value: string; error?: string };
export function FormField({ error, label, value, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const errorId = useId();
  const phone = props.type === 'tel';
  const inputId = useId();
  const suppliedOnSelect = props.onSelect;
  if (phone) {
    props.id ??= inputId;
    props.onSelect = event => {
      const input = event.currentTarget;
      if (input.value.startsWith('+7 ') && (input.selectionStart ?? 0) < 3) {
        input.setSelectionRange(3, Math.max(3, input.selectionEnd ?? 3));
      }
      suppliedOnSelect?.(event);
    };
  }
  useLayoutEffect(() => {
    if (!phone || !focused) return;
    const input = document.getElementById(props.id || inputId) as HTMLInputElement | null;
    if (input && (input.selectionStart ?? 0) < 3) input.setSelectionRange(3, Math.max(3, input.selectionEnd ?? 3));
  }, [focused, phone, value, props.id, inputId]);
  const mask = '+7 ___ ___-__-__';
  const incompleteSms = props.inputMode === 'numeric' && props.maxLength === 4 && value.length > 0 && value.length < 4;
  const incompletePhone = phone && value.trim().length > 0 && value.replace(/\D/g, '').length !== 11;
  const message = (touched && incompletePhone ? 'Номер телефона должен состоять из 10 цифр' : error) || (touched && incompleteSms ? 'Код должен содержать 4 цифры' : touched && !value.trim() ? (phone ? 'Укажите номер телефона' : `Заполните поле «${label}»`) : '');
  return <div className="research-field" data-invalid={Boolean(message)}><Input {...props} label={label} aria-invalid={Boolean(message)} aria-describedby={message ? errorId : undefined} value={phone && focused && !value ? '+7 ' : value} onFocus={event => { setFocused(true); if (phone && !value) { const input = event.currentTarget; requestAnimationFrame(() => input.setSelectionRange(3, 3)); } onFocus?.(event); }} onKeyDown={event => { if (phone && (event.key === 'Backspace' || event.key === 'ArrowLeft') && (event.currentTarget.selectionStart ?? 0) <= 3) event.preventDefault(); props.onKeyDown?.(event); }} onClick={event => { if (phone && (event.currentTarget.selectionStart ?? 0) < 3) event.currentTarget.setSelectionRange(3, 3); props.onClick?.(event); }} onChange={event => { props.onChange?.(event); if (phone && event.currentTarget.value.replace(/\D/g, '').length >= 11) event.currentTarget.blur(); }} onBlur={event => { setFocused(false); setTouched(true); onBlur?.(event); }} />
    {phone && focused && <span className="phone-mask" aria-hidden="true">{value ? <><span className="mask-entered">{value}</span><span className="mask-remaining">{mask.slice(value.length)}</span></> : <><span className="mask-entered">+7 </span><span className="mask-remaining">921 123-45-67</span></>}</span>}
    {message && <p id={errorId} className="field-message" role="alert">{message}</p>}
  </div>;
}
