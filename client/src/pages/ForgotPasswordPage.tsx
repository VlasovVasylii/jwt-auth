import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../http';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_URL}/forgot-password`, { email });
            setMessage('Письмо для сброса пароля отправлено, если такой email зарегистрирован.');
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Ошибка при отправке письма');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="mb-4 text-center">Восстановление пароля</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    Отправить ссылку для сброса
                </button>
                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
        </div>
    );
};

export default ForgotPasswordPage; 