import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const AuthenticationGuard = ({ component }) => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => {
      <div className="flex h-screen w-screen items-center justify-center">
        <span>Loading...</span>
      </div>;
    },
  });

  return isAuthenticated ? <Component /> : null;
};
