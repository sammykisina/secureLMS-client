/**
 * common pages
 */
export { default as Login } from './auth/Login';
export { default as VerifyTwoFactorCode } from './auth/VerifyTwoFactorCode';
export { default as Email } from './auth/Email';
export { default as RevokeLogins } from './auth/RevokeLogins';

/**
 * admin pages
 */
export { default as Students } from './admin/Students';
export { default as School } from './admin/School';

/**
 * lecturer pages
 */
export { default as LecturerTasks } from './lecturer/LecturerTasks';
export { default as Ranking } from './lecturer/Ranking';

/**
 * student pages
 */
export { default as StudentTasks } from './student/StudentTasks';
export { default as Results } from './student/Results';

/**
 * authenticated user pages
 */
export { default as Messenger } from './authenticated/Messenger';
export { default as Profile } from './authenticated/Profile';
