document.addEventListener('DOMContentLoaded', function () {
    // Busca os dados do backend
    fetch('../back/controller/relatorio-estoque.php')
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            if (data.error) {
                console.error('Erro no backend:', data.error);
                return;
            }
            renderGraficos(data); // Renderiza os gráficos com os dados
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});

// Função para renderizar os gráficos
function renderGraficos(dados) {
    // Gráfico 1: Itens abaixo do estoque mínimo
    const abaixoMinimo = dados.filter(item => item.quantidade < item.estoque_minimo);
    const nomes1 = abaixoMinimo.map(item => item.descricao);
    const quantidades1 = abaixoMinimo.map(item => item.quantidade);

    Plotly.newPlot('grafico1', [{
        x: nomes1,
        y: quantidades1,
        type: 'bar',
        marker: { color: 'red' }
    }], {
        title: 'Itens Abaixo do Estoque Mínimo',
        xaxis: { title: 'Produtos' },
        yaxis: { title: 'Quantidade' }
    });

    // Gráfico 2: Distribuição por Depósito
    const agrupadosPorDeposito = dados.reduce((acc, item) => {
        acc[item.deposito] = (acc[item.deposito] || 0) + item.quantidade;
        return acc;
    }, {});

    const nomes2 = Object.keys(agrupadosPorDeposito);
    const valores2 = Object.values(agrupadosPorDeposito);

    Plotly.newPlot('grafico2', [{
        labels: nomes2,
        values: valores2,
        type: 'pie'
    }], {
        title: 'Distribuição de Estoque por Depósito'
    });

    // Gráfico 3: Produtos Próximos à Validade
    const proximosValidade = dados.filter(item => {
        const validade = new Date(item.validade);
        const hoje = new Date();
        const prazo = new Date();
        prazo.setDate(hoje.getDate() + 30); // Validade inferior a 30 dias
        return validade <= prazo && validade >= hoje;
    });

    const nomes3 = proximosValidade.map(item => item.descricao);
    const datas3 = proximosValidade.map(item => new Date(item.validade).toLocaleDateString());

    Plotly.newPlot('grafico3', [{
        x: nomes3,
        y: datas3,
        type: 'bar',
        marker: { color: 'orange' }
    }], {
        title: 'Produtos Próximos à Validade',
        xaxis: { title: 'Produtos' },
        yaxis: { title: 'Data de Validade' }
    });
}
