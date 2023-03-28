import { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthAPI } from '@/api';
import Cookies from 'js-cookie';
import { Toasts } from '@/components';
import { useNavigate } from 'react-router-dom';
import {
  APILecturer,
  APIStudent,
  CodeVerification,
  ForgotPassword,
  LoginData,
  User,
} from '../types/typings.t';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authAtoms } from '@/atoms';

const useAuth = () => {
  /**
   * hook states
   */
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const [forgotPassword, setForgotPassword] = useRecoilState(
    authAtoms.forgotPasswordState
  );

  /**
   * hook functions
   */
  const { mutateAsync: loginMutateAsync, isLoading: isLogging } = useMutation({
    mutationFn: (loginData: LoginData) => {
      return AuthAPI.login(loginData);
    },

    onSuccess: async (data) => {
      Cookies.set('user', JSON.stringify(data.user));

      navigate('/auth/verify-two-factory-code');
      refresh();
      Toasts.successToast(data.message);
    },
  });

  const { mutateAsync: revokeLoginsMutateAsync, isLoading: isRevokingLogins } =
    useMutation({
      mutationFn: (userId: string) => {
        return AuthAPI.revokeLogins(userId);
      },

      onSuccess: async (data) => {
        Cookies.remove('token');
        Cookies.remove('user');

        setToken(undefined);
        setUser(undefined);
        Toasts.successToast(data.message);
      },
    });

  const { mutateAsync: verifyCodeMutateAsync, isLoading: isVerifyingCode } =
    useMutation({
      mutationFn: (twoFactorCodeData: CodeVerification) => {
        return AuthAPI.verifyTwoFactorCode(twoFactorCodeData);
      },

      onSuccess: async (data) => {
        if (forgotPassword) {
          navigate('/login');
          setForgotPassword(false);
        } else {
          Cookies.set('user', JSON.stringify(data.user));
          Cookies.set('token', data.token);

          navigate('/');
          refresh();
        }

        Toasts.successToast(data.message);
      },
    });

  const {
    mutateAsync: sendEmailVerificationCodeMutateAsync,
    isLoading: isSendingEmailVerificationCode,
  } = useMutation({
    mutationFn: (forgotPassword: ForgotPassword) => {
      return AuthAPI.sendEmailVerificationCode(forgotPassword);
    },

    onSuccess: async (data) => {
      Cookies.set('user', JSON.stringify(data.user));

      navigate('/auth/verify-two-factory-code');
      // refresh();
      setForgotPassword(true);
      Toasts.successToast(data.message);
    },
  });

  const { data: lecturerProfile, isLoading: isFetchingLecturerProfile } =
    useQuery({
      queryKey: ['lecturerProfile', user?.role],
      queryFn: async ({ queryKey }) => {
        const [_, role] = queryKey;

        if (role === 'lecturer') {
          return (await AuthAPI.getLecturerProfile(user?.id!)) as APILecturer;
        }

        return null;
      },
    });

  const { data: studentProfile, isLoading: isFetchingStudentProfile } =
    useQuery({
      queryKey: ['studentProfile', user?.role],
      queryFn: async ({ queryKey }) => {
        const [_, role] = queryKey;

        if (role === 'student') {
          return (await AuthAPI.getStudentProfile(user?.id!)) as APIStudent;
        }

        return null;
      },
    });

  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');

    setToken(undefined);
    setUser(undefined);

    refresh();
    navigate('/');
  };

  const refresh = () => window.location.reload();

  useEffect(() => {
    const user = Cookies.get('user') && JSON?.parse(Cookies.get('user') || '');
    const token = Cookies.get('token');
    if (token !== undefined || token !== '') {
      setToken(token);
    }

    if (user !== undefined || user !== '') {
      setUser(user);
    }
  }, []);

  const {
    mutateAsync: updatePasswordMutateAsync,
    isLoading: isUpdatingPassword,
  } = useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return AuthAPI.updatePassword(data);
    },

    onSuccess: async (data) => {
      Toasts.successToast(data.message);
    },
  });

  return {
    user,
    token,
    loginMutateAsync,
    isLogging,
    logout,
    lecturerProfile,
    isFetchingLecturerProfile,
    studentProfile,
    isFetchingStudentProfile,
    updatePasswordMutateAsync,
    isUpdatingPassword,
    verifyCodeMutateAsync,
    isVerifyingCode,
    sendEmailVerificationCodeMutateAsync,
    isSendingEmailVerificationCode,
    revokeLoginsMutateAsync,
    isRevokingLogins,
  };
};

export default useAuth;
