import { tariffs } from '../data';
import { Button } from './Controls';

function scrollToApplicationForm() {
  const form = document.querySelector<HTMLElement>('.application-form');
  if (!form) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  form.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  window.setTimeout(() => form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true }), reducedMotion ? 0 : 650);
}

function TariffCard({ tariff, index }: { tariff: typeof tariffs[number]; index: number }) {
  return <article className={`tariff tariff--${index}`}>
    <h3>{tariff.name}</h3><p className="tariff-description">{tariff.description}</p>
    <dl className="tariff-details">
      <div><dt>Переводы себе на карты Т-Банка для ИП</dt><dd>До {tariff.limit} ₽ без комиссии</dd></div>
      <div><dt>Переводы физлицам и себе на карты ИП сверх лимита, снятие наличных</dt><dd>{tariff.rates.map(rate => <span key={rate}>{rate}</span>)}</dd></div>
      <div><dt>Переводы ИП и юрлицам внутри Т-Банка</dt><dd>Бесплатно</dd></div>
      <div><dt>Переводы ИП и юрлицам в другие банки по номеру счета</dt><dd>{tariff.payment} ₽ за платеж</dd></div>
    </dl>
    <div className="tariff-bonus"><img src={`/assets/${tariff.gift}`} alt=""/>Первые 2 месяца — 0 ₽</div>
    <div className="tariff-price"><h3>{tariff.price} ₽ в месяц</h3><p>{tariff.condition}</p></div>
    <Button appearance={index === 0 ? 'outline' : 'white'} onClick={scrollToApplicationForm}>Подключить</Button>
  </article>;
}
export function Tariffs() {
  return <section className="tariffs" aria-labelledby="tariff-title"><h2 id="tariff-title">Предсказуемые расходы<br/>на обслуживание: тарифы без скрытых списаний</h2><div className="tariff-grid">{tariffs.map((tariff, index) => <TariffCard key={tariff.name} tariff={tariff} index={index}/>)}</div></section>;
}
