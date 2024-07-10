# Usar una versión específica de Node.js como base
FROM node:20 as build-stage

# Crear directorio de la aplicación
WORKDIR /app

# Instalar dependencias de la aplicación
COPY package*.json ./
RUN npm install
# Para producción, descomentar la siguiente línea
# RUN npm ci --only=production

# Copiar los archivos de la aplicación
COPY . .

# Compilar el proyecto Angular para producción
RUN npm run build

# Usar Nginx para servir la aplicación construida
FROM nginx:alpine as production-stage

# Copiar el resultado de la construcción desde la etapa de construcción
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html

# Tu aplicación se une a puerto 80
EXPOSE 4200

# Comando para correr la aplicación
CMD ["nginx", "-g", "daemon off;"]