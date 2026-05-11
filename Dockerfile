# 1. Usamos una versión ligera de Node.js
FROM node:20-alpine

# 2. Creamos la carpeta donde vivirá el código en el contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias y el código fuente a la vez
COPY package*.json ./
COPY tsconfig*.json ./
COPY . .

# 4. Instalamos todas las dependencias (ahora TypeScript sí encontrará la carpeta src/)
RUN npm install

# 5. Compilamos el código de TypeScript a JavaScript (ejecuta "tsc")
RUN npm run build

# 6. Exponemos el puerto que configuraste en tu .env
EXPOSE 1337

# 7. Arrancamos el servidor usando el código ya compilado
CMD ["npm", "start"]
