import React, { useContext, useState } from 'react';
import { Context } from '../index';
import axios from 'axios';
import { API_URL } from '../http';

const SettingsPage: React.FC = () => {
    const { store } = useContext(Context);
    const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [twoFAloading, setTwoFAloading] = useState(false);

    const handleThemeChange = (t: 'light' | 'dark') => {
        setTheme(t);
        localStorage.setItem('theme', t);
        document.body.className = t === 'dark' ? 'bg-dark text-light' : '';
    };

    const handleChangePassword = async () => {
        setLoading(true);
        setMessage('');
        try {
            await axios.post(`${API_URL}/change-password`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessage('Письмо для смены пароля отправлено на вашу почту.');
        } catch (e: any) {
            setMessage(e?.response?.data?.message || 'Ошибка при отправке письма');
        } finally {
            setLoading(false);
        }
    };

    const handle2FAToggle = async () => {
        setTwoFAloading(true);
        setMessage('');
        try {
            if (!store.user?.twoFactorEnabled) {
                await axios.post(`${API_URL}/2fa/enable`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMessage('Двухфакторная аутентификация включена.');
            } else {
                await axios.post(`${API_URL}/2fa/disable`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMessage('Двухфакторная аутентификация отключена.');
            }
            await store.checkAuth(); // Синхронизируем пользователя
        } catch (e: any) {
            setMessage(e?.response?.data?.message || 'Ошибка при изменении 2FA');
        } finally {
            setTwoFAloading(false);
        }
    };

    const twoFA = store.user?.twoFactorEnabled ?? false;

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <h2 className="mb-4">Настройки</h2>
            <div className="mb-4">
                <label className="form-label">Тема:</label>
                <div className="btn-group ms-3">
                    <button className={`btn btn-${theme === 'light' ? 'primary' : 'outline-primary'}`} onClick={() => handleThemeChange('light')}>Светлая</button>
                    <button className={`btn btn-${theme === 'dark' ? 'primary' : 'outline-primary'}`} onClick={() => handleThemeChange('dark')}>Тёмная</button>
                </div>
            </div>
            {store.isAuth && (
                <>
                    <div className="mb-4">
                        <label className="form-label">Смена пароля:</label>
                        <button className="btn btn-warning ms-3" onClick={handleChangePassword} disabled={loading}>
                            Отправить письмо для смены пароля
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Двухфакторная аутентификация (2FA):</label>
                        <span className={`badge ms-2 ${twoFA ? 'bg-success' : 'bg-secondary'}`}>{twoFA ? 'Включена' : 'Отключена'}</span>
                        <button
                            className={`btn ms-3 ${twoFA ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={handle2FAToggle}
                            disabled={twoFAloading}
                        >
                            {twoFA ? 'Отключить' : 'Включить'}
                        </button>
                    </div>
                </>
            )}
            {message && <div className="alert alert-info">{message}</div>}
        </div>
    );
};

export default SettingsPage; 