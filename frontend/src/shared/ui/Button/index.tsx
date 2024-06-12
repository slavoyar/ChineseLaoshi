import { FC } from 'react';
import { ButtonProps } from './types';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import TextButton from './TextButton';

const Button: FC<ButtonProps> = ({ variant, ...props }) => {
  switch (variant) {
    case 'primary':
      return <PrimaryButton {...props} />;
    case 'secondary':
      return <SecondaryButton {...props} />;
    case 'text':
    default:
      return <TextButton {...props} />;
  }
};

export default Button;
