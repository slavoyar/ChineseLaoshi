import { Route } from '@shared/types';
import { Button, EmptyState } from '@shared/ui';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className='m-auto flex h-full flex-col items-center justify-center md:w-9/12 xl:w-7/12'>
      <EmptyState
        motif='迷'
        title='Page not found'
        description='This path does not lead anywhere in 中国老师. Head home and keep studying.'
        action={
          <Button asChild>
            <Link to={Route.Root}>Back home</Link>
          </Button>
        }
      />
    </div>
  );
};

export const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const status = isRouteErrorResponse(error) ? error.status : undefined;

  const title = isNotFound ? 'Page not found' : 'Something went wrong';
  const description = isNotFound
    ? 'This path does not lead anywhere in 中国老师. Head home and keep studying.'
    : status
      ? `An unexpected error occurred (${status}). You can try again or return home.`
      : 'An unexpected error occurred. You can try again or return home.';

  return (
    <div className='m-auto flex h-full flex-col items-center justify-center md:w-9/12 xl:w-7/12'>
      <EmptyState
        motif={isNotFound ? '迷' : '错'}
        title={title}
        description={description}
        action={
          <>
            {!isNotFound ? (
              <Button variant='outline' onClick={() => navigate(0)}>
                Try again
              </Button>
            ) : null}
            <Button asChild>
              <Link to={Route.Root}>Back home</Link>
            </Button>
          </>
        }
      />
    </div>
  );
};
