# Используем официальный Node.js образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт (по умолчанию 3000)
EXPOSE 3000

# Запуск React-приложения (dev-сервер)
CMD ["npm", "start"] 