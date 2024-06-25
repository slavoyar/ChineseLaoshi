import { Accordion, Button, TextField } from '@shared/ui';
import { FC } from 'react';

const sections = [
  {
    id: 1,
    name: 'Travel',
  },
  {
    id: 2,
    name: 'Pets',
  },
  {
    id: 3,
    name: 'Food',
  },
];

const GroupHeader: FC<{ name: string }> = ({ name }) => (
  <div>
    {name} <span className='text-secondary-200'>(20 words)</span>
  </div>
);
const App = () => (
  <>
    <div className='flex gap-4 p-4 w-full'>
      <Button variant='primary' className='w-full'>
        Primary
      </Button>
      <Button variant='secondary' className='w-full'>
        Secondary
      </Button>
      <Button variant='text' className='w-full'>
        Text
      </Button>
    </div>
    <div className='w-7/12 m-auto flex flex-col gap-4'>
      <Accordion
        sections={sections}
        rowKey={(item) => item.id}
        header={(item) => <GroupHeader name={item.name} />}
        content={(item) => item.name}
      />
      <TextField />
    </div>
  </>
);

export default App;
