import { ButtonHTMLAttributes, FC } from 'react';
import './styles.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'text';
}
const Button: FC<ButtonProps> = ({ variant, children, className, ...props }) => (
  <button type='button' className={`btn btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
