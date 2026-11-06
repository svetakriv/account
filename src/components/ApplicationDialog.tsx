import { useEffect, useRef, useState } from 'react';
import { Button } from '../t-business/components.jsx';
import { FormField as Input } from './FormField';
import { FullNameInput } from './FullNameInput';
import { PartyInput, type PartySuggestion } from './PartyInput';
import { formatPhone } from './ApplicationForm';
import { LoadingStep } from './LoadingStep';

type Props = { open: boolean; phone: string; onPhoneChange: (phone: string) => void; onClose: () => void };
export function ApplicationDialog({ open, phone, onPhoneChange, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [resent, setResent] = useState(false);
  const [closing, setClosing] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!open) return;
    if (step === 2 && code.length === 4) {
      setStep(3);
    }
    if (step === 3) {
      const timer = setTimeout(() => setStep(4), 650);
      return () => clearTimeout(timer);
    }
  }, [code, open, step]);
  useEffect(() => {
    if (!open) return;
    setStep(1); setClosing(false); setCode(''); setResent(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    heading.current?.focus();
    return () => { clearTimeout(closeTimer.current); dialog.current?.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);
  function close() {
    if (closing) return;
    setClosing(true);
    closeTimer.current = setTimeout(onClose, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
  }
  function goToStep(next: number) { setStep(next); setCode(''); setResent(false); requestAnimationFrame(() => heading.current?.focus()); }
  function selectParty(party: PartySuggestion) { setCompany(party.value); setInn(party.inn); }
  const valid = phone.replace(/\D/g, '').length === 11 && company.trim().length > 0 && name.trim().length > 0;
  return <dialog ref={dialog} className={`application-dialog${closing ? ' is-closing' : ''}`} aria-labelledby="application-heading" onCancel={event => { event.preventDefault(); close(); }}>
    {step < 4 && <nav className="dialog-navigation" aria-label="Навигация заявки">
      <button type="button" className="dialog-link dialog-back" onClick={() => step === 2 ? goToStep(1) : close()}><span className="dialog-back-icon" aria-hidden="true" />Назад</button>
      <div className="dialog-progress" role="progressbar" aria-label="Прогресс заявки" aria-valuemin={0} aria-valuemax={100} aria-valuenow={step === 1 ? 0 : step === 3 ? 100 : 50}><span /></div>
      <button type="button" className="dialog-link dialog-close" onClick={close}>Закрыть</button>
    </nav>}
    {step === 4 ? <LoadingStep /> : <section className="dialog-content">
      <h2 id="application-heading" ref={heading} tabIndex={-1}>{step === 1 ? 'Оставьте свои контакты, чтобы открыть счет' : 'Подтвердите мобильный телефон'}</h2>
      {step === 1 ? <form className="dialog-form" onSubmit={event => { event.preventDefault(); setAttempted(true); if (valid) goToStep(2); }}>
        <div className="dialog-fields"><Input label="Телефон" type="tel" inputMode="tel" autoComplete="off" value={phone} error={attempted && phone.replace(/\D/g, '').length !== 11 ? 'Укажите номер телефона' : undefined} onChange={event => onPhoneChange(formatPhone(event.target.value))} /><PartyInput value={company} error={attempted && !company.trim() ? 'Укажите название компании или ИНН' : undefined} onChange={next => { setCompany(next); setInn(''); }} onSelect={selectParty} />{inn && <Input label="ИНН" inputMode="numeric" autoComplete="off" value={inn} onChange={event => setInn(event.target.value.replace(/\D/g, '').slice(0, 12))} />}<FullNameInput value={name} error={attempted && !name.trim() ? 'Укажите фамилию, имя и отчество' : undefined} onChange={setName} /></div>
        <Button type="submit">Продолжить</Button>
      </form> : <div className="sms-step"><p>Код подтверждения отправлен вам на номер: {phone}</p><div className="sms-input"><Input label="Код из СМС" inputMode="numeric" autoComplete="off" maxLength={4} disabled={code.length === 4} value={code} onFocus={() => setCodeFocused(true)} onBlur={() => setCodeFocused(false)} onChange={event => { const next = event.target.value.replace(/\D/g, '').slice(0, 4); setCode(next); if (next.length === 4) { event.currentTarget.blur(); setCodeFocused(false); } }} />{codeFocused && code.length < 4 && <span className="sms-mask" aria-hidden="true"><span className="mask-entered">{code}</span><span className="mask-remaining">{'•'.repeat(4 - code.length)}</span></span>}</div><div className="sms-actions"><button className="sms-link" type="button" onClick={() => { setCode(''); setCodeFocused(false); setResent(true); }}>{resent ? 'Код отправлен повторно' : 'Выслать код повторно'}</button><button className="sms-link" type="button" onClick={() => goToStep(1)}>Изменить номер</button></div><span className="visually-hidden" role="status">{resent ? 'Повторная отправка имитирована в прототипе' : ''}</span></div>}
    </section>}
  </dialog>;
}
