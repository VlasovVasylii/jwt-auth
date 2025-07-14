import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {store} = useContext(Context);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        store.login(email, password);
    };
    const handleRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        store.registration(email, password);
    };

    return (
        <form>
            <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Email"
            />
            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
            />
            <button onClick={handleLogin}>
                Логин
            </button>
            <button onClick={handleRegistration}>
                Регистрация
            </button>
        </form>
    );
};

export default observer(LoginForm);