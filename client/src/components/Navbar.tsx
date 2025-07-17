import React, { useContext } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const { store } = useContext(Context);

    // handleLogout теперь только store.logout(), переход через Link
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">JWT Auth</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {store.isAuth ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/users">Пользователи</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/settings">Настройки</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="btn btn-outline-light ms-2" onClick={store.logout}>Выйти</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Вход</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default observer(Navbar); 