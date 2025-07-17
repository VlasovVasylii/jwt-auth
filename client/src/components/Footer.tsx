import React, { useEffect, useState } from 'react';

const Footer: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    useEffect(() => {
        const handler = () => setTheme(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);
    return (
        <footer className={`text-center text-lg-start mt-auto py-3 border-top bg-${theme === 'dark' ? 'dark' : 'light'}`}>
            <div className="container">
                <span className={`text-${theme === 'dark' ? 'light' : 'muted'}`}>© 2024 JWT Auth. Для справки: support@example.com</span>
            </div>
        </footer>
    );
};

export default Footer; 