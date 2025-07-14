import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

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
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm />
                <button onClick={getUsers}>Получить пользователей</button>
                {users.map(user => (
                    <div key={user.email}>
                        <b>{user.email}</b> — {user.isActivated ? "Активирован" : "Не активирован"}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="App">
            <h1>{`Пользователь авторизован ${store.user.email}`}</h1>
            <h1>{store.user.isActivated ? "Аккаунт подтвержден по почте" : "Подтвердите аккаунт!!"}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <button onClick={getUsers}>Получить пользователей</button>
            {users.map(user => (
                <div key={user.email}>
                    <b>{user.email}</b> — {user.isActivated ? "Активирован" : "Не активирован"}
                </div>
            ))}
        </div>
    );
}

export default observer(App);
