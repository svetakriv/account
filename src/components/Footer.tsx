import { legalLinks } from '../data';
export function Footer() {
  return <footer className="footer"><div className="container">
    <div className="footer-top"><div className="footer-menu">{['О банке', 'Банк', 'Бизнес', 'Инвестиции', 'Страхование', 'Сим-карта', 'Путешествия', 'Город'].map(text => <span key={text}>{text}</span>)}</div><div className="footer-phone"><b>8 800 600-66-66</b><span>Для звонков по России</span></div><div className="footer-phone"><b>0808</b><span>Короткий номер</span></div></div>
    <p className="footer-disclaimer">Premium — премиум, премиальный.<br/>Лимит бесплатных переводов 3 700 000 ₽ доступен при подключении сервиса T-Premium и двух пакетов «Физлицам — без комиссии». Сумма складывается из переводов на кредитные и дебетовые карты Т-Банка.</p>
    <div className="footer-legal">{legalLinks.map(text => <span key={text}>{text}</span>)}</div>
    <div className="footer-bottom"><span>© 2006—2026, АО «ТБанк», официальный сайт, универсальная лицензия ЦБ РФ № 2673</span><div className="footer-social">{[4,5,6,7,8].map(i => <span key={i} style={{maskImage:`url(/assets/icon-${i}.svg)`}}/>)}</div></div>
  </div></footer>;
}
