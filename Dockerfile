
FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
RUN npx prisma generate

FROM node:18-bullseye

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/main"]
