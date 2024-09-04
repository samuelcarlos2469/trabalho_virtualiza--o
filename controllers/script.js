const tarefaForm = document.getElementById("tarefaForm");
const tarefaList = document.getElementById("tarefaList");

function toggleDescription(id) {
  const descricao = document.getElementById(`descricao-${id}`);
  descricao.classList.toggle("hidden");
}

tarefaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  fetch("/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: document.getElementById("tarefaTitulo").value,
      descricao: document.getElementById("descricao").value,
    }),
  }).then(() => {
    window.location.href = "/";
  });
});

// Atualizar tarefa
tarefaList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox" || event.target.type === "text") {
    const li = event.target.closest("li");
    const tarefaId = li.dataset.id;

    const titulo = li.querySelector("#inputTitulo").value;
    const descricao = li.querySelector("#inputDescricao").value;
    const completed = li.querySelector("#completed").checked;

    fetch(`/tarefas/${tarefaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, descricao, completed }),
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

// Remover tarefa
tarefaList.addEventListener("click", (event) => {
  if (
    event.target.tagName === "BUTTON" &&
    event.target.id === "buttonRemover"
  ) {
    const li = event.target.closest("li");
    const tarefaId = li.dataset.id;

    fetch(`/delete/${tarefaId}`, {
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
