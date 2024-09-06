const { Pool } = require("pg");

class Conexao {
  constructor() {
    this.banco = new Pool({
      user: "user",
      host: "db",
      database: "mydb",
      password: "1234",
      port: 5432,
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      this.banco.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.rows);
        }
      });
    });
  }
}

module.exports = Conexao;
