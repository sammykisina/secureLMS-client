import {
  CodeVerification,
  ForgotPassword,
  LoginData,
} from '../types/typings.t';
import { API } from './api';

const AuthAPI = {
  login: async (data: LoginData) => API.post('/auth/login', data),

  verifyTwoFactorCode: async (data: CodeVerification) =>
    API.post(`/auth/${data.userId}/verify-two-factor-code`, data),

  getLecturerProfile: async (lecturerId: number) =>
    API.get(
      `/lecturer/${lecturerId}/profile?include=tasks.unit,tasks.questions.answers,tasks.results.student,discussions.owner,discussions.unit,discussions.comments.owner`
    ),

  getStudentProfile: async (studentId: number) =>
    API.get(
      `/student/${studentId}/profile?include=discussions.owner,discussions.unit,discussions.comments.owner`
    ),

  updatePassword: async (data: { email: string; password: string }) =>
    API.post('/auth/password-reset', data),

  sendEmailVerificationCode: async (data: ForgotPassword) =>
    API.post(`/auth/forgot-password`, data),

  revokeLogins: async (userId: string) =>
    API.get(`/auth/${userId}/revoke-logins`),
};

export default AuthAPI;
