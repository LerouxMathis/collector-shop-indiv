# Étape 1 : Build (Node.js)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Serveur Web (Nginx)
FROM nginx:alpine
# On copie les fichiers compilés de React vers le dossier public de Nginx
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]