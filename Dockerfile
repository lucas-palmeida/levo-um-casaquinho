# seleciona imagem base
FROM node:alpine AS build

# seleciona pasta de trabalho
WORKDIR /app

# copiar arquivos do projeto para workdir (SOURCE->TARGET)
COPY . .

# baixar dependencias do proj
RUN npm install

# construir a build da aplicação front
RUN npm run build

# selecionar imagem do nginx
FROM nginx:alpine

# copiar arquivos de build do vite e colocar no nginx
COPY --from=build /app/dist /usr/share/nginx/html

# porta de execução
EXPOSE 80

# comandos que serao executados
CMD [ "nginx", "-g", "daemon off;" ];
