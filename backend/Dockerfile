FROM node:18-alpine

RUN apk add --no-cache openssl1.1

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
