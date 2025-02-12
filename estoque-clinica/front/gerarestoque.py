import random
from datetime import datetime, timedelta

# Função para gerar datas aleatórias
def generate_random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Lista expandida de nomes reais de produtos para estoque
def generate_product_list():
    categorias_produtos = {
        "Medicamentos": [
            "Analgésico", "Anti-inflamatório", "Antibiótico", "Antisséptico", "Soro Fisiológico", "Creme Cicatrizante"
        ],
        "Equipamentos Médicos": [
            "Bisturi", "Monitor Cardíaco", "Aparelho de Pressão", "Oxímetro", "Estetoscópio", "Termômetro"
        ],
        "Descartáveis": [
            "Luvas Cirúrgicas", "Máscaras", "Campos Estéreis", "Seringas", "Agulhas Hipodérmicas", "Fitas Microporosas"
        ],
        "Materiais de Limpeza": [
            "Álcool 70%", "Detergente Enzimático", "Desinfetante Hospitalar", "Sabão Antisséptico"
        ],
        "Materiais Cirúrgicos": [
            "Fios de Sutura", "Lâminas de Bisturi", "Pinça Hemostática", "Tesoura Cirúrgica", "Clipes Cirúrgicos"
        ]
    }

    produtos = []
    for categoria, itens in categorias_produtos.items():
        for item in itens:
            produtos.append((item, categoria))
    return produtos

# Gerar lista de produtos
produtos_reais = generate_product_list()

# Parâmetros
total_produtos = 300
start_date = datetime.now()
end_date = start_date + timedelta(days=365)  # Validade máxima de um ano
unidades_medida = ['Unidade', 'Litro', 'Frasco', 'Caixa', 'Pacote']
depositos = ['Depósito 1', 'Depósito 2', 'Depósito 3', 'Depósito 4']
segmentos = ['Cirúrgico', 'Estético', 'Geral']

# Gerar dados do estoque
estoque = []
for i in range(1, total_produtos + 1):
    produto, categoria = random.choice(produtos_reais)
    unidade = random.choice(unidades_medida)
    deposito = random.choice(depositos)
    segmento = random.choice(segmentos)
    quantidade = random.randint(1, 500)
    estoque_minimo = random.randint(10, 50)
    estoque_seguranca = random.randint(5, 20)
    validade = generate_random_date(start_date, end_date)
    preco = round(random.uniform(5.0, 500.0), 2)

    # Adicionar condições específicas
    if i % 10 == 0:
        quantidade = random.randint(1, estoque_minimo - 1)  # Estoque abaixo do mínimo
    if i % 15 == 0:
        validade = start_date + timedelta(days=random.randint(1, 30))  # Validade próxima

    estoque.append((produto, unidade, quantidade, estoque_minimo, estoque_seguranca, categoria, deposito, segmento, validade.strftime('%Y-%m-%d'), preco))

# Gerar SQL
sql_insert = "INSERT INTO estoque (descricao, unidade_medida, quantidade, estoque_minimo, estoque_seguranca, tipo_material, deposito, segmento, validade, preco) VALUES \n"

values = []
for item in estoque:
    descricao = item[0].replace("'", "''")
    unidade = item[1].replace("'", "''")
    categoria = item[5].replace("'", "''")
    deposito = item[6].replace("'", "''")
    segmento = item[7].replace("'", "''")

    values.append(f"('{descricao}', '{unidade}', {item[2]}, {item[3]}, {item[4]}, '{categoria}', '{deposito}', '{segmento}', '{item[8]}', {item[9]})")

sql_insert += ",\n".join(values) + ";"

# Salvar em um arquivo
with open("estoque_test_data.sql", "w", encoding="utf-8") as file:
    file.write(sql_insert)

print("SQL para inserção de produtos gerado com sucesso e salvo em 'estoque_test_data.sql'.")