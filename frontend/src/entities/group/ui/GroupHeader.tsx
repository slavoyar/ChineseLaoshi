import { FC } from 'react';

interface Props {
  name: string;
  wordCount: number;
}

const GroupHeader: FC<Props> = ({ name, wordCount }) => (
  <div>
    {name} <span className='text-secondary-200'>({wordCount} words)</span>
  </div>
);

export default GroupHeader;
