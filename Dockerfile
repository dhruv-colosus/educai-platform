FROM node:18-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./


RUN npm cache clean --force
RUN npm install --verbose

COPY . .

RUN npx prisma migrate 

RUN npx prisma generate


RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
