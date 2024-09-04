const Conexao = require("./bd");

class Tarefa {
  tabela = "tarefas";
  db = new Conexao();

  constructor() {
    //this.db.conectar();
  }

  async addTarefa(titulo, descricao, completed) {
    try {
      await this.db.query(
        `INSERT INTO ${this.tabela} (titulo, descricao, completed) VALUES ('${titulo}', '${descricao}', '${completed}')`
      );
    } catch (error) {
      throw error;
    }
  }
  async atualizarTarefa(titulo, descricao, completed, id) {
    try {
      await this.db.query(
        `UPDATE ${this.tabela} SET titulo = '${titulo}', descricao = '${descricao}', completed = '${completed}' WHERE id = ${id}; `
      );
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
        `SELECT * FROM ${this.tabela} WHERE id = ${id}`
      );
      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tarefa;
