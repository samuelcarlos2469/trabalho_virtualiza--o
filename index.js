const express = require("express");
const path = require("path");
const app = express();
const Tarefa = require("./models/tarefa");
const novaTarefa = new Tarefa();

function formatarData(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

app.use(express.static(__dirname));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  try {
    const lista = await novaTarefa.getTodasTarefas();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const listaFormatada = lista.map((tarefa) => {
      const prazo = tarefa.prazo ? new Date(tarefa.prazo) : null;
      const dataFormatada = prazo ? formatarData(prazo) : "Indefinido";
      const atrasada = prazo && prazo < hoje ? "Tarefa atrasada" : "";

      return {
        ...tarefa,
        prazo: dataFormatada,
        atrasada,
      };
    });

    res.render("index", { lista: listaFormatada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar tarefas" });
  }
});

// criação
app.post("/tarefas", async (req, res) => {
  const { titulo, descricao, prazo } = req.body;
  try {
    await novaTarefa.addTarefa(titulo, descricao, prazo, false);
    res.status(201).json({ message: "Tarefa criada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar tarefa" });
  }
});

// att
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, prazo, completed } = req.body;

  try {
    await novaTarefa.atualizarTarefa(titulo, descricao, prazo, completed, id);
    res.status(200).json({ message: "Tarefa atualizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar tarefa" });
  }
});

// delete
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await novaTarefa.deletarTarefa(id);
    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar tarefa" });
  }
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
