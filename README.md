# JWT Auth

Возможные улучшения
- Починить все основные функции проекта и проверить все еще раз
- Добавить страницу с поиском и бесконечно лентой(каких нибудь данных фейковых, заполнить их в бдшку), не забыть про оптимизации
- Добавить наиболее используемые хуки в проект с документацией подробной
- Добавить страницу с загрузкой на сервер файлов и соответственно их выгрузкой(например видео mp4)
- Добавить страницу с отображением данных в виде таблицы(React, Chakra)
- Добавить пару графиков (Chart JS) на главную
- Убедитесь, что токен 2FA удаляется после первого использования.
- Не раскрывайте детали ошибки при неудачном подтверждении (например, не сообщайте, что токен уже использован).
- Проверьте, что Google OAuth не позволяет входить без email (email обязателен).
- Убедитесь, что при связывании Google-аккаунта с существующим email не возникает race condition.
- Настройте SPF/DKIM/DMARC для домена отправителя.
- Не вставляйте токены в письма в явном виде (используйте ссылки).
- Для сложных сценариев (например, смена email, удаление аккаунта) предусмотреть отдельные ручки и подтверждения.
- Кэшировать часто используемые данные на фронте (например, профиль пользователя).
- Для отправки писем использовать очереди (RabbitMQ, Bull) при высокой нагрузке.
- Для Google OAuth: убедиться, что нельзя войти без подтверждённого email.
- Для 2FA: добавить лимит на количество писем/попыток подтверждения.
- Для логина: добавить задержку/капчу при множественных неудачных попытках.
- Масштабирование: вынести отправку писем и тяжёлые задачи в отдельные воркеры.
- Мониторинг: добавить логирование ошибок (например, через Sentry) и мониторинг производительности.
- Аудит действий: логировать важные действия пользователя (смена пароля, включение 2FA, входы).
- Резервное копирование: регулярный бэкап базы данных.
- Документация: Swagger для backend-ручек.
---

## Описание

JWT Auth — это полнофункциональное приложение для аутентификации пользователей с использованием JWT (JSON Web Token), реализованное на стеке Node.js (Express, MongoDB) и React. Поддерживает регистрацию, подтверждение email, вход, выход, восстановление и смену пароля, а также защиту роутов и работу с Docker.

---

## Возможности
- Регистрация с подтверждением email
- Вход/выход пользователя
- Вход и регистрация через Google (OAuth 2.0, без пароля)
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
- `GOOGLE_CLIENT_ID` — Client ID для Google OAuth
- `GOOGLE_CLIENT_SECRET` — Client Secret для Google OAuth

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

---

## Вход и регистрация через Google (OAuth 2.0)

Теперь вы можете входить и регистрироваться в один клик через Google-аккаунт — без пароля и подтверждения email!

### Как это работает
- На странице входа нажмите кнопку "Войти через Google".
- Приложение перенаправит вас на страницу авторизации Google.
- После успешного входа вы сразу попадёте в личный кабинет.
- Если email уже зарегистрирован — аккаунты будут связаны.
- Пароль не требуется, подтверждение email не нужно.

### Как получить GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET
1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Создайте новый проект (или выберите существующий).
3. Включите People API (API и сервисы → Библиотека → Google People API → Включить).
4. Перейдите в "Учётные данные" → "Создать учётные данные" → "OAuth 2.0 Client ID".
5. Укажите тип приложения "Веб-приложение".
6. В "Разрешённые URI для перенаправления" добавьте:
   - http://localhost:5000/api/auth/google/callback
   (или production-адрес)
7. Сохраните — скопируйте **Client ID** и **Client Secret**.

### Переменные окружения для Google OAuth (server/.env)
```
GOOGLE_CLIENT_ID=ваш_client_id
GOOGLE_CLIENT_SECRET=ваш_client_secret
```

### После настройки
- Перезапустите backend: `docker-compose up --build` или `npm run dev` в server.
- Кнопка "Войти через Google" появится на странице входа.
- После успешной авторизации пользователь сразу попадает в систему.

**Важно:**
- Для production-версии укажите production-адрес в redirect URI (например, https://yourdomain.com/api/auth/google/callback).
- Никогда не публикуйте свой GOOGLE_CLIENT_SECRET в открытых репозиториях!
- Если меняете адрес или порт — не забудьте обновить redirect URI в Google Cloud Console.

### Пример использования
- Кнопка "Войти через Google" доступна на странице входа.
- После успешной авторизации вы сразу авторизованы в системе.
- Все токены и сессии работают так же, как при обычном входе.

---

## Миграции базы данных (MongoDB)

В проекте используется [migrate-mongo](https://github.com/seppevs/migrate-mongo) для управления миграциями схемы MongoDB.

### Как настроить
- Строка подключения и имя базы берутся из файла `server/.env` (переменные `DB_URL` и `DB_NAME`).
- Конфиг миграций: `migrate-mongo-config.js` (корень проекта).
- Миграции хранятся в папке `migrations/` (корень проекта).

### Основные команды

```bash
# Создать новую миграцию
npx migrate-mongo create <название-миграции>

# Применить все новые миграции
npx migrate-mongo up

# Откатить последнюю миграцию
npx migrate-mongo down
```

### Пример переменных окружения для миграций
В файле `server/.env`:
```
DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<db>?retryWrites=true&w=majority
DB_NAME=jwt-auth
```

### Пример миграции (создание коллекции users)
```js
// migrations/XXXXXXXXXXXXXX-init-users-collection.js
module.exports = {
  async up(db) {
    await db.createCollection('users', { /* ... */ });
  },
  async down(db) {
    await db.collection('users').drop();
  }
};
```

> **Важно:**
> - Перед запуском миграций убедитесь, что переменные окружения корректно указаны в `server/.env`.
> - Для облачной MongoDB (Atlas) используйте строку подключения вида `mongodb+srv://...`.

---

## Безопасность

### Сервер (Node.js, Express)
- **Helmet** — устанавливает безопасные HTTP-заголовки (защита от XSS, clickjacking и др.).
- **express-rate-limit** — ограничивает число запросов с одного IP (защита от brute-force и DDoS).
- **csurf** — защита от CSRF-атак (включается в production).
- **CORS** — разрешён только нужный origin, поддержка credentials.
- **bcrypt** — безопасное хэширование паролей.
- **express-validator** — валидация и санитация пользовательских данных.
- **JWT** — токены доступа и обновления, refresh хранится в httpOnly cookie.
- **Ошибки и валидация** — все ошибки централизованно обрабатываются, нет утечек stack trace.

### Фронтенд (React)
- **Content Security Policy (CSP)** — запрещает загрузку скриптов и стилей с неразрешённых источников, защищает от XSS.
- **X-Frame-Options** — запрещает открывать сайт во фрейме (защита от clickjacking).
- **X-Content-Type-Options** — запрещает определять тип содержимого «на лету» (защита от XSS).
- **Referrer-Policy** — ограничивает передачу реферера на сторонние сайты.
- **Permissions-Policy** — запрещает доступ к геолокации, микрофону, камере и др. по умолчанию.
- **React** — по умолчанию экранирует все значения в JSX, нет прямого вывода HTML.

### Дополнительно
- **MongoDB + Mongoose** — невозможны SQL-инъекции.
- **Валидация email и паролей** — на фронте и бэке.
- **Все чувствительные данные (пароли, токены) не логируются.**

> Все эти меры делают решение безопасным для продакшн-использования. Для максимальной защиты рекомендуется использовать HTTPS и хранить секреты вне репозитория.

---

## HTTPS (SSL)

Для production-сервера поддерживается HTTPS. Сертификаты должны быть размещены в папке `server/certs/`:
- `server/certs/server.key` — приватный ключ
- `server/certs/server.cert` — публичный сертификат

В production-режиме (`NODE_ENV=production`) сервер автоматически запускается на HTTPS.

**Как получить сертификаты:**
- Для теста можно сгенерировать самоподписанные:
  ```bash
  openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes -subj "/CN=localhost"
  ```
  и положить их в `server/certs/`.
- Для боевого сервера используйте сертификаты от Let's Encrypt или другого CA.

**Важно:**
- Не публикуйте приватные ключи в репозитории!
- Для локальной разработки HTTPS не требуется (используется HTTP).

---

## HTTPS в локальной разработке

Для тестирования secure cookie и CSP рекомендуется запускать backend и frontend по HTTPS.

### Backend (Node.js/Express)
1. Сгенерируйте самоподписанные сертификаты:
   ```sh
   mkdir server/certs
   cd server/certs
   openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes -subj "/CN=localhost"
   ```
2. Сервер автоматически запустится по HTTPS (сертификаты ищутся в `server/certs/server.key` и `server/certs/server.cert`).

### Frontend (React)
1. Для запуска по HTTPS:
   - В терминале (в папке client):
     - Windows CMD:  `set HTTPS=true&&npm start`
     - PowerShell:   `$env:HTTPS="true"; npm start`
     - Linux/Mac:    `HTTPS=true npm start`
2. Примите исключение для сертификата в браузере (Advanced → Proceed to localhost).

#### Важно!
- Если антивирус (например, Касперский) блокирует доступ к https://localhost:3000, добавьте исключение или используйте http для фронта.
- В .env фронта укажите:
  ```
  REACT_APP_API_URL=https://localhost:5000/api
  ```

---

## Content Security Policy (CSP)
- CSP теперь задаётся через HTTP-заголовок с помощью helmet на сервере.
- Пример директив:
  ```
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://jwt.io https://developers.google.com;
  connect-src 'self' https://localhost:5000 ws://localhost:5000;
  font-src 'self' data:;
  object-src 'none';
  frame-ancestors 'none';
  ```
- Meta-тег CSP в index.html больше не используется.

---

## Главная страница
- После входа пользователь попадает на главную страницу с приветствием и тематической картинкой (аниме).
- Клик по логотипу в навбаре всегда ведёт на главную страницу.

---

## Пример запуска (обновлённый)
```bash
# Backend (HTTPS)
cd server
npm run dev

# Frontend (HTTPS)
cd client
set HTTPS=true&&npm start  # или $env:HTTPS="true"; npm start для PowerShell
```