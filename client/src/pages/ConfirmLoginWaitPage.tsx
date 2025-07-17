import React from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmLoginWaitPage: React.FC = () => {
    const location = useLocation();
    const message = location.state?.message || 'На вашу почту отправлено письмо для подтверждения входа. Пожалуйста, перейдите по ссылке из письма, чтобы завершить вход.';
    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <div className="alert alert-warning text-center">
                <h4>Требуется подтверждение входа</h4>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default ConfirmLoginWaitPage; 