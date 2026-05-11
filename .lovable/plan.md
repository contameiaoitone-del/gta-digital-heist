## Visão geral

Hoje os módulos são todos "treinamento" e o acesso é liberado pela tabela `member_access` (produto `infozap`). Vamos introduzir o conceito de **módulo de mentoria**, que é pago individualmente. O acesso continua sendo controlado por `member_access`, agora com um produto por módulo de mentoria (`mentoria:<module_id>`), além do produto global `mentoria` (acesso a tudo).

---

## 1. Banco de dados (migration)

**Tabela `modules`** — adicionar:
- `kind text NOT NULL DEFAULT 'treinamento'` (valores: `treinamento` | `mentoria`)
- `price_cents integer` (obrigatório quando `kind='mentoria'`, validado por trigger)

**Tabela `orders`** — usar a estrutura existente; novos pedidos de mentoria gravam `product = 'mentoria:<module_id>'`, `amount_cents = modules.price_cents`.

**Tabela `member_access`** — sem mudança de schema. Concessões de mentoria usam:
- `product = 'mentoria:<module_id>'` para acesso a um módulo específico
- `product = 'mentoria'` para acesso global a todos os módulos de mentoria (atribuição manual via admin)

**RLS de `lessons`** — atualizar o policy "Members view published lessons" para considerar mentoria:
```
published AND EXISTS (
  SELECT 1 FROM modules m
  WHERE m.id = lessons.module_id AND m.published
  AND (
    (m.kind = 'treinamento' AND has_active_access(auth.uid(), m.product))
    OR (m.kind = 'mentoria' AND (
         has_active_access(auth.uid(), 'mentoria')
      OR has_active_access(auth.uid(), 'mentoria:' || m.id::text)
    ))
  )
)
```
Mesma lógica no policy de `modules`.

---

## 2. Admin — Conteúdo (`src/pages/admin/Admin.tsx`)

No editor de módulo (`editingModule`):
- Novo seletor **Tipo**: "Treinamento" / "Mentoria".
- Quando **Mentoria** for selecionado, mostrar campo obrigatório **Valor (R$)** convertido para `price_cents`.
- Salvar `kind` e `price_cents` no payload.
- Listagem de módulos: badge mostrando `Mentoria · R$ X,XX` quando aplicável.

---

## 3. Gate de pagamento na página da aula (`src/pages/membros/Aula.tsx` e `Modulo.tsx`)

Fluxo ao abrir uma aula de módulo `mentoria`:
1. Frontend consulta `member_access` para `mentoria` ou `mentoria:<module_id>`.
2. Se já tiver acesso → libera normalmente.
3. Caso contrário → renderiza um overlay com:
   - Título do módulo + valor.
   - QR Code Pix gerado pela edge function existente (`pix-create`), usando o gateway ativo definido em `payment_settings.active_pix_gateway` (Efí ou ZZGate).
   - Polling em `pix-check-status` (já existe). Quando `paid`, o webhook (`efi-webhook` / `zzgate-webhook`) cria o registro em `member_access` com `product = 'mentoria:<module_id>'` e a UI recarrega.
4. Mesmo overlay disponível no card da aula em `Modulo.tsx` (botão "Liberar mentoria — R$ X").

**Edge functions afetadas:**
- `pix-create`: aceitar `product = 'mentoria:<module_id>'` e validar `amount_cents` contra `modules.price_cents` no servidor (não confiar no cliente).
- `efi-webhook` e `zzgate-webhook`: ao confirmar pagamento, se `order.product` começar com `mentoria:`, fazer upsert em `member_access` com esse mesmo `product`.

---

## 4. Admin — Usuários (`src/pages/admin/Users.tsx`)

- Nova coluna **Acesso Mentoria** com toggle "Liberar / Remover" (igual à coluna atual de Treinamento), chamando `admin-users` action `set_access` com `product = 'mentoria'`.
- Atualizar `admin-users` (já tem `set_access`) — apenas passar o produto certo do frontend; nenhuma mudança necessária na função.
- Botão **"Novo usuário"** no header da página, abrindo modal com:
  - Email, Senha (mín. 6 caracteres).
  - Checkboxes: "Acesso Treinamento", "Acesso Mentoria", "Tornar admin".
  - Submete para `admin-users` action `create_user` (nova).

**Edge function `admin-users`** — adicionar action `create_user`:
- Cria usuário via `admin.auth.admin.createUser({ email, password, email_confirm: true })`.
- Aplica `user_roles` (admin) e `member_access` (treinamento / mentoria) conforme checkboxes.
- Retorna o usuário criado.

---

## 5. Detalhes técnicos

```
modules
  + kind ('treinamento' | 'mentoria', default 'treinamento')
  + price_cents (int, validado por trigger quando kind='mentoria')

member_access (sem mudança)
  product:
    'infozap'                → treinamento
    'mentoria'               → todos os módulos de mentoria (admin manual)
    'mentoria:<module_id>'   → acesso pago a um módulo específico

orders.product → 'mentoria:<module_id>' para pagamentos de mentoria
```

Permissões: `kind` e `price_cents` editáveis apenas por admin (já coberto pelo policy "Admins manage modules").

Validação no `pix-create` para garantir que o valor cobrado é o `price_cents` salvo no módulo (impede manipulação no cliente).

---

## Fora do escopo

- Reembolso / cancelamento de acesso pago.
- Mostrar histórico de mentorias compradas para o usuário.
- Cupons de desconto.
