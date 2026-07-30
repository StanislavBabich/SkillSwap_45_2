import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/pages/Layout/Layout';
import { AuthLayout } from '@/pages/Layout/AuthLayout';
import { PrivateRoute } from './PrivateRoute';
import { MainPage } from '@/pages/MainPage/MainPage';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SkillPage } from '@/pages/SkillPage/SkillPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ServerErrorPage } from '@/pages/ServerErrorPage';
import { AboutPage } from '@/pages/AboutPage';
import { RegisterPage } from '@pages/RegisterPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Публичные маршруты с обычным Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="skill/:id" element={<SkillPage />} />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Защищённый favorites */}
        <Route
          path="favorites"
          element={
            <PrivateRoute>
              <FavoritesPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
        <Route path="server-error" element={<ServerErrorPage />} />
      </Route>

      {/* Маршруты авторизации со специальным AuthLayout */}
      <Route
        path="/login"
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
    </Routes>
  );
};
