# Usa la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el package.json y package-lock.json (si existe) al contenedor
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia todo el código del backend al contenedor
COPY . .

# Expone el puerto en el que la aplicación escucha (ajusta el puerto si es necesario)
EXPOSE 5000

# Ejecuta el servidor
CMD ["npm", "start"]
