# Projeto: Desenvolvimento de Plataformas Web

Aplicação Web desenvolvida como requisito de avaliação da disciplina **Desenvolvimento de Plataformas Web** da **Universidade de Fortaleza (UNIFOR)**.

## 📌 Escopo do Projeto (Cenário 3)
Sistema Web para gestão de **Cardápio Digital** (marmitaria) com relacionamento entre **Categorias** e **Pratos** (`categoriaId`), operações completas de **CRUD** (incluir, listar, alterar e excluir), filtro/navegação por categoria, validação de campos obrigatórios, regras de negócio, estado para lista vazia e persistência via `json-server` (`db.json`).

### Modelo de Dados e Regras de Negócio
- **Categorias (`/categorias`)**: `id`, `nome` (ex.: *Executivas*, *Fitness*, *Tradicionais*).
- **Pratos (`/pratos` e `/categorias/:id/pratos`)**: `id`, `categoriaId`, `nome`, `descricao`, `preco`.
- **Nome de categoria único:** impede cadastrar ou renomear uma categoria para um nome já existente (ignorando maiúsculas/minúsculas e espaços extras).
- **Integridade na exclusão de categoria:** bloqueia a exclusão de uma categoria que possua pratos vinculados.
- **Preço válido:** exige valor numérico maior que zero (`> 0`), além de categoria, nome e descrição/acompanhamentos preenchidos.

## 🛠️ Tecnologias Utilizadas
- **Front-end:** ReactJS, React Router, HTML5, CSS3, Bootstrap, Axios
- **Back-end / Persistência de Dados:** Node.js, `json-server` (`db.json`), `concurrently`

## 📁 Estrutura Principal (`frontend/src`)
- `db.json`: base de dados local com as coleções `categorias` e `pratos`.
- `src/services/api.js`: clientes HTTP (`categoriaService` e `pratoService`) e filtro de pratos por `categoriaId`.
- `src/services/cardapioRegras.js`: funções de validação de categoria, prato e exclusão segura.
- `src/components/categoria/CategoriaCrud.jsx`: CRUD de categorias, contagem de pratos e atalho para ver os pratos da categoria.
- `src/components/prato/PratoCrud.jsx`: CRUD de pratos com filtro por categoria e formatação em reais (`R$`).
- `src/Routes.jsx` e `src/components/template/Nav.jsx`: rotas da aplicação e menu lateral (*Início*, *Categorias* e *Pratos*).

## 👥 Equipe
- Edcarlos de Sousa Rodrigues - Matrícula: 2524970
- Lucas Gondim Sampaio Sales - Matrícula: 2514951
- David Moraes Costa - Matrícula: 2524967
- Danillo Castro de Sousa - Matrícula: 2523562

## 🚀 Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/eu-ed44/unifor-plataformas-web.git
```

### 2. Acessar a pasta do projeto e instalar as dependências
```bash
cd unifor-plataformas-web/frontend
npm install
```

### 3. Executar o projeto (Front-end + API)
```bash
npm run dev
```

### 4. Acessar no navegador
- **Aplicação Web (React):** `http://localhost:3000`
- **API (`json-server`):** `http://localhost:3001` (endpoints `/categorias` e `/pratos`)

> **Dica:** caso a porta `3000` ou `3001` já esteja em uso no seu computador, encerre o processo anterior ou verifique o terminal antes de iniciar novamente.
