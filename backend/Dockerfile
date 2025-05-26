# Gunakan image ringan
FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Salin file dan install dependencies
COPY package*.json ./
RUN npm install --production

# Tambahkan ini:
COPY .env .env

COPY . .

# EXPOSE port sesuai yang digunakan app.listen
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]