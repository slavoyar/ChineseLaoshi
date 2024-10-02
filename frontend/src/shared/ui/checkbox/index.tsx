import { HTMLAttributes } from 'react';
import './styles.css';

interface Props extends HTMLAttributes<HTMLLabelElement> {
  label: string;
  value: boolean;
}
export const Checkbox = ({ label, value, ...props }: Props) => (
  <label htmlFor={label} className='container' {...props}>
    {label}
    <input id={label} type='checkbox' checked={value} />
    <span className='checkmark' />
  </label>
);
