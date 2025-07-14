import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";
import { Routes, Route } from 'react-router-dom';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import ResetPasswordForm from './components/ResetPasswordForm';
import ChangePasswordModal from './components/ChangePasswordModal';

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        if (localStorage['token']) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <Routes>
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            <Route path="/" element={
                !store.isAuth ? (
                    <div>
                        <LoginForm />
                    </div>
                ) : (
                    <div className="container mt-5">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="card p-4 shadow-sm">
                                    <h1 className="mb-3">Пользователь авторизован: <span className="text-primary">{store.user.email}</span></h1>
                                    <h4 className={store.user.isActivated ? "text-success" : "text-warning"}>
                                        {store.user.isActivated ? "Аккаунт подтвержден по почте" : "Подтвердите аккаунт!!"}
                                    </h4>
                                    <div className="d-flex gap-2 my-3">
                                        <button onClick={() => store.logout()} className="btn btn-danger">Выйти</button>
                                        {store.user.isActivated && (
                                            <>
                                                <button onClick={getUsers} className="btn btn-secondary">Получить пользователей</button>
                                                <button onClick={() => setShowChangePassword(true)} className="btn btn-outline-primary">Сменить пароль</button>
                                            </>
                                        )}
                                    </div>
                                    {store.user.isActivated && (
                                        <ul className="list-group mt-3">
                                            {users.map(user => (
                                                <li key={user.email} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <span><b>{user.email}</b></span>
                                                    <span className={user.isActivated ? "badge bg-success" : "badge bg-warning text-dark"}>
                                                        {user.isActivated ? "Активирован" : "Не активирован"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <ChangePasswordModal show={showChangePassword} onClose={() => setShowChangePassword(false)} email={store.user.email} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } />
        </Routes>
    );
}

export default observer(App);
