import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router';
import Store from "./store/store";
import 'bootstrap/dist/css/bootstrap.min.css';

interface State {
    store: Store;
}

const store = new Store();

export const Context = createContext<State>({
    store
})

/**
 * Точка входа в приложение React. Оборачивает всё в MobX Context и роутер.
 */
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Context.Provider value={{
        store
    }}>
        <Router />
    </Context.Provider>
);
