# Projeto Integrador — Gestão de Processos de Comércio Exterior

Sistema web para gestão de processos de importação/exportação, com controle de acesso por papel, acompanhamento de processos, conferência documental e CE Mercante.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Funcionalidades

- **Dashboard** com visão consolidada dos processos
- **Cadastro e listagem de processos**, com formulário validado e página de detalhes
- **Conferência** documental dos processos
- **CE Mercante** — módulo dedicado
- **Gestão de usuários** com atribuição de papéis
- **RBAC (Role Based Access Control)** — permissões centralizadas por papel e recurso

### Papéis e permissões

| Papel | Descrição | Acesso |
|---|---|---|
| `ADMIN` | Administrador | Todos os recursos, incluindo usuários e configurações |
| `GESTOR` | Gestor | Processos, conferência, CE Mercante e relatórios |
| `USER` | Funcionário | Acesso operacional restrito |

As permissões ficam centralizadas em `frontend/src/auth/permissions.ts`, combinando **recurso** (`processos`, `conferencia`, `ce-mercante`, `relatorios`, `usuarios`, `configuracoes`, `dashboard`) com **ação** (`create`, `read`, `update`, `delete`, `review`, `manage`).

O roteamento protegido é feito por três camadas:

- `PrivateRoute` — exige usuário autenticado
- `RoleRoute` — exige um papel específico
- `ResourceRoute` — exige permissão sobre um recurso

---

## Stack

**Frontend** (`frontend/`)

| Ferramenta | Uso |
|---|---|
| React 19 + TypeScript | Base da aplicação |
| Vite | Build e dev server |
| React Router 7 | Roteamento e rotas protegidas |
| React Hook Form + Zod | Formulários e validação de schema |
| Tailwind CSS 4 | Estilização |
| Axios | Cliente HTTP |
| React Hot Toast | Notificações |
| date-fns | Formatação de datas |
| Lucide React | Ícones |

---

## Estrutura

```
frontend/src/
├── auth/            # AuthContext, useAuth e definição de permissões (RBAC)
├── components/
│   ├── layout/      # AppLayout, Header, Sidebar
│   └── ui/          # Button, Card, Input, Modal, Select, StatusBadge...
├── hooks/           # useProcessos
├── pages/           # Dashboard, ProcessoList, ProcessoForm, ProcessoDetalhes,
│                    # Conferencia, CEMercante, Users, Unauthorized
├── routes/          # PrivateRoute, RoleRoute, ResourceRoute
├── services/        # api, processoService, userService, mockData
├── types/           # Tipagens compartilhadas
└── utils/           # cn (classnames), format
```

---

## Como rodar

Requer **Node.js 18+**.

```bash
git clone https://github.com/EduardaBedetti/ProjetoIntegrador.git
cd ProjetoIntegrador/frontend
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente e ajuste a URL da API:

```bash
cp .env.example .env
```

Suba o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualiza o build |
| `npm run lint` | Checagem com ESLint |

> O projeto acompanha `services/mockData.ts`, permitindo navegar pelas telas sem back-end ativo.

---

## Status

Projeto acadêmico em desenvolvimento. O diretório raiz contém também uma versão inicial em **Next.js 16** (`app/`, `components/`), mantida como referência da primeira iteração do layout.
