import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';
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
      <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
        Email has been sent to {email}
      </div>
    );
  }

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Enter email</h1>
      <TextField
        placeholder='Email'
        value={email}
        type='email'
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <Button variant='primary' disabled={!email} onClick={() => handleClick()}>
        Reset password
      </Button>
    </div>
  );
};
