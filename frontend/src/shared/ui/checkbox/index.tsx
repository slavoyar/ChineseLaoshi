import './styles.css';

import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  value: boolean;
}
export const Checkbox = ({ label, value, ...props }: Props) => (
  <label htmlFor={label} className='container'>
    {label}
    <input id={label} type='checkbox' defaultChecked={value} {...props} />
    <span className='checkmark' />
  </label>
);
