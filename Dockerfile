# Etapa 1: build com Node 20.14
FROM node:20.14 as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Etapa 2: servir o app com Nginx
FROM nginx:alpine

# Copia os arquivos do build
COPY --from=builder /app/build /usr/share/nginx/html

# Configuração customizada do Nginx (para React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
