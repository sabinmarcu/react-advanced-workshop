import { CircularProgress } from '@material-ui/core';
import { useEffect } from 'react';
import { withAuth } from '../components/RouteGuard';
import { useFetch } from '../hooks/useFetch';

export const PreviewScreen = withAuth(
  () => {
    const [{
      isLoaded, isLoading, data, error,
    }, fetch] = useFetch('/me');
    useEffect(
      () => {
        fetch();
      },
      [],
    );
    return (
      <>
        {isLoading && <CircularProgress />}
        {isLoaded && data && (
          <code>
            {JSON.stringify(data)}
          </code>
        )}
        {isLoaded && error && (
          <>
            <h1>Error</h1>
            <code>
              {JSON.stringify(error)}
            </code>
          </>
        )}
      </>
    );
  },
);
