import { Route } from '@shared/types';
import { Button, EmptyState } from '@shared/ui';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className='m-auto flex h-full flex-col items-center justify-center md:w-9/12 xl:w-7/12'>
      <EmptyState
        motif='迷'
        title={t('notFound.title')}
        description={t('notFound.description')}
        action={
          <Button asChild>
            <Link to={Route.Root}>{t('common.backHome')}</Link>
          </Button>
        }
      />
    </div>
  );
};

export const RouteError = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const status = isRouteErrorResponse(error) ? error.status : undefined;

  const title = isNotFound ? t('notFound.title') : t('notFound.errorTitle');
  const description = isNotFound
    ? t('notFound.description')
    : status
      ? t('notFound.errorStatusDescription', { status })
      : t('notFound.errorDescription');

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
                {t('common.tryAgain')}
              </Button>
            ) : null}
            <Button asChild>
              <Link to={Route.Root}>{t('common.backHome')}</Link>
            </Button>
          </>
        }
      />
    </div>
  );
};
