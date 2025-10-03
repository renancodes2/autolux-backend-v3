FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 3333

ENTRYPOINT ["/bin/sh", "-c", "npm install && npm run build && npx prisma migrate deploy"]

CMD ["node", "dist/main.js"]

