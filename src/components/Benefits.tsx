const benefits = ['Открытие счета — бесплатно', 'Обслуживание счета — от 0 ₽', 'Партнерские бонусы до 500 000 ₽', 'Индивидуальная поддержка 24/7'];
export function Benefits() {
  return <ul className="benefits">{benefits.map((text, i) => <li key={text}><span className="benefit-icon"><span style={{ maskImage: `url(/assets/icon-${i}.svg)` }} /></span><p>{text}</p></li>)}</ul>;
}
