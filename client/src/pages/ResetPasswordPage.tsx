import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../http';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== confirm) {
            setError('Пароли не совпадают');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/reset-password`, { token, password });
            setSuccess('Пароль успешно изменён! Теперь вы можете войти.');
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Ошибка при смене пароля');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 400 }}>
            <h2 className="mb-4 text-center">Смена пароля</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Новый пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Повторите пароль"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        required
                    />
                </div>
                <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                    Сменить пароль
                </button>
                {success && <div className="alert alert-success mt-3">{success}<div className="mt-3 text-center"><Link to="/login" className="btn btn-success">Войти</Link></div></div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
        </div>
    );
};

export default ResetPasswordPage; 