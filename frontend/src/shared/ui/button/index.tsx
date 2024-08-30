import { ButtonHTMLAttributes, FC } from 'react';
import './styles.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'text';
}

export const Button: FC<ButtonProps> = ({ variant, children, className, ...props }) => (
  <button type='button' className={`btn btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);
