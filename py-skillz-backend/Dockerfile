FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY src ./src
COPY test ./test
COPY nest-cli.json ./

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY .env ./

COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

EXPOSE 3003

CMD ["node", "dist/main"]
