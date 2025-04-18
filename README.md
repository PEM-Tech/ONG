# Como rodar o projeto

O projeto está com o docker configurado, então basta subir ele com o WSL que todo o ambiente estará preparado 

# 1. clone o repositorio

```bash
git clone https://github.com/PEM-Tech/ONG.git
```
ou via ssh
```bash
git@github.com:PEM-Tech/ONG.git
```
# 2. Dê o comando de build do docker
```bash
docker-compose up --build
```

Frontend estará rodando no localhost:3000
Backend no 5000
e o phpmyadmin no 8080
