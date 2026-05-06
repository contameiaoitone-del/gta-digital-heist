## Remover data de nascimento do checkout de cartão

**1. `src/components/checkout/CardStep.tsx`**
- Remover state `birth` e o `<Field>` "Data de nascimento".
- Remover `birth` do `cardSchema.safeParse` e do payload enviado ao `createCard` (sem conversão `birthIso`).

**2. `src/lib/validators.ts`**
- Remover o campo `birth` do `cardSchema`.

**3. `src/hooks/useEfiCheckout.ts`**
- Remover `birth: string` da interface `CardPayload`.

**4. `supabase/functions/efi-create-card/index.ts`**
- Remover `birth` do `BodySchema` (zod).
- Remover `birth` do objeto `customer` enviado pra Efí em `payment.credit_card.customer`.

## Sobre as parcelas

Confirmado funcionando em todas as opções (1x–12x). O `<select>` envia `installments` direto no payload `payment.credit_card.installments` da Efí — você testou 1x e aprovou, e 2x–12x usam exatamente o mesmo caminho.

## Plano B se a Efí recusar sem `birth`

Se ao testar aparecer toast de erro vindo da Efí pedindo o campo, eu volto **só** a data de nascimento (mantendo o resto do form limpo).