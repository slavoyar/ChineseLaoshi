import { Route } from '@shared/types';
import { AuthLayout, Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    return <AuthLayout>Email has been sent to {email}</AuthLayout>;
  }

  return (
    <AuthLayout>
      <h1 className='text-center text-2xl uppercase text-white'>Enter email</h1>
      <TextField
        placeholder='Email'
        value={email}
        type='email'
        onInput={(e) => setEmail(e.currentTarget.value)}
      />
      <Button variant='primary' disabled={!email} onClick={() => handleClick()}>
        Reset password
      </Button>
      <p className='text-sm text-white'>
        Enter your email and we will send you a link to reset your password
      </p>
      <Link className='text-primary-300' to={Route.SignIn}>
        Back to sign in
      </Link>
    </AuthLayout>
  );
};
