import { Accordion, Button, CreateDialog, TextField } from '@shared/ui';
import { FC, useState } from 'react';
import { WriteCard } from '@entities/card';

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
const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className='flex gap-4 p-4 w-full'>
        <Button
          variant='primary'
          className='w-full'
          onClick={() => setIsDialogOpen((prev) => !prev)}
        >
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
      <CreateDialog
        onSave={() => console.log('save')}
        isOpen={isDialogOpen}
        title='Create group'
        onClose={() => setIsDialogOpen(false)}
      >
        <TextField placeholder='Enter group name' />
      </CreateDialog>
      <div className='w-7/12 m-auto flex flex-col gap-4'>
        <WriteCard
          id='123'
          symbols='我是俄罗斯人'
          transcription='Wǒ shì èluósī rén'
          translation='Я русский'
        />
      </div>
    </>
  );
};

export default App;
