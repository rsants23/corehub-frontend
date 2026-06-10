# Efata CoreHub — Frontend

Frontend Next.js integrado à **CoreHub API** para gestão de agenda, faltas e remanejamento automático em clínicas terapêuticas.

## Pré-requisitos

- Node.js 18+
- npm 9+
- PostgreSQL (via backend)
- CoreHub API em execução

## Instalação

```bash
cd corehub-frontend
npm install
cp .env.example .env.local
```

## Variáveis de ambiente

Crie `.env.local` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3100/api
```

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL base da API (inclui `/api`) | `http://localhost:3100/api` |
| `PORT` | Porta do Next.js (opcional) | `3000` |

## Como rodar

### Backend

```bash
cd corehub-api
npm install
npm run db:setup    # migrations + seed (primeira vez)
npm run start:dev   # http://localhost:3100 — Swagger em /docs
```

### Frontend

```bash
cd corehub-frontend
npm run dev         # http://localhost:3000
```

### Produção

```bash
npm run build
npm run start
```

## Login

Autenticação via **usuário ou e-mail + senha** → JWT armazenado em `localStorage`.

Tela em `/login`: campos *Usuário ou E-mail* e *Senha*.

- **Um vínculo** → JWT direto
- **Múltiplos vínculos** → `/selecionar-clinica` (clínicas vencidas aparecem bloqueadas)
- Após escolher → `POST /auth/select-clinic` → redirecionamento por role

Admin global permanece separado em `/admin/login` (e-mail + senha).

### Credenciais de desenvolvimento

Use os valores definidos no seed da API (`SEED_CNPJ`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` em `corehub-api/.env`). Após `npm run db:setup`, o terminal exibe CNPJ e e-mail — **não use credenciais hardcoded no frontend**.

O CNPJ é normalizado para 14 dígitos antes do envio. Após login, o token é enviado automaticamente como `Authorization: Bearer` em todas as requisições. Em 401, a sessão é encerrada e o usuário redirecionado para `/login`.

## Papéis (RBAC)

| Papel | Acesso no menu |
|-------|------------------|
| **ADMIN** | Todos os módulos |
| **COORDINATOR** | Dashboard, pacientes, terapeutas, agendas, faltas, remanejamento, relatórios, auditoria |
| **RECEPTION** | Dashboard, pacientes, agendas, faltas |
| **THERAPIST** | Dashboard, agendas (Minha Agenda) |

Menus filtrados por `getNavItemsForRole()` em `src/constants/routes.ts`. `RouteGuard` ativo em `/dashboard`, `/usuarios` e `/auditoria`.

Detalhes completos: [../docs/rbac-matrix.md](../docs/rbac-matrix.md)

## Estrutura de pastas

```
src/
├── app/                    # Rotas Next.js (App Router)
├── components/
│   ├── auth/               # RouteGuard
│   ├── layout/             # AppShell, Sidebar, Header
│   └── ui/                 # shadcn/ui
├── constants/
│   ├── api.ts              # Endpoints
│   └── routes.ts           # Rotas e RBAC de navegação
├── modules/
│   ├── auth/               # Login JWT (CNPJ)
│   ├── pacientes/
│   ├── terapeutas/
│   ├── agendas/
│   ├── faltas/
│   ├── remanejamento/
│   ├── relatorios/
│   ├── usuarios/
│   ├── auditoria/
│   └── configuracoes/
├── services/
│   ├── http-client.ts      # Fetch + Bearer JWT
│   └── api.ts
└── stores/                 # Zustand (auth, toast, settings)
```

## Status da integração

| Módulo | Status | Endpoints principais |
|--------|--------|----------------------|
| Autenticação | ✅ Integrado | `POST /auth/login`, `GET /auth/me` |
| Dashboard | ✅ Integrado | `GET /reports/dashboard` |
| Pacientes | ✅ Integrado | `GET/POST/PATCH/DELETE /patients` |
| Terapeutas | ✅ Integrado | `GET/POST/PATCH/DELETE /therapists` |
| Agendas | ✅ Integrado | `/schedules/fixed/*`, `/schedules/daily/*` |
| Faltas | ✅ Integrado | `/absences`, `/cancellations` |
| Remanejamento | ✅ Integrado | `/rescheduling/generate`, `/rescheduling/suggestions/*` |
| Relatórios | ✅ Integrado | `/reports/occupancy`, `/reports/absences` |
| Usuários | ⚠️ Parcial | `GET /users` (sem CRUD na UI) |
| Configurações | ⚠️ Parcial | `/therapy-types` (API) + dados locais (Zustand) |
| Auditoria | ✅ Integrado | `GET /audit-logs` |
| Consentimentos | ❌ Pendente | `/consents` definido, sem UI |

Mapa completo: [../docs/api-integration-map.md](../docs/api-integration-map.md)

### Fluxo operacional

1. Login com CNPJ da clínica
2. Cadastre pacientes, terapeutas e horários fixos
3. **Agendas** → Gerar agenda diária
4. **Faltas** → Registrar ausências/cancelamentos
5. **Remanejamento** → Gerar sugestões → Aprovar → Aplicar

## Camada de API

- **http-client.ts** — fetch centralizado, Bearer JWT, logout em 401
- **api-error.ts** — mensagens amigáveis para erros HTTP
- **TanStack Query** — cache, loading, invalidação após mutations
- **Zustand** — auth (`corehub-auth`), toast e configurações locais

## Painel Central Admin (Beta)

Acesso separado do login clínico em `/admin/login`.

| Rota | Descrição |
|------|-----------|
| `/admin/login` | Login administrativo global |
| `/admin/dashboard` | Dashboard SaaS |
| `/admin/clinicas` | Gestão de clínicas |

Sessão admin isolada: `corehub-admin-auth` (localStorage) + `corehub-admin-session` (cookie).

Ver [../docs/admin-panel.md](../docs/admin-panel.md).

## Documentação relacionada

| Documento | Conteúdo |
|-----------|----------|
| [../docs/multi-tenant-architecture.md](../docs/multi-tenant-architecture.md) | Arquitetura SaaS |
| [../docs/admin-panel.md](../docs/admin-panel.md) | Painel Central Admin |
| [../docs/api-integration-map.md](../docs/api-integration-map.md) | Mapa frontend ↔ API |
| [../docs/rbac-matrix.md](../docs/rbac-matrix.md) | Permissões por papel |
| [../docs/business-rules.md](../docs/business-rules.md) | Regras de negócio |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento com Turbopack |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
