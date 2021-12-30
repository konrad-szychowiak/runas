# syntax=docker/dockerfile:1
FROM node:14-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/main.js"]