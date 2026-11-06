import type { ButtonHTMLAttributes } from 'react';

// Desktop geometry and colors observed on the source page; no submission behavior.
export function Button({ children, className = '', appearance = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { appearance?: 'primary' | 'outline' | 'white' }) {
  return <button type="button" className={`button button--${appearance} ${className}`} {...props}>{children}</button>;
}

export function PhoneInput() {
  return <div className="phone-field"><label htmlFor="phone">Телефон</label><input id="phone" type="tel" aria-label="Телефон" autoComplete="off" readOnly value="" tabIndex={0} /></div>;
}
