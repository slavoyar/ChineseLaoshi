import { FC } from 'react';
import { ButtonProps } from './types';
import './styles.css';

const Button: FC<ButtonProps> = ({ variant, children, className, ...props }) => (
  <button type='button' className={`btn btn--${variant} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
