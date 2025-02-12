document.addEventListener("DOMContentLoaded", function () {
  const permissoesTableBody = document.getElementById("permissoesTableBody");
  const salvarPermissoesBtn = document.getElementById("salvarPermissoesBtn");
  const filtroFuncao = document.getElementById("filtroFuncao");
  const funcaoHeader = document.getElementById("funcaoHeader");

  let permissoesOriginais = [];
  let funcoesDisponiveis = [];

  // Função para carregar as permissões do banco de dados
  function carregarPermissoes() {
    fetch("../back/controller/autorizacao_controller.php?action=listar")
      .then((response) => response.json())
      .then((data) => {
        permissoesOriginais = data.paginas;
        funcoesDisponiveis = data.funcoes;
        popularFiltroFuncoes();
        renderizarPermissoes();
      })
      .catch((error) => {
        console.error("Erro ao carregar permissões:", error);
      });
  }

  // Função para renderizar as permissões na tabela com base no filtro selecionado
  function renderizarPermissoes() {
    const filtro = filtroFuncao.value;
    permissoesTableBody.innerHTML = "";

    if (filtro === "todas") {
      permissoesTableBody.innerHTML =
        '<tr><td colspan="2" class="text-center">Selecione uma função para visualizar as permissões.</td></tr>';
      funcaoHeader.textContent = "Função";
    } else {
      const funcaoSelecionada = funcoesDisponiveis.find(funcao => funcao.id == filtro)?.nome || "Função";
      funcaoHeader.textContent = funcaoSelecionada; // Define o cabeçalho com o nome da função selecionada

      Object.keys(permissoesOriginais).forEach((paginaId) => {
        const pagina = permissoesOriginais[paginaId];
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${pagina.nome}</td>
                    <td><input type="checkbox" class="form-check-input" data-pagina="${paginaId}" data-funcao="${filtro}" ${
          pagina.funcoes.includes(parseInt(filtro)) ? "checked" : ""
        }></td>
                `;
        permissoesTableBody.appendChild(row);
      });
    }
  }

  // Evento para salvar as permissões no banco de dados
  salvarPermissoesBtn.addEventListener("click", function () {
    const permissoes = {};

    document
      .querySelectorAll('#permissoesTableBody input[type="checkbox"]')
      .forEach((checkbox) => {
        const pagina = checkbox.getAttribute("data-pagina");
        const funcao = parseInt(checkbox.getAttribute("data-funcao"));

        if (!permissoes[pagina]) {
          permissoes[pagina] = [];
        }

        if (checkbox.checked) {
          permissoes[pagina].push(funcao);
        }
      });

    fetch("../back/controller/autorizacao_controller.php?action=salvar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ permissoes }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire(
            "Sucesso!",
            "Permissões atualizadas com sucesso.",
            "success"
          );
          carregarPermissoes();
        } else {
          Swal.fire(
            "Erro!",
            data.error || "Erro ao salvar permissões.",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Erro ao salvar permissões:", error);
        Swal.fire("Erro!", "Erro ao salvar permissões.", "error");
      });
  });

  // Evento para aplicar o filtro de funções
  filtroFuncao.addEventListener("change", renderizarPermissoes);

  // Função para popular o filtro de funções dinamicamente
  function popularFiltroFuncoes() {
    // Limpar as opções e repopular
    filtroFuncao.innerHTML = '<option value="todas" selected>Selecione a função</option>';
    funcoesDisponiveis.forEach((funcao) => {
      const option = document.createElement("option");
      option.value = funcao.id; // Definindo o valor como ID da função
      option.textContent = funcao.nome; // Definindo o texto visível como o nome da função
      filtroFuncao.appendChild(option);
    });
  }

  // Carregar as permissões ao iniciar
  carregarPermissoes();
});
