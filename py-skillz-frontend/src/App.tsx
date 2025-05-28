import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { MainLayout } from './layouts/MainLayout';
import { RoleBasedRoute } from './components/routes/RoleBasedRoute';
import { ThemeProvider } from './components/shared/ThemeProvider';

// all
import { Home } from './features/common/Home';
import { Catalog } from './features/common/Catalog';
import { NotFound } from './features/common/NotFound';
import { Profile } from './features/users/Profile';
import { Reports } from './features/common/Reports';

// Páginas de autenticación
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';

// Páginas de administrador
import { AdminPanel } from './features/admin/AdminPanel';
import { UserManagement } from './features/admin/UserManagement';
import { CourseManagement } from './features/admin/CourseManagement';

// Páginas de profesor
import { CreateCourse } from './features/teacher/CreateCourse';
import EditorTexto from './components/editorTexto/pages/EditorTexto';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { CreateTask } from './features/teacher/CreateTask';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="editor" element={<EditorTexto />} />
            <Route path="tasks/create" element={<CreateTask />} />

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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
