import { Route } from '@shared/types';
import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPassword } from './api';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      await resetPassword(email);
      setIsFetched(true);
      setTimeout(() => {
        navigate(Route.SignIn);
      }, 5000);
    } catch {
      navigate(Route.SignIn);
    }
  };

  if (isFetched) {
    return (
      <div className='m-auto grid h-full grid-cols-1 place-content-center gap-4 px-2 sm:w-full lg:w-3/12'>
        Email has been sent to {email}
      </div>
    );
  }

  return (
    <div className='m-auto grid h-full grid-cols-1 place-content-center gap-4 px-2 sm:w-full lg:w-3/12'>
      <h1 className='text-center text-2xl uppercase text-white'>Enter email</h1>
      <TextField placeholder='Email' value={email} type='email' onInput={(e) => setEmail(e.currentTarget.value)} />
      <Button variant='primary' disabled={!email} onClick={() => handleClick()}>
        Reset password
      </Button>
    </div>
  );
};
