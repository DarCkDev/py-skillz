import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

interface RoleBasedRouteProps {
  requiredRoles: string[];
}

export const RoleBasedRoute = ({ requiredRoles }: RoleBasedRouteProps) => {
  const auth = useContext(AuthContext);
  
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { role, isAuthenticated } = auth;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};