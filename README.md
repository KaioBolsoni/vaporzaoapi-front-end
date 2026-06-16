# 🎮 Vaporzão — TaTaKazim Jogos

> Plataforma de jogos inspirada na Steam, desenvolvida como projeto acadêmico na **Faculdade Faminas**. Permite que alunos publiquem, gerenciem e avaliem jogos em um catálogo colaborativo.

---

## 📸 Visão Geral

O **Vaporzão** é uma aplicação web fullstack onde estudantes podem:

- Criar e publicar seus próprios jogos com capa, galeria de imagens e conquistas
- Explorar o catálogo geral com filtros por gênero, preço e ordenação
- Comprar jogos (adicionar à biblioteca) e criar wishlist
- Avaliar jogos com nota e recomendação (sistema de reviews)
- Visualizar perfis públicos de outros jogadores

---

## 🚀 Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + Vite 8 |
| Roteamento | React Router DOM v7 |
| Requisições HTTP | Axios (com interceptors) |
| Alertas | SweetAlert2 |
| Autenticação | JWT (localStorage) |
| Estilização | CSS customizado + CSS Variables (design tokens) |

---

## 🗂️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis (Navbar, GameCard, Layout...)
├── context/           # Contextos globais (AuthContext, GlobalState)
├── hooks/             # Custom Hooks (useForm, useRequestData)
├── pages/             # Páginas da aplicação
├── routes/            # Definição centralizada de rotas (AppRoutes)
├── services/          # Configuração do Axios (api.js)
├── styles/            # Estilos compartilhados (formStyles)
└── utils/             # Utilitários (swal, gameColors, userUtils)
```

---

## ✅ Funcionalidades Implementadas

### 🔐 Autenticação
- Login com matrícula e senha
- Primeiro acesso com definição de senha
- Proteção de rotas via `ProtectedRoute` com validação de expiração do JWT
- Logout automático em caso de token inválido (interceptor Axios)

### 🏠 Home
- Banner hero com o jogo mais avaliado em destaque
- Seções de jogos recentes, mais avaliados e populares
- Sidebar com categorias por gênero e atalhos de navegação

### 📚 Catálogo
- Listagem de todos os jogos disponíveis
- Filtros por gênero (múltipla seleção), preço (grátis/pago) e ordenação (A–Z, preço, recentes)
- Barra de busca por título
- Estado de loading com skeleton screens

### 🎮 Detalhes do Jogo
- Capa, descrição, gêneros, preço e desenvolvedora
- Galeria de imagens (screenshots)
- Seção de conquistas com ícones e pontuação
- Sistema de reviews com nota e recomendação
- Ações: adicionar à biblioteca, adicionar à wishlist, escrever/editar/excluir review

### 👤 Perfil Público
- Informações do jogador (nome, matrícula, data de cadastro)
- Estatísticas: jogos criados, reviews, biblioteca, wishlist
- Lista de jogos criados com acesso ao gerenciamento
- Histórico das últimas reviews
- Edição de nome (apenas no próprio perfil)

### 📦 Biblioteca
- Lista de jogos adquiridos pelo usuário
- Edição de horas jogadas por jogo
- Remoção de jogos gratuitos da biblioteca

### ❤️ Wishlist
- Lista de jogos salvos para compra futura
- Remoção individual de itens

### ➕ Criar Jogo
- Formulário completo: título, descrição, preço, desenvolvedora, data de lançamento, capa e gêneros
- Validação de campos e feedback via SweetAlert2
- Limite de 3 jogos por aluno

### ⚙️ Gerenciar Jogo
- Edição dos dados gerais do jogo
- Galeria de imagens: adição de screenshots com legenda
- Conquistas: adição com título, descrição, pontos (0–1000) e ícone (URL)

---

## 🪝 Custom Hooks

### `useForm`
Centraliza o estado de formulários, eliminando múltiplos `useState` por campo.

```js
const [form, onChange] = useForm({ campo1: "", campo2: "" });
```

### `useRequestData`
Encapsula o padrão `data + isLoading + error + useEffect` de requisições assíncronas, com suporte a refetch.

```js
const { data, isLoading, error, refetch } = useRequestData(
  () => api.get("/endpoint").then(r => r.data),
  [dependencia]
);
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- API do Vaporzão rodando localmente

### Instalação

```bash
# Clone o repositório
git clone https://github.com/KaioBolsoni/vaporzaoapi-front-end.git
cd vaporzaoapi-front-end

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz com a URL base da API:

```env
VITE_API_URL=http://localhost:3000
```

---

## 👥 Equipe

| Nome | Papel |
|------|-------|
| **João Victor Pacheco** | Desenvolvimento Frontend |
| **Thales Caetano** | Desenvolvimento Frontend |
| **Heitor Polastri** | Desenvolvimento Frontend |
| **Kaio Bolsoni** | Desenvolvimento Frontend |

---

## 🏫 Instituição

Projeto desenvolvido para a disciplina de **Desenvolvimento Web** na  
**Faculdade de Minas — FAMINAS**, 2025.
