import { useEffect, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { MainLayout } from './layouts/MainLayout';
import { BackButton } from './components/shared/BackButton';
import EditorTexto from './components/editorTexto/pages/EditorTexto';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';

//ejemplo de paginas
const Home = () => (
  <div>
    <h1>Home Page</h1>
  </div>
);

const Catalog = () => (
  <div>
    <BackButton />
    <h1>Catalog Page</h1>
  </div>
);

const Profile = () => (
  <div>
    <BackButton />
    <h1>Profile Page</h1>
  </div>
);

const AdminPanel = () => (
  <div>
    <BackButton />
    <h1>Admin Panel Page</h1>
  </div>
);

const UserManagement = () => (
  <div>
    <BackButton />
    <h1>User Management Page</h1>
  </div>
);

const CourseManagement = () => (
  <div>
    <BackButton />
    <h1>Course Management Page</h1>
  </div>
);

const CreateCourse = () => (
  <div>
    <BackButton />
    <h1>Create Course Page</h1>
  </div>
);

const Reports = () => (
  <div>
    <BackButton />
    <h1>Reports Page</h1>
  </div>
);

const Login = () => (
  <div>
    <BackButton />
    <h1>Login Page</h1>
  </div>
);

const Register = () => (
  <div>
    <BackButton />
    <h1>Register Page</h1>
  </div>
);

const NotFound = () => (
  <div>
    <BackButton />
    <h1>404 - Página no encontrada</h1>
  </div>
);

// Simulamos un hook para obtener el rol del usuario
const useAuth = () => {
  
  return {
    isAuthenticated: false,
    role: 'guest', 
    loading: false
  };
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

interface RoleBasedRouteProps {
  requiredRoles: string[];
  children: ReactNode;
}

// Componente para rutas basadas en roles
const RoleBasedRoute = ({ requiredRoles, children }: RoleBasedRouteProps) => {
  const { role, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { i18n } = useTranslation();
  const { loading } = useAuth();
  const { toasts } = useToast();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  //recordatorio mejorar loading
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="catalog" element={<MainLayout><Catalog /></MainLayout>} />
          <Route path="editor" element={<MainLayout><EditorTexto /></MainLayout>} />
          
          {/* Rutas protegidas */}
          <Route path="profile" element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Rutas de admin */}
          <Route path="admin" element={
            <RoleBasedRoute requiredRoles={['admin']}>
              <MainLayout><AdminPanel /></MainLayout>
            </RoleBasedRoute>
          } />
          
          <Route path="admin/users" element={
            <RoleBasedRoute requiredRoles={['admin']}>
              <MainLayout><UserManagement /></MainLayout>
            </RoleBasedRoute>
          } />
          
          <Route path="admin/courses" element={
            <RoleBasedRoute requiredRoles={['admin']}>
              <MainLayout><CourseManagement /></MainLayout>
            </RoleBasedRoute>
          } />

          {/* Rutas de profesor */}
          <Route path="courses/create" element={
            <RoleBasedRoute requiredRoles={['admin', 'teacher']}>
              <MainLayout><CreateCourse /></MainLayout>
            </RoleBasedRoute>
          } />
          
          <Route path="reports" element={
            <RoleBasedRoute requiredRoles={['admin', 'teacher']}>
              <MainLayout><Reports /></MainLayout>
            </RoleBasedRoute>
          } />

          {/* Ruta 404 */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
      <Toaster toasts={toasts} />
    </>
  );
}

export default App;
