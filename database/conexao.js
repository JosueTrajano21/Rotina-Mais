const mysql = require('mysql2/promise')

// Criação do banco de dados


async function conectar() {
    try{
        const conexao = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
        })

        console.log('Conectado ao MYSQL')

        await conexao.query ('CREATE DATABASE IF NOT EXISTS rotina_mais_db')
        console.log('BD criado')

        await conexao.query('USE rotina_mais_db')
        
        await criarTabelas(conexao)
        return conexao
        

    }catch (erro){
        
        console.log('Erro ao conectar: ', erro)
        throw erro
    }
}

 
async function criarTabelas(conexao) {

    // Criação das tabelas
    const criarPsicologo = `
        CREATE TABLE IF NOT EXISTS psicologo (
            id_psicologo INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(100) NOT NULL
        )
    `

    const criarPaciente = `
        CREATE TABLE IF NOT EXISTS paciente (
            id_paciente INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(100) NOT NULL,
            id_psicologo INT,
            FOREIGN KEY (id_psicologo) REFERENCES psicologo(id_psicologo)
                ON UPDATE CASCADE
                ON DELETE SET NULL
        )
    `

    const criarAtividade = `
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
        )   
    `

    const tabelas = [criarPsicologo, criarPaciente, criarAtividade]

    // Executar na ordem correta (por causa das chaves estrangeiras)
    for (let sql of tabelas) {
        await conexao.execute(sql)
        console.log('Tabela criada!')
    }

}

conectar()
  .then(() => {
    console.log("Banco e tabelas criados com sucesso!");
    process.exit();
  })
  .catch((err) => {
    console.log("Erro: ", err);
    process.exit(1);
  });


module.exports = conectar