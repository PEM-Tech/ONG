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

# 3. Importar banco

primeiro dê permissão
```bash
chmod +x importar-banco.sh
```

jogue o arquivo sql na pasta raiz do wsl

execute o comando
```bash
./importar-banco.sh
```