import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthService } from '@/features/auth';

type PrivateRouteProps = {
  children?: React.ReactNode;
};

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children ? <>{children}</> : <Outlet />;
};