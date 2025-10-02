FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build 

FROM node:18-bullseye

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/main.js"] 
