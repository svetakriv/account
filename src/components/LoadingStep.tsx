import { useEffect, useState } from 'react';

const DURATION_SECONDS = 5;

export function LoadingStep({ variant = 'fullscreen', onClose }: { variant?: 'fullscreen' | 'inline'; onClose?: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const next = Math.min((now - start) / (DURATION_SECONDS * 1000), 1);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    const completionTimer = setTimeout(() => setProgress(1), DURATION_SECONDS * 1000);
    return () => { cancelAnimationFrame(frame); clearTimeout(completionTimer); };
  }, []);
  if (progress >= 1) return <>
    {variant === 'fullscreen' && onClose && <nav className="success-close-navigation" aria-label="Навигация заявки"><button type="button" className="dialog-link dialog-close" onClick={onClose}>Закрыть</button></nav>}
    <section className={`application-success application-success--${variant}`} aria-label="Заявка принята" role="status">
      <div className="application-success-icon" aria-hidden="true"><img src="/assets/application-success-check.svg" alt="" /></div>
      <div className="application-success-copy"><h2 id={variant === 'fullscreen' ? 'application-heading' : undefined}>Ваша заявка принята</h2><p>Отследить ее статус можно в личном кабинете</p></div>
    </section>
  </>;
  if (variant === 'inline') return <section className="inline-loading" aria-label="Создаем заявку">
    <div className="inline-loading-timer" role="progressbar" aria-label="Создание заявки" aria-valuemin={0} aria-valuemax={DURATION_SECONDS} aria-valuenow={Math.floor(progress * DURATION_SECONDS)}>
      <svg viewBox="0 0 124 46" aria-hidden="true"><rect x="2" y="2" width="120" height="42" rx="10" fill="none" stroke="#ffdd2d" strokeWidth="4" pathLength="100" strokeDasharray="22 78" className={progress < 1 ? 'is-running' : ''} /></svg>
      <span>0:{String(Math.floor(progress * DURATION_SECONDS)).padStart(2, '0')}</span>
    </div>
    <h3>Создаем заявку...</h3>
    <p>Подождите немного, готовим все для открытия счета</p>
  </section>;
  return <section className="loading-step" aria-label="Проверка данных">
    <div className="loading-circle" role="progressbar" aria-label="Проверяем данные" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress * 100)}>
      <img className="loading-track" src="/assets/loading-track.svg" alt="" />
      {/* The Figma arc is replaced by a dynamic stroke so progress can reach a full circle. */}
      <svg className="loading-ring" viewBox="0 0 144 144" aria-hidden="true"><circle cx="72" cy="72" r="68" fill="none" stroke="#428bf9" strokeWidth="8" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} opacity={progress > 0 ? 1 : 0} /></svg>
      <span className="loading-clock" aria-hidden="true" />
    </div>
    <p className="loading-time">0:{String(Math.floor(progress * DURATION_SECONDS)).padStart(2, '0')}</p>
    <p className="loading-caption">Проверяем данные</p>
  </section>;
}
