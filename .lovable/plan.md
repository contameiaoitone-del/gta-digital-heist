
# Área de Membros estilo Netflix — InfoZap

## Visão geral

Após o pagamento confirmado (Pix ou Cartão), o aluno é automaticamente logado e redirecionado para `/membros`. Receberá também um email com login + senha aleatória + magic link de backup. Você terá um painel `/admin` para cadastrar módulos e aulas (vídeos do YouTube).

## Fluxo do aluno

```
Pagamento confirmado (webhook Efí)
        │
        ▼
Cria usuário no Auth (email do checkout, senha aleatória)
        │
        ▼
Envia email: login + senha + botão "Entrar agora" (magic link)
        │
        ▼
Página /obrigado dispara magic link → auto-login → /membros
```

## Estrutura de páginas

- `/membros` — Home Netflix: hero do módulo em destaque + carrosséis horizontais por módulo (capas das aulas)
- `/membros/aula/:id` — Player YouTube embed 16:9, título, descrição, "próxima aula", botão marcar concluída, lista lateral do módulo
- `/membros/login` — Email + senha, link "Esqueci a senha", botão "Receber magic link"
- `/membros/perfil` — Trocar senha, ver progresso geral
- `/admin` — Protegido por role `admin`. CRUD de módulos e aulas
- `/auth/callback` — Recebe magic link e redireciona para `/membros`

## Banco de dados (novas tabelas)

- `profiles` — id (uuid → auth.users), full_name, email, created_at
- `user_roles` — id, user_id, role (`enum: admin|student`) — padrão seguro contra escalada de privilégio
- `modules` — id, title, description, cover_url, position, published, created_at
- `lessons` — id, module_id, title, description, youtube_url, duration_seconds, position, published, created_at
- `lesson_progress` — id, user_id, lesson_id, completed, watched_seconds, last_watched_at — único por (user_id, lesson_id)
- `member_access` — id, user_id, product (`infozap`), order_id, granted_at, active

Função `has_role(user_id, role)` (SECURITY DEFINER) para policies sem recursão.

## RLS

- `modules` / `lessons`: SELECT público para `published=true` E aluno tiver `member_access.active=true`. Admin vê tudo.
- `lesson_progress`: aluno só lê/escreve as próprias linhas
- `member_access`: aluno lê próprio acesso; só service role insere
- `profiles`: aluno lê/atualiza o próprio
- Admin (via `has_role`) faz CRUD em `modules`, `lessons`, lê tudo

## Edge Functions (novas/atualizadas)

- **`grant-member-access`** (nova) — chamada pelo `efi-webhook` após pagamento aprovado:
  1. Cria usuário em `auth.admin.createUser` com senha aleatória (32 chars)
  2. Insere `profiles` + `member_access`
  3. Gera magic link via `auth.admin.generateLink({ type: 'magiclink' })`
  4. Enfileira email transacional `member-welcome` com: nome, email (login), senha gerada, botão magic link

- **`efi-webhook`** (atualização) — depois do `Purchase`/`CompletePayment`, invoca `grant-member-access`

- **`auto-login-after-payment`** (nova) — chamada pela `/obrigado`: dado `orderId`, retorna magic link de uso único pra logar o aluno automaticamente sem ele digitar senha

## Email transacional

- Template `member-welcome`: marca InfoZap (preto + neon green/pink, Bebas Neue), com:
  - Boas-vindas
  - Login (email) + Senha temporária
  - Botão grande "ENTRAR AGORA" (magic link, expira em 24h)
  - Link backup: `reallifeacademy.com.br/membros/login`
  - Instruções pra trocar a senha

Requer setup de domínio de email (`notify.reallifeacademy.com.br`).

## Painel Admin (`/admin`)

Protegido por `has_role(user, 'admin')`. Telas:

- **Módulos**: lista com drag-to-reorder, criar/editar (título, descrição, capa via upload pra Storage), publicar/despublicar
- **Aulas** (dentro do módulo): lista reordenável, criar/editar (título, descrição, URL YouTube, duração detectada da URL/oEmbed), publicar/despublicar
- **Alunos**: lista de `member_access` com email, data, status, botão "reenviar email de boas-vindas"

Você vira admin manualmente via SQL após criar sua conta (te passo o comando).

## UX Netflix

- Hero topo: capa do módulo em destaque + botão "Continuar assistindo" (última aula com `lesson_progress` incompleto) ou "Começar agora"
- Carrosséis horizontais (`embla-carousel`) por módulo, cards 16:9 com hover-zoom, badge de progresso
- "Continue assistindo" (carrossel topo) com aulas em progresso
- Marca de progresso: barra inferior no card (% watched), check verde quando concluída
- Player: tracking de progresso a cada 10s via YouTube IFrame API → `lesson_progress.watched_seconds`; marca `completed=true` aos 90%
- Auto-play próxima aula ao terminar
- Mobile: bottom nav (Home / Módulos / Perfil)

## Storage

- Bucket `module-covers` (público) — capas dos módulos enviadas pelo admin

## Detalhes técnicos

- Auth: email/senha + magic link. **Sem cadastro público** — `signUp` desabilitado no front; usuários só são criados pelo `grant-member-access`
- Auto-login pós-pagamento: a página `/obrigado` (quando `eventId` presente) chama `auto-login-after-payment` → recebe magic link → faz redirect → sessão ativa em `/membros`
- YouTube embed via `youtube.com/embed/{videoId}?enablejsapi=1` + IFrame API pra eventos de progresso
- Roteamento: novas rotas em `App.tsx` com lazy loading; `/membros/*` e `/admin/*` protegidas por componente `<RequireAuth role="...">`
- Segurança: roles em tabela separada (`user_roles`) — nunca em `profiles`. Function `has_role` com `SECURITY DEFINER`. Service role só nas Edge Functions.
- Componentes: shadcn (Card, Carousel, Dialog, Form, Table). Tailwind com tokens existentes.

## Confirmações antes de codar

1. Sender domain do email: posso usar `notify.reallifeacademy.com.br`? (vai abrir um diálogo de DNS)
2. Após eu criar tudo, te passo o comando SQL pra te promover a admin com seu email — qual email você usa?
3. OK começar com 0 módulos/aulas (você cadastra tudo no admin) ou quer que eu já popule com os 17 módulos do InfoZap (sem URLs do YouTube, você completa depois)?
