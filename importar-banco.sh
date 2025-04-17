#!/bin/bash

# Caminho completo para o arquivo SQL
SQL_PATH="./dbong.sql"

# Nome do container do MySQL (ajuste se for diferente)
CONTAINER="ong-db-1"

# Dados do MySQL
USER="root"
PASS="1234"
DB="dbong"

echo "⏳ Importando banco de dados para o container $CONTAINER..."

docker exec -i "$CONTAINER" mysql -u "$USER" --password="$PASS" "$DB" < "$SQL_PATH"

if [ $? -eq 0 ]; then
  echo "✅ Banco de dados importado com sucesso!"
else
  echo "❌ Falha ao importar o banco de dados."
fi  
