import { useState } from 'react';
import { Button } from '../t-business/components.jsx';
import { FormField as Input } from './FormField';
import { ApplicationDialog } from './ApplicationDialog';

export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  return digits ? '+7 ' + digits.slice(0, 3) + (digits.length > 3 ? ' ' + digits.slice(3, 6) : '') + (digits.length > 6 ? '-' + digits.slice(6, 8) : '') + (digits.length > 8 ? '-' + digits.slice(8, 10) : '') : '';
}

export function ApplicationForm() {
  const [phone, setPhone] = useState('');
  const [open, setOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const valid = phone.replace(/\D/g, '').length === 11;
  return <><form className="application-form" aria-label="Заявка на открытие счета" onSubmit={event => { event.preventDefault(); setAttempted(true); if (valid) setOpen(true); }}>
    <div className="form-tabs" aria-label="Вариант заявки"><button type="button" className="form-tab form-tab--active" aria-pressed="true">Открыть счет</button><button type="button" className="form-tab" aria-pressed="false">Открыть бизнес</button></div>
    <div className="application-input"><Input label="Телефон" value={phone} error={attempted && !valid ? 'Укажите номер телефона' : undefined} onBlur={() => setAttempted(true)} onChange={event => setPhone(formatPhone(event.target.value))} type="tel" inputMode="tel" autoComplete="off" /></div>
    <div className="form-bottom"><p>При вводе номера телефона вы соглашаетесь <span className="terms">с&nbsp;условиями</span></p><Button type="submit">Продолжить</Button></div>
  </form><ApplicationDialog open={open} phone={phone} onPhoneChange={setPhone} onClose={() => setOpen(false)} /></>;
}
