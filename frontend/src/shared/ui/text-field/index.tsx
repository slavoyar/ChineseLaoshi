import './style.css';

import { forwardRef, InputHTMLAttributes } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary';
  autoFocus?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ variant = 'primary', ...props }, ref) => (
    <input ref={ref} className={`input input--${variant}`} {...props} />
  )
);
