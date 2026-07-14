interface Props {
  name: string;
  wordCount: number;
}

export const GroupHeader = ({ name, wordCount }: Props) => (
  <span>
    {name} <span className='text-muted-foreground'>({wordCount} words)</span>
  </span>
);
