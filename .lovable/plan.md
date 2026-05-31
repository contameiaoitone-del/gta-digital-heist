## Causa raiz

O pedido de mentoria do Victor (`1266f47c-e8a8-419e-ac2b-fa83ad499c19`, produto `mentoria:b4763894-a720-4238-b448-a0204369d807`) foi pago em 30/05 às 05:00. O webhook do ZZGate disparou normalmente e chamou a função `grant-member-access`, mas o acesso à mentoria **nunca foi criado** — só existia o acesso antigo a `treinamento`. Tive que liberar manualmente (`granted_at` 16:41).

O bug está em `supabase/functions/grant-member-access/index.ts`, função `normalizeAccessProduct`:

```ts
function normalizeAccessProduct(product: string): string {
  if (["lp2", "lp2_97", "lp2_5"].includes(product)) return "treinamento";
  if (product.startsWith("mentoria:")) return "treinamento";  // ← BUG
  return product;
}
```

Quando o produto é `mentoria:<id>`, a função normaliza para `"treinamento"` e faz upsert com `onConflict: "user_id,product"`. Como o usuário já tinha `treinamento` ativo (da compra anterior do lp2_97), o upsert vira no-op e **nenhuma linha de `mentoria:<id>` é criada**. Sem essa linha, a RLS de `lessons`/`modules` bloqueia o módulo pago de mentoria:

```sql
has_active_access(auth.uid(), 'mentoria:' || m.id)
```

## Correção

Em `supabase/functions/grant-member-access/index.ts`:

1. Remover a linha `if (product.startsWith("mentoria:")) return "treinamento";` de `normalizeAccessProduct`. Mentorias devem preservar o produto `mentoria:<module_id>` para que o upsert crie a linha correta.
2. Manter o comportamento de pular email de boas-vindas para add-ons de mentoria (já está correto via `isMentoriaAddon`).

## Backfill (one-off)

Verificar via query se há outros pedidos pagos com `product LIKE 'mentoria:%'` cujo `user_id` não tem linha correspondente em `member_access` e inserir os faltantes. Pela leitura inicial, o caso do Victor já foi corrigido manualmente, mas vou rodar a verificação para garantir que nenhum outro aluno está bloqueado.

## Verificação

Após o fix, simular reinvocação da `grant-member-access` para o `order_id 1266f47c-...` (idempotente via `onConflict: user_id,product`) e confirmar que a linha `mentoria:b4763894-...` é criada automaticamente.
