import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RoleBasedRouteProps {
  requiredRoles: string[];
}

export const RoleBasedRoute = ({ requiredRoles }: RoleBasedRouteProps) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};