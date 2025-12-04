# RotinaMais

# RotinaMais - Node.js + Express

![Node](https://img.shields.io/badge/Node-18%2B-brightgreen?style=flat&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat&logo=mysql)
 
[![Open in Codespaces](https://img.shields.io/badge/Open%20in-Codespaces-24292f?style=flat&logo=github&logoColor=white)](https://github.com/codespaces/new?repo=renato-mendes-uninassau/portal-noticias-express)
[![Dev Containers](https://img.shields.io/badge/Dev%20Containers-0078D4?style=flat&logo=visual-studio-code&logoColor=white)](https://code.visualstudio.com/docs/devcontainers/containers)

Quick actions: use the **Codespaces** badge to create a codespace for this repo, or read the **Dev Containers** docs to open the project in a VS Code Dev Container.

RotinaMais é um sistema de gerenciamento de tarefas voltado para pacientes e psicólogos. O paciente organiza sua rotina diária criando atividades, marcando como concluídas, favoritas, editando e excluindo. O psicólogo acompanha seus pacientes através de dados, permitindo melhor análise da rotina, organização e evolução.

Este README foi estruturado de forma didática:  
primeiro apresentamos a visão geral, depois mostramos a estrutura do projeto, explicamos como funciona a arquitetura (MVC) e, por fim, ensinamos como configurar e executar o projeto.

---

## Índice
1. Sobre o projeto  
2. Estrutura do projeto (resumo)  
3. Arquitetura e como o projeto funciona  
   - Views (EJS)  
   - Routes  
   - Controllers  
   - Models  
   - Seeders
   - Middleware 
   - Sessões e autenticação 
4. Tecnologias utilizadas  
5. Pré-requisitos  
6. Como clonar e configurar  
   - Opção 1: Ambiente local  
7. Variáveis de ambiente (.env)  
8. Scripts e comandos úteis  
9. Rodando o projeto  
10. Rotas principais  
11. Banco de dados (resumo das tabelas)    

---

## Sobre o projeto
RotinaMais tem como objetivo facilitar a organização do paciente e permitir que o psicólogo acompanhe sua rotina diária.  
O sistema oferece:

- Criação, edição, exclusão e favoritação de tarefas  
- Filtro por data (Hoje, Semana, Mês, Sem data etc.)  
- Marcar tarefas como concluídas  
- Autenticação baseada em sessões  
- Área do paciente  
- Área do psicólogo
- Visualização de todos os seus pacientes e visualização de dados de um paciente

## Estrutura do projeto (resumo)

`app.js` — arquivo principal e configuração de rotas/middleware
`package.json` — scripts e dependências
`.env` — exemplo de variáveis de ambiente
`database/` — criação do banco de dados e pool de conexões MySQL (mysql2/promise)
`routes/` — rotas públicas e acesso parte paciente e psicólogo
`controllers/` — lógica de negócio
`models/` — camadas de acesso a dados (queries)
`views/` — templates EJS (partials e páginas)
`public/` — assets estáticos (CSS/JS)
`middleware/` — Verificação de sessão

## Arquitetura e como o projeto funciona (visão prática)

O projeto segue o padrão MVC (Model–View–Controller), separando responsabilidades para facilitar manutenção e organização.

## Views (EJS)

As views são responsáveis pela parte visual do sistema.
Aqui ficam os templates .ejs, incluindo:
Layouts e partials (header.ejs, footer.ejs)
Telas do paciente
Telas do psicólogo
Tela de login e registro
Lista de pacientes

Trecho (simplificado):

```ejs
<%- include('../partials/header') %>
<div class="menu">
    <% menuItems.forEach(item => { %>
        <a 
        class="menu-item <%= selecionado === item ? 'active' : '' %>"
        href="/atividades?filter=<%= item %>"
        >
            <%= item %>
        </a>
    <% }) %>
</div>
<%- include('partials/footer') %>
```

Observações:

As partials (partials/header.ejs) permitem compartilhar o layout (head, nav, footer).
Use `<%= ... %>` para saída escapada; `<%- ... %>` para incluir HTML/partials sem escapar.
As views exibem apenas dados enviados pelos controllers.

### Routes (rotas)

As rotas são responsáveis por mapear URLs para funções nos Controllers.
Cada rota chama um método específico da lógica de negócio (controllers) e, quando necessário, passa por um middleware de autenticação.

No projeto, as rotas estão divididas principalmente entre:

- Rotas de atividades (paciente)
- Rotas de autenticação
- Rotas da parte psicólogo

Exemplo simplificado de rotas do Psicólogo:

```js
const express = require("express")
const router = express.Router()
const psicologoGeral = require("../controllers/psicologoController")
const auth = require("../middleware/requireLogin")

router.get("/psicologo_geral/", auth, psicologoGeral.index);

router.get("/psicologo_geral/paciente/:id", auth, psicologoGeral.acompanharPaciente);

router.post("/psicologo_geral", auth, psicologoGeral.adicionar)  

router.post("/psicologo_geral/excluir", auth, psicologoGeral.excluir)

module.exports = router
```

Essas rotas são montadas no `app.js` da seguinte forma:

```js
app.use("/", pacienteRoutes)
```

### Controllers

Controllers contêm a lógica de negócio do sistema.
Eles recebem dados da requisição (req), chamam os Models quando precisam acessar o banco e depois decidem se renderizam uma View ou redirecionam o usuário.

Exemplo: `controllers/psicologoController.js` — método que adiciona um paciente ao psicólogo:

```js
adicionar: async (req, res) => {
    const { id_paciente } = req.body
    const id_psicologo = req.session.user.id

    const pacientes = await PacientesGeral.listarTodosPacientes(id_psicologo)

    ...

    res.redirect("/psicologo_geral")
}
```

Pontos importantes:

- Controllers chamam métodos dos Models para ler ou atualizar dados.
- Eles também são responsáveis por enviar dados para Views (EJS) ou redirecionar.
- Validações e mensagens de erro costumam ser tratadas aqui, não nos Models.

### Models / Acesso ao banco

Os Models são responsáveis por acessar o banco de dados.
Eles encapsulam consultas SQL usando o pool do MySQL, evitando repetição e deixando os Controllers mais limpos.

Conexão com o banco `(database/db.js)`:

```js
const mysql = require("mysql2/promise")
require("dotenv").config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_NAME || "rotina_mais_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

module.exports = pool
```

O pool usa `mysql2/promise`, permitindo usar async/await em todas as queries.

Exemplo de Model: `models/pacientesPsicologo.js`

Model responsável por vincular pacientes e psicólogos:
```js
static async adicionarPaciente(id_paciente, id_psicologo) {
    const [resultado] = await db.query(
        "UPDATE paciente SET id_psicologo = ? WHERE id_paciente = ?",
        [id_psicologo, id_paciente]
    )
    return resultado.affectedRows > 0 // retorna sucesso ou falha
}
```

Pontos importantes:

- Sempre use placeholders (?) para evitar SQL Injection.
- Models nunca renderizam Views nem manipulam sessão — apenas acessam o banco.
- Controllers chamam os Models, não o contrário.

### Seeders (script de inicialização)

O projeto inclui o script `database/conexao.js`, responsável por criar automaticamente o banco de dados `rotina_mais_db` e todas as tabelas necessárias (psicologo, paciente, atividade) caso ainda não existam.

Esse script é útil para preparar rapidamente o ambiente de desenvolvimento sem precisar executar SQL manualmente.

Execução:
```bash
npm run setup-db
```


### Middleware

Middlewares são funções executadas antes do handler principal das rotas.
Eles podem bloquear, redirecionar ou modificar a requisição antes que o controller seja chamado.

O projeto inclui um middleware simples de autenticação:

middleware/requireLogin.js

Responsável por verificar se o usuário está autenticado antes de acessar rotas protegidas.
Se não houver um usuário salvo na sessão (req.session.user), a pessoa é redirecionada para o login.

Exemplo:

```js
module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};
```

Esse middleware é aplicado em várias rotas, por exemplo:

router.get("/atividades", requireLogin, atividadesController.index);

Assim, apenas usuários conectados podem acessar páginas de paciente ou psicólogo.

### Sessões e autenticação
O projeto usa `express-session` para armazenar o usuário logado em `req.session.user`. Um fluxo simplificado de login no `loginController`:

1. Recebe `email`, `senha` e `tipo` (Psicólogo ou Paciente) do formulário.
2. Busca usuário com `Paciente.buscarPorEmail(email)` ou ``
3. Compara senhas com `bcrypt.compare`.
4. Em caso de sucesso, guarda `req.session.usuario = { id, tipo }`.

---

## Tecnologias

- Node.js
- Express.js
- EJS (views)
- MySQL (via `mysql2`)
- bcrypt (hash de senhas)
- express-session (sessões)

## Pré-requisitos

Node.js (recomenda-se v18+ ou v24)
npm
MySQL 8.0+ (ou um serviço compatível)
VS Code (opcional, recomendado para usar Dev Container)

## Como clonar e configurar

Opção 1 — Ambiente local

1. Clone o repositório:
```bash
git clone https://github.com/JosueTrajano21/Rotina-Mais
cd Rotina-Mais
```

2. Instale dependências:
```bash
npm install
```

3. Edite o arquivo .env e configure suas credenciais do MySQL:

Exemplo mínimo em .env:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=rotina_mais_db
SESSION_SECRET=seu_segredo_aqui
PORT=3000
```

4. Crie as tabelas e dados de exemplo executando o conexao.js:
```bash
npm run setup-db
```

5. Rode em modo desenvolvimento (com nodemon):
```bash
npm run dev
```

6. Abra no navegador:
```
http://localhost:3000
```

---

## Inicialização (conexao)
Este projeto não usa um sistema ORM com migrations; em vez disso há um script database/conexao.js que cria as tabelas necessárias e insere dados exemplo. Execute sempre `npm run setup-db` em um banco vazio ou rode manualmente os scripts SQL desejados.

`npm run setup-db` — cria as tabelas usuarios, categorias, noticias e insere dados de exemplo

## Rodando o projeto

- Desenvolvimento: `npm run dev` (nodemon)

## Comandos úteis

- `npm install` — instala dependências
- `npm run setup-db` — cria tabelas e insere dados de exemplo
- `npm run dev` — executa em modo dev com `nodemon`
- `npm start` — inicia com `node app.js`
- Produção: `npm start`

## Rotas principais

Rotas públicas:

- `GET /` — Home
- `GET /login` — formulário de login
- `POST /login` — processa login
- `GET /registro` — formulário de registro
- `POST /registro` — processa registro

Rotas psicologo/paciente (requer login):

- `GET /atividade` — Página inicial das atividades do paciente
- `POST /atividade` — Criar nova atividade
- `GET /psicologo_geral` — Página inicial dos pacientes do psicólogo
- `GET /psicologo_geral/paciente/:id` - Mostra detalhes e atividades de um paciente específico

## Banco de dados (resumo das tabelas)

- `psicologo` — id, nome, email (unique), senha (hash)
- `paciente` — id, nome, email (unique), senha (hash), id_psicologo
- `atividade` — id, id_paciente, titulo, descricao, data, favorito, completada
