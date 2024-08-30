const express = require("express");
const app = express();
const Conexao = require("./bd");

app.use(express.json());

//criação
app.post("/tarefas", async (req, res) => {
  const { titulo, descricao } = req.body;
  const conexao = new Conexao();
  const result = await conexao.query(
    "INSERT INTO tarefas (titulo, descricao) VALUES ($1, $2)",
    [titulo, descricao]
  );
  res.json(result);
});

//lista completa
app.get("/tarefas", async (req, res) => {
  const conexao = new Conexao();
  try {
    const { rows } = await conexao.query("SELECT * FROM tarefas");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar tarefas:", err);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

//lista especifica
app.get("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const conexao = new Conexao();
  try {
    const { rows } = await conexao.query(
      "SELECT * FROM tarefas WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar tarefa:", err);
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
});

//atualizar
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, completed } = req.body;
  const conexao = new Conexao();
  try {
    const { rows } = await conexao.query(
      "UPDATE tarefas SET titulo = $1, descricao = $2, completed = $3 WHERE id = $4 RETURNING *",
      [titulo, descricao, completed, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

//deletar
app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const conexao = new Conexao();
  try {
    await conexao.query("DELETE FROM tarefas WHERE id = $1 ", [id]);
    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar tarefa:", err);
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080");
});

app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, completed } = req.body;

  if (!titulo || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const conexao = new Conexao();
  try {
    const { rows } = await conexao.query(
      "UPDATE tarefas SET titulo = $1, descricao = $2, completed = $3 WHERE id = $4 RETURNING *",
      [titulo, descricao, completed, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar tarefa:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
