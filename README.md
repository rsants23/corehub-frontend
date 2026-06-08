# Efata CoreHub — Frontend

Frontend integrado com a **CoreHub API** (`http://localhost:3100/api`).

## Como rodar

```bash
# 1. API (porta 3100)
cd corehub-api
npm run start:dev

# 2. Frontend (porta 80)
cd corehub-frontend
npm install
npm run dev
```

Acesse [http://localhost](http://localhost).

## Configuração

`.env`:

```
PORT=80
NEXT_PUBLIC_API_URL=http://localhost:3100/api
```

## Integração com API

Todas as telas consomem a API via TanStack Query:

| Tela | Endpoints |
|------|-----------|
| Dashboard | `/therapists`, `/schedules/daily`, `/absences`, `/cancellations`, `/rescheduling/suggestions` |
| Pacientes | `GET/POST/PATCH/DELETE /patients` |
| Terapeutas | `GET/POST/PATCH/DELETE /therapists` |
| Agendas | `/schedules/fixed/day/*`, `/schedules/daily/generate` |
| Faltas | `/absences`, `/cancellations` |
| Remanejamento | `/rescheduling/simulate`, `/rescheduling/suggestions` |
| Relatórios | Métricas calculadas a partir dos endpoints acima |
| Configurações | `/therapy-types`, contadores de pacientes/terapeutas |

## Fluxo operacional recomendado

1. `npm run db:setup` no backend (seed)
2. **Agendas** → Gerar agenda diária
3. **Faltas** → Registrar ausências/cancelamentos
4. **Remanejamento** → Gerar sugestões → Aprovar/Rejeitar

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento (porta 80) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção (porta 80) |
