const tarefaForm = document.getElementById("tarefaForm");
const tarefaList = document.getElementById("tarefaList");

// Criação de tarefa
tarefaForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("tarefaTitulo").value;
  const descricao = document.getElementById("descricao").value;
  const prazoInput = document.getElementById("prazo");
  const prazo = prazoInput && prazoInput.value ? prazoInput.value : null;

  fetch("/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, descricao, prazo }),
  }).then(() => {
    window.location.href = "/";
  });
});

// Atualizar tarefa
tarefaList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox" || event.target.type === "text") {
    const li = event.target.closest("li");
    const tarefaId = li.dataset.id;

    const titulo = li.querySelector("#inputTitulo")?.value.trim() || "";
    const descricao = li.querySelector("#inputDescricao")?.value.trim() || "";
    const completed = li.querySelector("#completed")?.checked || false;
    const prazoElement = li.querySelector("#inputPrazo");
    const prazo = prazoElement ? prazoElement.value.trim() : "";

    // Prepare the update data object
    const updateData = {
      titulo,
      descricao,
      completed,
      ...(prazo !== "" ? { prazo } : {}),
    };

    fetch(`/tarefas/${tarefaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
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
