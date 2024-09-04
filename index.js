const express = require("express");
const path = require("path");
const app = express();
const Tarefa = require("./models/tarefa");
const novaTarefa = new Tarefa();

app.use(express.static(__dirname));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", async (req, res) => {
  try {
    const lista = await novaTarefa.getTodasTarefas();
    res.render("index", { lista });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar tarefas" });
  }
});
//criação
app.post("/tarefas", async (req, res) => {
  const { titulo, descricao } = req.body;
  try {
    const result = await novaTarefa.addTarefa(
      titulo,
      descricao,
      (completed = false)
    );
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar tarefa" });
  }
});

//atualizar
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, completed } = req.body;

  try {
    await novaTarefa.atualizarTarefa(titulo, descricao, completed, id);
    res.status(200).json({ message: "Tarefa atualizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar tarefa" });
  }
});

//deletar
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  novaTarefa.deletarTarefa(id);
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});
