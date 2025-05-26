# Gunakan image Node.js ringan
FROM node:20-alpine

# Set direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan install dependencies
COPY package*.json ./
RUN npm install --production

# Salin semua source code (kecuali file yang diabaikan oleh .dockerignore)
COPY . .

# Jangan salin file .env ke dalam container!

# Buka port 3000 (opsional, dokumentatif saja)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
