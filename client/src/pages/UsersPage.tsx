import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../index';
import { IUser } from '../models/IUser';
import UserService from '../services/UserService';

const UsersPage: React.FC = () => {
    const { store } = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (store.isAuth) {
            UserService.fetchUsers().then(response => setUsers(response.data));
        }
    }, [store.isAuth]);

    return (
        <div className="container mt-4">
            <h2>Пользователи</h2>
            <div className="mt-3">
                {users.length === 0 && <div>Нет пользователей для отображения.</div>}
                {users.map(user => (
                    <div key={user.email} className="border-bottom py-2">
                        <b>{user.email}</b> — {user.isActivated ? 'Активирован' : 'Не активирован'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersPage; 