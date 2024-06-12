import { Button } from '@shared/ui';

const App = () => (
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
);

export default App;
