const tarefaForm = document.getElementById("tarefaForm");
const tarefaList = document.getElementById("tarefaList");
const tituloInput = document.getElementById("tarefaTitulo");

async function carregarTarefas() {
  const conexao = new Conexao();
  const { rows } = await conexao.query("SELECT * FROM tarefas");

  tarefaList.innerHTML = "";
  rows.forEach(criarItemTarefa);
}

function criarItemTarefa(tarefa) {
  const li = document.createElement("li");
  li.dataset.id = tarefa.id;
  li.innerHTML = `
    <input type="checkbox" class="mr-2" ${tarefa.completed ? "checked" : ""}>
    <span class="flex-1">${tarefa.titulo}</span>
    <p>${tarefa.descricao}</p>
    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">Remover</button>
  `;
  tarefaList.appendChild(li);

  // ... (seu código existente)
  const editButton = document.createElement("button");
  editButton.textContent = "Editar";
  editButton.classList.add("edit-button"); // Adicione uma classe para estilizar
  editButton.addEventListener("click", () => {
    const li = event.target.closest("li");
    const tituloSpan = li.querySelector(".tarefa-titulo");
    const descricaoP = li.querySelector("p");

    // Crie inputs para edição
    const tituloInput = document.createElement("input");
    tituloInput.value = tituloSpan.textContent;
    const descricaoInput = document.createElement("textarea");
    descricaoInput.value = descricaoP.textContent;

    // Substitua os elementos existentes pelos inputs
    tituloSpan.replaceWith(tituloInput);
    descricaoP.replaceWith(descricaoInput);

    // Adicione um botão "Salvar"
    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.classList.add("save-button");
    saveButton.addEventListener("click", () => {
      const newTitulo = tituloInput.value;
      const newDescricao = descricaoInput.value;
      const tarefaId = li.dataset.id;

      // Envie uma requisição PUT para atualizar a tarefa
      fetch(`/tarefas/${tarefaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ titulo: newTitulo, descricao: newDescricao }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Atualize o DOM com os novos dados
          tituloSpan.textContent = newTitulo;
          descricaoP.textContent = newDescricao;
        })
        .catch((error) => {
          console.error("Erro ao atualizar tarefa:", error);
        });

      // Remova os inputs e o botão "Salvar"
      tituloInput.remove();
      descricaoInput.remove();
      saveButton.remove();
    });

    li.appendChild(saveButton);
  });

  li.appendChild(editButton);
}

tarefaForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita que o formulário seja recarregado

  const novaTarefa = {
    titulo: tituloInput.value,
    descricao: "", // Assuma descrição vazia por enquanto
  };

  const conexao = new Conexao();
  const result = await conexao.query(
    "INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2) RETURNING *",
    [novaTarefa.titulo, novaTarefa.descricao]
  );

  const novaTarefaSalva = result.rows[0];

  criarItemTarefa(novaTarefaSalva);

  tituloInput.value = "";
});

//remover tarefa
tarefaList.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const li = event.target.parentElement;
    const tarefaId = li.dataset.id;

    fetch(`/tarefas/${tarefaId}`, {
      method: "DELETE",
    })
      .then(() => {
        li.remove();
      })
      .catch((error) => {
        console.error("Erro ao remover tarefa:", error);
      });
  }
});

//atualizar tarefa
tarefaList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    const li = event.target.parentElement;
    const tarefaId = li.dataset.id;

    fetch(`/tarefas/${tarefaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: event.target.checked }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Tarefa atualizada:", data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar tarefa:", error);
      });
  }
});

carregarTarefas();
