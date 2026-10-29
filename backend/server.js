// Backend do TCC SENAI - baseado no formCRUD do professor.
// JSON Server cuida do db.json; Express cuida do site e do cadastro/login.

// 1) Importar bibliotecas (como no exemplo do professor).
const jsonServer = require("json-server");
const express = require("express");
const path = require("path");
const crypto = require("crypto"); // Gera salt, hash e tokens de sessão.

// 2) Criar uma instância do JSON Server.
const server = jsonServer.create();

// 3) Criar roteador a partir do arquivo db.json da pasta backend.
// Usar __dirname evita falha ao executar npm start na raiz do projeto.
const router = jsonServer.router(path.join(__dirname, "db.json"));

// 4) Middlewares padrão do JSON Server.
const middlewares = jsonServer.defaults({ logger: false });
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 5) Definir portas. O banco fica acessível só no computador (127.0.0.1).
const porta = Number(process.env.PORT || 3000); // Site e API do TCC.
const portaBanco = Number(process.env.DB_PORT || 3001); // JSON Server.
const DB_URL = `http://127.0.0.1:${portaBanco}/usuarios`;

// 6) Usar o roteador do JSON Server, como no exemplo do professor.
server.use(router);

// 7) Criar instância do Express para servir as páginas e a API de login.
const app = express();
app.use(express.json({ limit: "20kb" })); // Ler dados JSON enviados pelo cadastro.

// 8) Funções auxiliares de cadastro e login.
// Sessões em memória: reiniciar o servidor desconecta os usuários.
const sessoes = new Map();
const limpar = (valor) => (typeof valor === "string" ? valor.trim() : "");
const normalizar = (valor) => limpar(valor).toLowerCase();
const derivarSenha = (senha, salt) =>
  crypto.scryptSync(senha, salt, 64).toString("hex");

async function consultar() {
  const resposta = await fetch(DB_URL);
  if (!resposta.ok) throw new Error("Banco de dados indisponível");
  return resposta.json();
}

function gerarSessao(usuario) {
  const token = crypto.randomBytes(32).toString("hex");
  sessoes.set(token, {
    id: usuario.id,
    nome: usuario.nome,
    tipo: usuario.tipo,
    username: usuario.username,
  });
  return token;
}

function sessao(req) {
  const autorizacao = req.headers.authorization || "";
  const token = autorizacao.startsWith("Bearer ") ? autorizacao.slice(7) : "";
  return sessoes.get(token) || null;
}

// 9) Rotas da API do TCC, usadas pelas páginas cadastro.html e login.html.
// Diferentemente do exemplo CRUD simples, senhas não ficam em texto puro.
app.post("/api/cadastro", async (req, res) => {
  const nome = limpar(req.body?.nome),
    sobrenome = limpar(req.body?.sobrenome);
  const username = normalizar(req.body?.username),
    senha = req.body?.senha;
  const tipo = req.body?.tipo === "professor" ? "professor" : "aluno";
  if (
    !nome ||
    !sobrenome ||
    !/^[a-z0-9._-]{3,30}$/.test(username) ||
    typeof senha !== "string" ||
    senha.length < 6 ||
    senha.length > 128
  ) {
    return res
      .status(400)
      .json({
        erro: "Preencha nome e sobrenome, use um username de 3 a 30 caracteres (letras, números, . _ -) e senha de 6 a 128 caracteres.",
      });
  }
  try {
    const usuarios = await consultar();
    if (usuarios.some((u) => u.username === username))
      return res
        .status(409)
        .json({ erro: "Esse username já está cadastrado." });
    const salt = crypto.randomBytes(16).toString("hex");
    const registro = {
      nome,
      sobrenome,
      username,
      tipo,
      salt,
      senhaHash: derivarSenha(senha, salt),
    };
    const resposta = await fetch(DB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registro),
    });
    if (!resposta.ok) throw Error("Falha ao salvar usuário");
    return res
      .status(201)
      .json({ mensagem: "Cadastro realizado! Agora faça login." });
  } catch (e) {
    console.error(e);
    return res
      .status(503)
      .json({
        erro: "Não foi possível acessar o JSON Server. Inicie o projeto com npm start.",
      });
  }
});
app.post("/api/login", async (req, res) => {
  const username = normalizar(req.body?.username),
    senha = req.body?.senha;
  if (!username || typeof senha !== "string")
    return res.status(400).json({ erro: "Informe username e senha." });
  try {
    const usuarios = await consultar();
    const usuario = usuarios.find((u) => u.username === username);
    let valido = false;
    if (usuario && usuario.salt && usuario.senhaHash) {
      const calculado = Buffer.from(derivarSenha(senha, usuario.salt), "hex");
      const esperado = Buffer.from(usuario.senhaHash, "hex");
      valido =
        calculado.length === esperado.length &&
        crypto.timingSafeEqual(calculado, esperado);
    }
    if (!valido)
      return res.status(401).json({ erro: "Username ou senha incorretos." });
    if (req.body?.tipo && usuario.tipo !== req.body.tipo)
      return res
        .status(403)
        .json({
          erro: "Esta conta pertence ao acesso de " + usuario.tipo + ".",
        });
    const token = gerarSessao(usuario);
    res.json({
      mensagem: "Login realizado!",
      token,
      usuario: {
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        username: usuario.username,
        tipo: usuario.tipo,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(503).json({ erro: "JSON Server indisponível. Use npm start." });
  }
});
app.get("/api/me", (req, res) => {
  const usuario = sessao(req);
  if (!usuario) return res.status(401).json({ erro: "Sessão inválida." });
  return res.json({ usuario });
});
app.post("/api/logout", (req, res) => {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  sessoes.delete(token);
  res.json({ mensagem: "Sessão encerrada." });
});

// 10) Configurar o Express para servir a pasta frontend.
const pastaFrontend = path.resolve(__dirname, "../frontend");
app.get("/", (req, res) => res.redirect("/escolha/index.html"));
app.use(
  express.static(pastaFrontend, { extensions: ["html"], dotfiles: "ignore" }),
);

// 11) Iniciar os servidores.
// OBS.: O exemplo do professor cria um app Express, mas não chama app.listen().
// Aqui ambos são iniciados para que o site e o JSON Server funcionem juntos.
server.listen(portaBanco, "127.0.0.1", () => {
  console.log(`JSON Server (banco): http://127.0.0.1:${portaBanco}`);
  app.listen(porta, () => {
    console.log(`Site SENAI: http://localhost:${porta}/escolha/index.html`);
  });
});
