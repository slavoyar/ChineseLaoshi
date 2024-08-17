import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
<<<<<<<< HEAD:frontend/src/pages/sign-in/index.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';
import { useAuthStore } from '@shared/stores';

export const SignIn = () => {
========
import { useNavigate } from 'react-router-dom';
import { Route } from '@shared/types';
import { useAuthStore } from '@shared/stores';

const SignIn = () => {
>>>>>>>> 9783300 (Refactor auth and add registration (#12) (#13)):frontend/src/pages/sign-in/SignIn.tsx
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();
  const handleClick = async () => {
    await login(username, password);
    navigate(Route.Root);
  };

  const keyUpHandler = async (key: string) => {
    if (key === 'Enter') {
      await handleClick();
    }
  };

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Sign In</h1>
      <TextField
        placeholder='Username'
        value={username}
        onInput={(e) => setUsername(e.currentTarget.value)}
      />
      <TextField
        placeholder='Password'
        value={password}
        onInput={(e) => setPassword(e.currentTarget.value)}
        onKeyUp={(e) => keyUpHandler(e.key)}
        type='password'
      />
      <Button variant='primary' onClick={() => handleClick()}>
        Sign In
      </Button>
      <div className='text-white'>
        Do not have an account?{' '}
<<<<<<<< HEAD:frontend/src/pages/sign-in/index.tsx
        <Link className='text-primary-300' to={Route.SignUp}>
          Sign Up
        </Link>
      </div>
      <Link className='text-primary-300' to={Route.ResetPassword}>
        Forget password?
      </Link>
    </div>
  );
};
========
        <a className='text-primary-300' href={Route.SignUp}>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default SignIn;
>>>>>>>> 9783300 (Refactor auth and add registration (#12) (#13)):frontend/src/pages/sign-in/SignIn.tsx
