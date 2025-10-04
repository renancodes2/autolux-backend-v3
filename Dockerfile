FROM node:22-bullseye AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22-bullseye

WORKDIR /app

COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/package*.json /app/

COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3333

CMD ["npm", "run", "start:prod"]