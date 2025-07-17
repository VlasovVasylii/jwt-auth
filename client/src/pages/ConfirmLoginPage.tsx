import React, { useEffect, useContext, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../http';
import { Context } from '../index';

const ConfirmLoginPage: React.FC = () => {
    const { token } = useParams();
    const { store } = useContext(Context);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirm = async () => {
            try {
                const response = await axios.get(`${API_URL}/confirm-login/${token}`, { withCredentials: true });
                if (response.data.tokens && response.data.user) {
                    localStorage.setItem('token', response.data.tokens.accessToken);
                    store.setAuth(true);
                    store.setUser(response.data.user);
                    setStatus('success');
                    setMessage('Вход подтверждён! Теперь вы можете перейти к пользователям.');
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Ошибка подтверждения входа');
                }
            } catch (e: any) {
                setStatus('error');
                setMessage(e?.response?.data?.message || 'Ошибка подтверждения входа');
            }
        };
        confirm();
        // eslint-disable-next-line
    }, [token]);

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="mb-4 text-center">Подтверждение входа</h2>
            {status === 'loading' && <div>Проверяем ссылку...</div>}
            {status === 'success' && <div className="alert alert-success">{message}<div className="mt-3 text-center"><Link to="/users" className="btn btn-success">Перейти к пользователям</Link></div></div>}
            {status === 'error' && <div className="alert alert-danger">{message}</div>}
        </div>
    );
};

export default ConfirmLoginPage; 