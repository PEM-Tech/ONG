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

## caso n queira usar o docker, criei um makefile pra facilitar processos

os comandos deles são:
make install                    # instala deps frontend e backend
make dev                        # inicia backend (em nova janela) e frontend
make restart-backend            # reinicia o backend local manualmente
make docker-up                  # sobe tudo via docker-compose
make docker-down                # derruba tudo e limpa volumes
make docker-restart-backend     # reinicia o backend via Docker
make lint                       # roda eslint em ambos
make test                       # roda testes 