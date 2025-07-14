# Используем официальный Node.js образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install && npm install -g nodemon

# Копируем остальной код
COPY . .

# Открываем порт (по умолчанию 5000)
EXPOSE 5000

# Запуск сервера через nodemon для hot-reload
CMD ["npx", "nodemon", "index.js"] 