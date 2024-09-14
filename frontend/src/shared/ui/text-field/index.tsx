import { InputHTMLAttributes, forwardRef } from 'react';
import './style.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary';
  autoFocus?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, Props>(
  ({ variant = 'primary', ...props }, ref) => (
    <input ref={ref} className={`input input--${variant}`} {...props} />
  )
);
