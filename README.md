# Projeto: Desenvolvimento de Plataformas Web

Aplicação Web completa desenvolvida como requisito de avaliação da disciplina **N695 - Desenvolvimento de Plataformas Web** da **Universidade de Fortaleza (UNIFOR)**.

## 📌 Escopo do Projeto
O sistema consiste em uma interface Web dinâmica para gestão de **Cardápio Digital** (marmitaria), consumindo um serviço Web próprio (`json-server`) e realizando as quatro operações básicas de **CRUD** (Criar, Listar, Atualizar e Excluir) para os pratos cadastrados, com persistência de dados no arquivo `db.json`.

**Cenário de Negócio Escolhido:** Marmitaria com Cardápio Digital (Gestão de Marmitas: incluir, listar, alterar e excluir pratos com nome, preço e descrição/acompanhamentos).

## ✨ Funcionalidades
- **Criar (`POST`):** Inclusão de novas marmitas informando nome, preço (`R$`) e descrição/acompanhamentos, com validação para impedir campos obrigatórios vazios ou apenas com espaços.
- **Listar (`GET`):** Exibição dinâmica dos pratos cadastrados na tabela com ID, nome, descrição e preço, além de aviso quando não há pratos cadastrados.
- **Atualizar (`PUT`):** Carregamento dos dados de um prato existente no formulário para edição e salvamento das alterações.
- **Excluir (`DELETE`):** Remoção de pratos diretamente pela interface com atualização imediata da tabela e da base JSON.
- **Resiliência:** Tratamento de falhas de rede nas requisições HTTP com feedback visual de erro na interface.

## 🛠️ Tecnologias Utilizadas
- **Front-end:** ReactJS, HTML5, CSS3, Bootstrap, Font Awesome, React Router DOM
- **Back-end / Persistência de Dados:** Node.js, `json-server` (`db.json`)
- **Comunicação HTTP:** Axios
- **Orquestração de Scripts:** `concurrently`

## 👥 Equipe
- Edcarlos de Sousa Rodrigues - Matrícula: 2524970
- Lucas Gondim Sampaio Sales - Matrícula: 2514951
- [Nome do Integrante 3] - Matrícula: [0000000]
- [Nome do Integrante 4] - Matrícula: [0000000]

## 🚀 Como executar o projeto localmente

### 1. Clonar o repositório
```bash
git clone [https://github.com/eu-ed44/unifor-plataformas-web.git](https://github.com/eu-ed44/unifor-plataformas-web.git)