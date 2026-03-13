# ShipTrack - Sistema de Controle de Importacao Maritima

Frontend para controle e registro de processos de importacao maritima, incluindo conferencia de MBL/MHBL/HBL, controle de peso, volumes, navio e portos, registro de CE Mercante e validacao de divergencias.

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm 9+

## Instalacao

```bash
cd frontend
npm install
```

## Executando em desenvolvimento

```bash
npm run dev
```

O servidor iniciara em `http://localhost:3000`.

## Build para producao

```bash
npm run build
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/
│   ├── layout/          # AppLayout, Sidebar, Header
│   └── ui/              # Button, Card, Input, Select, Modal, StatusBadge, etc.
├── hooks/               # useProcessos, useProcesso, useDashboardStats
├── pages/
│   ├── Dashboard.tsx    # Visao geral com cards e processos recentes
│   ├── ProcessoForm.tsx # Cadastro de novo processo (MBL/HBL)
│   ├── ProcessoList.tsx # Lista geral com filtros, busca e paginacao
│   ├── ProcessoDetalhes.tsx # Detalhes completos de um processo
│   ├── Conferencia.tsx  # Comparacao MBL vs HBL vs CE Mercante
│   └── CEMercante.tsx   # Registro de CE Mercante do HBL
├── services/
│   ├── api.ts           # Axios instance configurada
│   ├── mockData.ts      # Dados simulados para desenvolvimento
│   └── processoService.ts # Service layer (mock, pronto para API real)
├── types/
│   └── index.ts         # Tipos TypeScript (Processo, Divergencia, etc.)
├── utils/
│   ├── cn.ts            # Utility para class names
│   └── format.ts        # Formatacao de peso, data, etc.
├── App.tsx              # Rotas e configuracao
└── main.tsx             # Entry point
```

## Telas

### 1. Dashboard
- Cards com totais: Total, Aguardando CE, Conferencia Pendente, Finalizados
- Lista de processos recentes
- Acoes rapidas

### 2. Cadastro de Processo (`/processos/novo`)
- Formulario completo com validacao (React Hook Form)
- Dados do BL (MBL, HBL, MHBL)
- Dados de transporte (navio, viagem, portos)
- Dados de carga (peso, volumes, tipo FCL/LCL)
- Gerenciamento dinamico de containers (para FCL)

### 3. Lista de Processos (`/processos`)
- Tabela com todos os processos
- Filtros por status, tipo de carga
- Busca por MBL, HBL, navio
- Paginacao

### 4. Conferencia Documental (`/conferencia`)
- Comparacao visual MBL vs HBL
- Campos divergentes destacados em vermelho
- Indicador de status por campo (OK / Divergente)
- Suporte a CE Mercante quando disponivel

### 5. CE Mercante (`/ce-mercante`)
- Busca de processo
- Verificacao de pre-requisitos (CE Master, sem divergencias)
- Formulario para registro do CE do HBL
- Validacao de regras de negocio

## Stack Tecnologica

- **React 19** + **TypeScript**
- **Vite 7** (build tool)
- **Tailwind CSS 4** (estilizacao)
- **React Router 7** (navegacao)
- **React Hook Form** (formularios + validacao)
- **Axios** (HTTP client)
- **React Hot Toast** (notificacoes)
- **Lucide React** (icones)
- **date-fns** (manipulacao de datas)

## Integracao com Backend

Os services estao em `src/services/processoService.ts` com dados mockados.
Para conectar ao backend real:

1. Crie um arquivo `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

2. Substitua as chamadas mock por chamadas Axios reais em `processoService.ts`.

O arquivo `src/services/api.ts` ja esta configurado com Axios e interceptors de erro.

## Regras de Negocio

- Campos criticos (navio, viagem, portos, peso, volumes, containers) devem bater entre MBL, HBL e CE Mercante
- Divergencias impedem a finalizacao do processo
- CE Master deve ser registrado antes do CE HBL
- Processo so e finalizado quando CE HBL e registrado sem divergencias
