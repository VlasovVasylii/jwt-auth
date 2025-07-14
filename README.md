# JWT Auth

## Описание

JWT Auth — это полнофункциональное приложение для аутентификации пользователей с использованием JWT (JSON Web Token), реализованное на стеке Node.js (Express, MongoDB) и React. Поддерживает регистрацию, подтверждение email, вход, выход, восстановление и смену пароля, а также защиту роутов и работу с Docker.

---

## Возможности
- Регистрация с подтверждением email
- Вход/выход пользователя
- Защита роутов (только для авторизованных и подтверждённых)
- Восстановление пароля через email
- Смена пароля для авторизованных
- Проверка сложности пароля (frontend + backend)
- Современный UI на React + Bootstrap
- Документация и JSDoc для всех основных компонентов
- Docker и docker-compose для быстрого запуска

---

## Структура проекта

```
jwt-auth/
  client/         # React-приложение (frontend)
  server/         # Node.js + Express + MongoDB (backend)
  docker-compose.yml
  README.md
```

### Основные папки
- `client/src/components/` — компоненты React (формы, модалки и т.д.)
- `client/src/router/` — роутинг приложения
- `server/controllers/` — контроллеры Express
- `server/services/` — бизнес-логика
- `server/models/` — модели Mongoose

---

## Быстрый старт

### 1. Клонирование и установка зависимостей
```bash
git clone <repo-url>
cd jwt-auth
cd client && npm install
cd ../server && npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` в папке `server/`:
```
PORT=5000
# Пример для облачной MongoDB (например, MongoDB Atlas)
DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/jwt-auth?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
API_URL=http://localhost:5000/api
CLIENT_URL=http://localhost:3000
```

### 3. Запуск через Docker
```bash
docker-compose up --build
```
- Фронтенд: http://localhost:3000
- Бэкенд: http://localhost:5000

### 4. Локальный запуск (без Docker)
В двух терминалах:
```bash
cd server && npm run dev
cd client && npm start
```

---

## Основные эндпоинты API
- `POST /api/registration` — регистрация
- `POST /api/login` — вход
- `POST /api/logout` — выход
- `GET /api/activate/:link` — активация аккаунта
- `POST /api/forgot-password` — запрос на сброс пароля
- `POST /api/reset-password` — сброс пароля по токену
- `GET /api/users` — получить всех пользователей (только для подтверждённых)

---

## Переменные окружения (server/.env)
- `PORT` — порт сервера
- `DB_URL` — строка подключения к облачной MongoDB (например, MongoDB Atlas)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — секреты для JWT
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` — SMTP для отправки писем
- `API_URL` — базовый URL API
- `CLIENT_URL` — URL фронтенда

> **Примечание:**
> В проекте используется облачная MongoDB (например, [MongoDB Atlas](https://www.mongodb.com/atlas)), что позволяет легко развернуть базу данных без локальной установки.

---

## Настройка SMTP для отправки писем

Для работы функций подтверждения email, восстановления и смены пароля необходимо настроить SMTP-сервер для отправки писем.

В файле `server/.env` укажите параметры SMTP:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

### Примеры для популярных сервисов

- **Gmail:**
  - SMTP_HOST=smtp.gmail.com
  - SMTP_PORT=465
  - SMTP_USER=your_email@gmail.com
  - SMTP_PASSWORD=пароль_приложения (создайте в настройках Google)

- **Yandex:**
  - SMTP_HOST=smtp.yandex.ru
  - SMTP_PORT=465
  - SMTP_USER=your_email@yandex.ru
  - SMTP_PASSWORD=ваш_пароль

- **Mail.ru:**
  - SMTP_HOST=smtp.mail.ru
  - SMTP_PORT=465
  - SMTP_USER=your_email@mail.ru
  - SMTP_PASSWORD=ваш_пароль

> **Важно!**
> - Для Gmail используйте "Пароль приложения" (не основной пароль аккаунта).
> - Не публикуйте SMTP-пароли в публичных репозиториях.
> - Для корпоративной почты уточните настройки у администратора.