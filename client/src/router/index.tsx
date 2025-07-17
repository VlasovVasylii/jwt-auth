import AuthPage from '../pages/AuthPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UsersPage from '../pages/UsersPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ConfirmLoginPage from '../pages/ConfirmLoginPage';
import ConfirmLoginWaitPage from '../pages/ConfirmLoginWaitPage';

export const publicRoutes = [
    { path: '/login', element: <AuthPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password/:token', element: <ResetPasswordPage /> },
    { path: '/confirm-login/:token', element: <ConfirmLoginPage /> },
    { path: '/settings', element: <SettingsPage /> },
    { path: '/confirm-login-wait', element: <ConfirmLoginWaitPage /> },
];

export const privateRoutes = [
    { path: '/users', element: <UsersPage /> },
];

export const commonRoutes = [
    { path: '*', element: <NotFoundPage /> },
];