
# 🚀 Como Rodar o Projeto

O projeto está com o **Docker** configurado, então basta rodar os comandos abaixo no **WSL** que todo o ambiente será preparado automaticamente.

---

## 📥 1. Clone o Repositório

Escolha uma das opções abaixo:

### 🔗 HTTPS
```bash
git clone https://github.com/PEM-Tech/ONG.git
```

### 🔐 SSH
```bash
git@github.com:PEM-Tech/ONG.git
```

---

## 🛠️ 2. Construa os Containers com Docker

```bash
docker-compose up --build
```

---

## 🔎 Endpoints Disponíveis

| Serviço       | URL                   |
|---------------|-----------------------|
| Frontend      | http://localhost:3000 |
| Backend       | http://localhost:5000 |
| phpMyAdmin    | http://localhost:8080 |

---

## ⚙️ Alternativa sem Docker (usando Makefile)

Caso prefira rodar o projeto localmente sem Docker, utilize os comandos abaixo:

| Comando `make`                 | Descrição                                               |
|-------------------------------|---------------------------------------------------------|
| `make install`                | Instala as dependências do frontend e backend           |
| `make dev`                    | Inicia o frontend e backend (backend em nova janela)    |
| `make restart-backend`        | Reinicia o backend local manualmente                    |
| `make docker-up`              | Sobe todos os containers com Docker Compose             |
| `make docker-down`            | Derruba todos os containers e remove volumes            |
| `make docker-restart-backend` | Reinicia apenas o container do backend                  |
| `make lint`                   | Executa o ESLint no frontend e backend                  |
| `make test`                   | Executa os testes no frontend e backend                 |
| `make push`                   | Faz push automático para o repositório do GitHub        |

---

> ✅ **Dica:** Certifique-se de que o WSL está corretamente configurado e que o Docker Desktop está rodando antes de executar qualquer comando acima.
