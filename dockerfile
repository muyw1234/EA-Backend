FROM node:20
WORKDIR /app
COPY package*.json ./
COPY @types ./@types
COPY src ./src
COPY tsconfig.json ./
RUN npm install
EXPOSE 1337
CMD ["npm","start"]
