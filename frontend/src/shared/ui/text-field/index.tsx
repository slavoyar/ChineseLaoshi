import { InputHTMLAttributes, forwardRef } from 'react';
import './style.css';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary';
  autoFocus?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ variant = 'primary', ...props }, ref) => (
    <input ref={ref} className={`input input--${variant}`} {...props} />
  )
);
