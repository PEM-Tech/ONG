# Caminhos
FRONTEND_DIR=.
BACKEND_DIR=./backend
DOCKER_COMPOSE=docker compose

# --------- NODE + REACT COMMANDS ---------- #

# Instalar dependências
install:
	cd $(FRONTEND_DIR) && npm install
	cd $(BACKEND_DIR) && npm install

# Build da aplicação frontend
build:
	cd $(FRONTEND_DIR) && npm run build

# Start em modo de desenvolvimento
dev:
	# Inicia frontend e backend em janelas separadas
	gnome-terminal -- bash -c "cd $(BACKEND_DIR) && node server/app.js; exec bash"
	cd $(FRONTEND_DIR) && npm start

# Lint
lint:
	cd $(FRONTEND_DIR) && npm run lint || true
	cd $(BACKEND_DIR) && npm run lint || true

# Testes
test:
	cd $(FRONTEND_DIR) && npm test || true
	cd $(BACKEND_DIR) && npm test || true

# Limpar dependências
clean:
	rm -rf $(FRONTEND_DIR)/node_modules $(BACKEND_DIR)/node_modules

# Reiniciar backend localmente
restart-backend:
	pkill -f "node server/app.js" || true
	cd $(BACKEND_DIR) && node server/app.js &

# --------- DOCKER COMMANDS ---------- #

docker-build:
	$(DOCKER_COMPOSE) build

docker-up:
	$(DOCKER_COMPOSE) up --build

docker-down:
	$(DOCKER_COMPOSE) down -v

docker-logs:
	$(DOCKER_COMPOSE) logs -f

docker-restart-backend:
	$(DOCKER_COMPOSE) restart backend

# --------- UTILITÁRIOS ---------- #

start-local:
	$(MAKE) install
	$(MAKE) dev

# --------- GIT COMMANDS ---------- #

# Enviar alterações para o repositório remoto
push:
push:
	git remote set-url origin https://github.com/PEM-Tech/ONG.git
	git add .
	git commit -m "Atualizações via Makefile" || echo "Nada para commitar"
	git push origin main