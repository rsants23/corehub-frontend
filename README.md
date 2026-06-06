# Efata CoreHub — Frontend

Frontend do sistema de remanejamento automático de agenda para clínicas terapêuticas.

## Stack

- Next.js 15+ (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query + TanStack Table
- Zustand + Recharts + Lucide React

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost](http://localhost) (porta 80).

> A porta 80 pode exigir execução do terminal como administrador no Windows.

**Login mock:** `coordenacao@clinica.com` / `123456`

## Estrutura

```
src/
├── app/              # Rotas (login, dashboard, pacientes, etc.)
├── components/       # UI, layout, tables, shared
├── modules/          # Lógica por domínio (auth, pacientes, etc.)
├── services/         # HTTP client e API service
├── hooks/            # React hooks (TanStack Query)
├── stores/           # Zustand stores
├── types/            # Tipos TypeScript
├── utils/            # Utilitários
└── constants/        # Rotas e endpoints da API
```

## Integração com backend

Configure em `.env`:

```
PORT=80
NEXT_PUBLIC_API_URL=http://localhost:3100/api
```

| Serviço  | URL |
|----------|-----|
| Frontend | http://localhost |
| API      | http://localhost:3100/api |
| Swagger  | http://localhost:3100/docs |

Os serviços por módulo usam `USE_MOCK = true`. Para integrar com a API, altere para `false` em cada `*.service.ts`.

## Scripts

| Comando       | Descrição              |
|---------------|------------------------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção    |
| `npm run start` | Servidor de produção |
| `npm run lint`  | ESLint               |
