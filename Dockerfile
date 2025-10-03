FROM node:18-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN ls -l ./dist

FROM node:18-bullseye

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app/

RUN npm install --only=production

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/main.js"]
