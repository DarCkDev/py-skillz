import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { MainLayout } from './layouts/MainLayout';
import { RoleBasedRoute } from './components/routes/RoleBasedRoute';
import { ThemeProvider } from './components/shared/ThemeProvider';
import { LoadingProvider } from './context/LoadingContext';
import { LoadingIndicator } from './components/shared/LoadingIndicator';

// all
const Home = lazy(() => import('./features/common/Home').then(module => ({ default: module.Home })));
const Catalog = lazy(() => import('./features/common/Catalog').then(module => ({ default: module.Catalog })));
const NotFound = lazy(() => import('./features/common/NotFound').then(module => ({ default: module.NotFound })));
const Profile = lazy(() => import('./features/users/Profile').then(module => ({ default: module.Profile })));
const Reports = lazy(() => import('./features/common/Reports').then(module => ({ default: module.Reports })));

// Páginas de autenticación
const Login = lazy(() => import('./features/auth/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./features/auth/Register').then(module => ({ default: module.Register })));

// Páginas de administrador
const AdminPanel = lazy(() => import('./features/admin/AdminPanel').then(module => ({ default: module.AdminPanel })));
const UserManagement = lazy(() => import('./features/admin/UserManagement').then(module => ({ default: module.UserManagement })));
const CourseManagement = lazy(() => import('./features/admin/CourseManagement').then(module => ({ default: module.CourseManagement })));

// Páginas de profesor
const CreateCourse = lazy(() => import('./features/teacher/CreateCourse').then(module => ({ default: module.CreateCourse })));
const EditorTexto = lazy(() => import('./components/editorTexto/pages/EditorTexto'));
const CreateTask = lazy(() => import('./features/teacher/CreateTask').then(module => ({ default: module.CreateTask })));
const MyCourses = lazy(() => import('./features/common/MyCourses').then(module => ({ default: module.MyCourses })));

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  return (
    <ThemeProvider>
      <LoadingProvider>
        <LoadingIndicator />
        <BrowserRouter>
          <Suspense fallback={<LoadingIndicator />}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="editor" element={<EditorTexto />} />
                <Route path="tasks/create" element={<CreateTask />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route element={<RoleBasedRoute requiredRoles={['ADMIN', 'TEACHER', 'STUDENT']} />}>
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* Rutas de admin */}
                <Route element={<RoleBasedRoute requiredRoles={['ADMIN']} />}>
                  <Route path="admin" element={<AdminPanel />} />
                  <Route path="admin/users" element={<UserManagement />} />
                  <Route path="admin/courses" element={<CourseManagement />} />
                </Route>
                
                
                {/* Rutas de profesor */}
                <Route element={<RoleBasedRoute requiredRoles={['ADMIN', 'TEACHER']} />}>
                  <Route path="reports" element={<Reports />} />
                  <Route path="courses/create" element={<CreateCourse />} />
                </Route>
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
