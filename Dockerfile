FROM node:20

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci

COPY . .

EXPOSE 4200

CMD ["npm", "run", "start"]



