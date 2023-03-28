import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks';
import {
  Email,
  LecturerTasks,
  Login,
  Messenger,
  Profile,
  Ranking,
  Results,
  RevokeLogins,
  School,
  StudentTasks,
  Students,
  VerifyTwoFactorCode,
} from '@/pages';

const AppRouters = () => {
  /**
   * components states
   */
  const { user } = useAuth();
  const role = user?.role;

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback='loading'>
            {role === 'admin' ? (
              <School />
            ) : role === 'lecturer' ? (
              <LecturerTasks />
            ) : role === 'student' ? (
              <StudentTasks />
            ) : (
              ''
            )}
          </Suspense>
        }
      />

      <Route
        path='/auth/login'
        element={
          <Suspense fallback='loading'>
            <Login />
          </Suspense>
        }
      />

      <Route
        path='/auth/verify-two-factory-code'
        element={
          <Suspense fallback='loading'>
            <VerifyTwoFactorCode />
          </Suspense>
        }
      />

      <Route
        path='/students'
        element={
          <Suspense fallback='loading'>
            <Students />
          </Suspense>
        }
      />

      <Route
        path='/results'
        element={
          <Suspense fallback='loading'>
            <Results />
          </Suspense>
        }
      />

      <Route
        path='/ranking'
        element={
          <Suspense fallback='loading'>
            <Ranking />
          </Suspense>
        }
      />

      <Route
        path='/messenger'
        element={
          <Suspense fallback='loading'>
            <Messenger />
          </Suspense>
        }
      />

      <Route
        path='/profile'
        element={
          <Suspense fallback='loading'>
            <Profile />
          </Suspense>
        }
      />

      <Route
        path='/email'
        element={
          <Suspense fallback='loading'>
            <Email />
          </Suspense>
        }
      />

      <Route
        path='/:id/revoke-logins'
        element={
          <Suspense fallback='loading'>
            <RevokeLogins />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AppRouters;
