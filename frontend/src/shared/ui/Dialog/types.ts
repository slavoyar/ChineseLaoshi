import { HTMLAttributes, ReactNode } from 'react';

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  footer: ReactNode;
  title: string;
  onClose: () => void;
}
