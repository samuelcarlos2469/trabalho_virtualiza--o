const Conexao = require("./bd");

class Tarefa {
  tabela = "tarefas";
  db = new Conexao();

  async addTarefa(titulo, descricao, prazo, completed) {
    try {
      const query = prazo
        ? `INSERT INTO ${this.tabela} (titulo, descricao, prazo, completed) VALUES ($1, $2, $3, $4)`
        : `INSERT INTO ${this.tabela} (titulo, descricao, completed) VALUES ($1, $2, $3)`;

      const params = prazo
        ? [titulo, descricao, prazo, completed]
        : [titulo, descricao, completed];

      await this.db.query(query, params);
    } catch (error) {
      throw error;
    }
  }

  async atualizarTarefa(titulo, descricao, prazo, completed, id) {
    try {
      const updates = [];
      const values = [];
      let index = 1;

      if (titulo !== undefined) {
        updates.push(`titulo = $${index++}`);
        values.push(titulo);
      }
      if (descricao !== undefined) {
        updates.push(`descricao = $${index++}`);
        values.push(descricao);
      }
      if (completed !== undefined) {
        updates.push(`completed = $${index++}`);
        values.push(completed);
      }
      if (prazo !== undefined && prazo !== "") {
        updates.push(`prazo = $${index++}`);
        values.push(prazo);
      }

      values.push(id);

      if (updates.length > 0) {
        const query = `
          UPDATE ${this.tabela}
          SET ${updates.join(", ")}
          WHERE id = $${index}
        `;
        await this.db.query(query, values);
      }
    } catch (error) {
      throw error;
    }
  }

  async deletarTarefa(id) {
    try {
      const taskId = parseInt(id);
      await this.db.query(`DELETE FROM ${this.tabela} WHERE id = $1`, [taskId]);
    } catch (error) {
      throw error;
    }
  }

  async getTodasTarefas() {
    try {
      const results = await this.db.query(`SELECT * FROM ${this.tabela}`);
      return results;
    } catch (err) {
      throw err;
    }
  }

  async getTarefaById(id) {
    try {
      const results = await this.db.query(
        `SELECT * FROM ${this.tabela} WHERE id = $1`,
        [id]
      );
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tarefa;
