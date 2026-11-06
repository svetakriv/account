import { useEffect, useState } from 'react';
import { Button } from '../t-business/components.jsx';
import { FormField } from './FormField';
import { PartyInput } from './PartyInput';
import { FullNameInput } from './FullNameInput';
import { LoadingStep } from './LoadingStep';
import { formatPhone } from './ApplicationForm';

export function InlineApplicationForm() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [inn, setInn] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [resent, setResent] = useState(false);
  const [completing, setCompleting] = useState(false);
  const validPhone = phone.replace(/\D/g, '').length === 11;
  const progress = completing || step === 5 ? 100 : (step - 1) * 28.33;
  useEffect(() => {
    if (!completing) return;
    const timer = setTimeout(() => { setStep(5); setCompleting(false); }, 650);
    return () => clearTimeout(timer);
  }, [completing]);
  function go(next: number) { setStep(next); setAttempted(false); setCode(''); setCodeFocused(false); setResent(false); }
  function submit() {
    setAttempted(true);
    if (step === 1 && validPhone || step === 2 && company.trim() || step === 3 && name.trim()) go(step + 1);
  }
  return <form className="application-form inline-application" aria-label="Заявка на открытие счета" onSubmit={event => { event.preventDefault(); submit(); }}>
    {step < 5 && <div className={`inline-progress${completing ? ' is-completing' : ''}`} role="progressbar" aria-label="Прогресс заявки" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>}
    {step === 1 && <><div className="form-tabs" aria-label="Вариант заявки"><button type="button" className="form-tab form-tab--active" aria-pressed="true">Открыть счет</button><button type="button" className="form-tab" aria-pressed="false">Открыть бизнес</button></div><div className="application-input"><FormField label="Телефон" type="tel" inputMode="tel" autoComplete="off" value={phone} error={attempted && !validPhone ? 'Укажите номер телефона' : undefined} onChange={event => setPhone(formatPhone(event.target.value))} /></div></>}
    {step === 2 && <div className="inline-fields"><PartyInput value={company} error={attempted && !company.trim() ? 'Укажите название компании или ИНН' : undefined} onChange={value => { setCompany(value); setInn(''); }} onSelect={party => { setCompany(party.value); setInn(party.inn); }} />{inn && <FormField label="ИНН" inputMode="numeric" autoComplete="off" value={inn} onChange={event => setInn(event.target.value.replace(/\D/g, '').slice(0, 12))} />}</div>}
    {step === 3 && <FullNameInput value={name} onChange={setName} error={attempted && !name.trim() ? 'Укажите фамилию, имя и отчество' : undefined} />}
    {step === 4 && <div className="inline-sms"><div className="inline-sms-copy"><p>Подтвердите мобильный телефон</p><p>Код подтверждения отправлен вам на номер: {phone}</p></div><div className="sms-input"><FormField label="Код из СМС" inputMode="numeric" autoComplete="off" value={code} maxLength={4} disabled={code.length === 4} onFocus={() => setCodeFocused(true)} onBlur={() => setCodeFocused(false)} onChange={event => { const next = event.target.value.replace(/\D/g, '').slice(0, 4); setCode(next); if (next.length === 4) { event.currentTarget.blur(); setCodeFocused(false); setCompleting(true); } }} />{codeFocused && <span className="sms-mask" aria-hidden="true"><span className="mask-entered">{code}</span><span className="mask-remaining">{'•'.repeat(4 - code.length)}</span></span>}</div><div className="sms-actions"><button type="button" className="sms-link" disabled={completing} onClick={() => { setCode(''); setResent(true); }}>{resent ? 'Код отправлен повторно' : 'Выслать код повторно'}</button><button type="button" className="sms-link" disabled={completing} onClick={() => go(1)}>Изменить номер</button></div></div>}
    {step === 5 && <LoadingStep variant="inline" />}
    {step < 4 && <div className="form-bottom">{step === 1 ? <p>При вводе номера телефона вы соглашаетесь <span className="terms">с&nbsp;условиями</span></p> : <button type="button" className="inline-back" onClick={() => go(step - 1)}>Назад</button>}<Button type="submit">Продолжить</Button></div>}
  </form>;
}
