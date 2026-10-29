# Secretaria Virtual SENAI — Frontend + Backend

## Estrutura

```text
TCC-SENAI-ORGANIZADO/
├── backend/
│   ├── server.js               # Express, rotas de cadastro/login e JSON Server
│   └── db.json                 # Banco de usuários (JSON Server)
├── frontend/
│   ├── escolha/                # Tela de escolha Aluno/Professor
│   ├── login-page/             # Login e cadastro
│   ├── configs/                # Configurações
│   ├── professor/admin/        # Painel do professor
│   ├── imagens/                # Imagens do tema
│   ├── icons.css               # Ícones modernos em SVG
│   ├── style.css               # Estilo geral
│   ├── tema-global.css         # Temas
│   ├── tema.js                 # Alternância de tema
│   ├── script.js               # Interações do site
│   └── *.html                  # Páginas do aluno
├── package.json               # npm start / npm run dev
├── .gitignore
└── README.md
```

## Rodar o projeto

1. Instale **Node.js 18+**.
2. Abra o terminal na pasta `TCC-SENAI-ORGANIZADO` (a pasta que contém o `package.json`).
3. Execute `npm install` uma vez.
4. Execute `npm start`.
5. Abra <http://localhost:3000/escolha/index.html>.

`npm start` inicia **dois serviços no mesmo processo**: o JSON Server na porta `3001` (somente no computador local) e o site/Express na porta `3000`. Não precisa executar dois terminais e não precisa do Live Server.

## Rotas

| Rota | Método | Função |
| --- | --- | --- |
| `/` | GET | Redireciona para a tela de escolha |
| `/escolha/index.html` | GET | Escolher aluno ou professor |
| `/login-page/cadastro.html?tipo=aluno` | GET | Cadastro de aluno |
| `/login-page/loginaluno.html` | GET | Login de aluno |
| `/login-page/loginpage.html` | GET | Login de professor |
| `/api/cadastro` | POST | Cadastrar usuário (nome, sobrenome, username, senha, tipo) |
| `/api/login` | POST | Validar login e criar sessão |
| `/api/me` | GET | Consultar sessão autenticada com header Bearer |
| `/api/logout` | POST | Sair |

### Exemplo de JSON do cadastro

```json
{"nome":"Senai","sobrenome":"Mogi","username":"senai2024","senha":"mogi#senai","tipo":"aluno"}
```

As senhas são salvas como **hash scrypt com salt**, e não em texto puro. O token de sessão fica na memória do processo Node.js e é reiniciado quando o servidor é reiniciado. Esse projeto demonstra uma API inicial para o TCC; a autenticação não foi endurecida para produção. O JSON Server escuta apenas em `127.0.0.1:3001`.

## Ícones

Os emojis de menus, login, cadastro, secretaria e painel do professor foram substituídos por **SVGs modernos embutidos no HTML**, com estilos em `frontend/icons.css`. Não dependem de CDN e funcionam sem internet depois de instalar as dependências.

## Atenção

Evite abrir as páginas com `file://` ou Live Server na porta 5500; a API funciona integrada ao Express na porta 3000. As páginas de gerenciamento do professor e a de mensagens possuem telas básicas de "em desenvolvimento" quando antes não existiam arquivos de destino. As funcionalidades dessas telas ainda precisam ser implementadas separadamente.
