import React from 'react';

const HomePage: React.FC = () => (
    <div className="container mt-5 text-center">
        <h1>Добро пожаловать в JWT Auth!</h1>
        <p className="lead">Это современное приложение с двухфакторной аутентификацией, Google OAuth и красивым UI.</p>
        <p>Аниме — это не просто мультфильмы, это целый мир эмоций, историй и вдохновения!</p>
        <img src="https://i.imgur.com/0y8Ftya.jpg" alt="Аниме" style={{maxWidth: 350, borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.15)'}} />
        <div className="mt-4">
            <b>Приятного пользования!</b>
        </div>
    </div>
);

export default HomePage; 