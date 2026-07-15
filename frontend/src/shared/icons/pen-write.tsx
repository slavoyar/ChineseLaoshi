import { cn } from '@shared/utils';
import type { SVGProps } from 'react';

export const PenWrite = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.75'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    className={cn('size-6 shrink-0', className)}
    {...props}
  >
    <rect x='5' y='3' width='13' height='17' rx='2' />
    <path d='M8 9h7' />
    <path d='M8 13.5c2 .8 4 .8 6 0' />
    <path d='m15 16 5-5' />
    <path d='m18 13 2 2' />
  </svg>
);
