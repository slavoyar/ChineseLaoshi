import { Button } from '@shared/ui';
import Accordion from '@shared/ui/Accordion';

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
    <div className='w-7/12 m-auto'>
      <Accordion
        sections={sections}
        rowKey={(item) => item.id}
        header={(item) => item.name}
        content={(item) => item.name}
      />
    </div>
  </>
);

export default App;
