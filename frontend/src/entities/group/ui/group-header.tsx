interface Props {
  name: string;
  wordCount: number;
}

export const GroupHeader = ({ name, wordCount }: Props) => (
  <div>
    {name} <span className='text-secondary-200'>({wordCount} words)</span>
  </div>
);
