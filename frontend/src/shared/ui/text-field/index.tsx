import { FC, InputHTMLAttributes } from 'react';
import './style.css';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary';
}

export const TextField: FC<TextFieldProps> = ({ variant = 'primary', ...props }) => (
  <input className={`input input--${variant}`} {...props} />
);
