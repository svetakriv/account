import { ApplicationForm } from './components/ApplicationForm';
import { Benefits } from './components/Benefits';
import { Tariffs } from './components/Tariffs';
import { Footer } from './components/Footer';
import { InlineApplicationForm } from './components/InlineApplicationForm';
export function App({ variant = 'a' }: { variant?: 'a' | 'b' }) {
  return <><header className="header"><div className="container"><img src="/assets/33447f85-5b92-42f9-8d88-509bd152b47c.svg" alt="Т-Банк" width="29" height="34"/></div></header>
    <main><div className="container"><section className={`hero${variant === 'b' ? ' hero--inline' : ''}`} aria-labelledby="hero-title"><div className="hero-main"><div className="hero-copy"><h1 id="hero-title">Откройте бизнес-счет<br/>за 0 ₽</h1><p className="hero-subtitle">Онлайн, без поездок в банк</p>{variant === 'b' ? <InlineApplicationForm/> : <ApplicationForm/>}</div><div className="hero-art"><img src="/assets/hero-business.png" alt="Бизнес-карта Т-Банка, папка и настольная печать"/></div></div><Benefits/></section><Tariffs/></div></main>
    <Footer/></>;
}
