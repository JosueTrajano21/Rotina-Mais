require("dotenv").config();
const db = require("./db");

async function run() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS psicologo (
        id_psicologo INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(100) NOT NULL
      ) ENGINE=INNODB;
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS paciente (
        id_paciente INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        senha VARCHAR(100) NOT NULL,
        id_psicologo INT,
        FOREIGN KEY (id_psicologo) REFERENCES psicologo(id_psicologo)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      ) ENGINE=INNODB;
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS atividade (
        id_atividade INT AUTO_INCREMENT PRIMARY KEY,
        id_paciente INT NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT,
        data DATE,
        favorito TINYINT(1) DEFAULT 0,
        completada TINYINT(1) DEFAULT 0,
        FOREIGN KEY (id_paciente) REFERENCES paciente(id_paciente)
          ON DELETE CASCADE
      ) ENGINE=INNODB;
    `);

    console.log("Seed executado com sucesso.");
    process.exit(0);

  } catch (err) {
    console.error("Erro no seed:", err);
    process.exit(1);
  }
}

run();
