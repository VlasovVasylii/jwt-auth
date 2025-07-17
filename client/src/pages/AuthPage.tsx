import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { useLocation } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';

const AuthPage: React.FC = () => {
    const location = useLocation();
    const [showForgot, setShowForgot] = useState(location.pathname === '/forgot-password');

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            {showForgot ? (
                <>
                    <ForgotPasswordPage />
                    <div className="mt-3">
                        <button className="btn btn-link" onClick={() => setShowForgot(false)}>Вернуться к входу</button>
                    </div>
                </>
            ) : (
                <>
                    <LoginForm />
                </>
            )}
        </div>
    );
};

export default AuthPage; 