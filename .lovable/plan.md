## Confirmação: a integração ESTÁ funcionando

Pelos logs da edge function `meta-capi` (testes mais recentes), tanto **PageView** quanto **InitiateCheckout** foram disparados e aceitos pela Meta com sucesso:

```
[capi] sending { event_name: "PageView", has_fbp: true, has_fbc: true, has_ip: true, has_ua: true, has_em: true, has_ph: true }
[capi] meta response { status: 200, body: { events_received: 1, ... } }

[capi] sending { event_name: "InitiateCheckout", has_fbp: true, has_fbc: true, has_em: true, has_ph: true }
[capi] meta response { status: 200, body: { events_received: 1, ... } }
```

Ou seja: o servidor mandou, a Meta recebeu (200, `events_received: 1`, sem `messages` de erro), com `fbp`, `fbc`, IP, UA, email e telefone hasheados. Está 100%.

Se o **InitiateCheckout não aparece em "Eventos do site"** no Events Manager, o motivo é:

1. **"Eventos do site" mostra apenas eventos do Pixel (browser)**, não do CAPI puro. Como você está com `META_TEST_EVENT_CODE` configurado, **todos os eventos vão para "Test Events"**, não para "Eventos do site". Por isso não aparecem lá.
2. Depois que removermos o test code, os eventos passam a contar como tráfego real e aparecem normalmente em "Visão geral" / "Eventos do site" (com alguns minutos de delay).

## Mudanças

### 1. `supabase/functions/meta-capi/index.ts`
- Remover os dois `console.log` de diagnóstico (`[capi] sending` e `[capi] meta response`).
- Manter apenas o `console.error` em caso de falha.

### 2. `src/hooks/useTracking.ts`
- Remover os 3 `console.debug("[track] ...")` (PageView, InitiateCheckout, Purchase).
- Manter o `waitForFbp()` (essa lógica é importante e deve ficar).

### 3. Secret `META_TEST_EVENT_CODE`
- Deletar via `delete_secret` para que os eventos parem de ser roteados para Test Events e passem a contar como tráfego real.

### 4. Deploy
- Redeploy da função `meta-capi` para aplicar a remoção dos logs e a ausência do test code.

## Como verificar que está funcionando (depois)

**A) Em tempo real (Test Events) — opcional, para debug futuro**
- Events Manager → seu Pixel → aba **Test Events**
- Para usar essa aba sem o secret, basta abrir o site com `?fbclid=test` ou usar a extensão **Meta Pixel Helper** do Chrome (ela mostra os eventos do Pixel em qualquer página em tempo real, com todos os parâmetros).

**B) Pixel Helper (Chrome extension)**
- Instala `Meta Pixel Helper`. Abre `/infozap`. Deve mostrar `PageView` disparado. Abre o checkout até a etapa de método de pagamento → mostra `InitiateCheckout` com `value: 67`, `currency: BRL`, `content_name: InfoZap` e um `eventID`.

**C) Events Manager → "Visão geral"**
- Após remover o test code, os eventos `PageView` e `InitiateCheckout` aparecem na aba **Visão geral** e **Eventos do site** com 5–20 min de delay. Vai mostrar a divisão **Browser / Server / Deduplicado** — se aparecer "Deduplicado" significa que Pixel + CAPI estão batendo pelo `event_id` (que é exatamente o objetivo).

**D) Qualidade do evento (EMQ)**
- Events Manager → seu Pixel → aba **Qualidade da correspondência de eventos**. Deve subir nos próximos dias para 7+ porque agora estamos enviando email, telefone, nome, CPF (`external_id`), IP, UA, `fbp`, `fbc`, país, estado e cidade — todos hasheados quando exigido.

## Por que o InitiateCheckout parecia "não estar sendo enviado"

Ele **estava** sendo enviado (logs comprovam). O que acontece é:
- Com `META_TEST_EVENT_CODE` ativo, ele NÃO aparece em "Eventos do site".
- Em "Test Events" às vezes demora ~30s e depende do filtro de URL estar correto (use **sem filtro**).
- O Pixel Helper é a forma mais rápida de confirmar visualmente o disparo no browser.