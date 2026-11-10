FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3001
# run migrations and seeds (idempotent seeds), then start
CMD ["sh", "-c", "npx sequelize-cli db:migrate && (npx sequelize-cli db:seed:all || true) && node src/server.js"]
