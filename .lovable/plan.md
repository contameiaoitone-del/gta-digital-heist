
## O que já temos hoje

- **GTM Web** carregado pelo seu próprio subdomínio em `index.html` (`https://api.reallifeacademy.com.br/...`).
- Tabela **`visitor_sessions`** no banco com `sck`, `fbp`, `fbc`, `ip`, `user_agent`, `country`, `state`, `city`, `page_location`.
- Tabela **`orders`** já gravando compras Efí (Pix e cartão), com `customer_*` e `raw`.
- Edge functions Efí: `efi-create-pix`, `efi-create-card`, `efi-webhook` (Pix), `efi-check-status`.
- Secrets já configurados: `META_PIXEL_ID`, `META_ACCESS_TOKEN`.
- Memória do projeto registra: CAPI server-side já implementado anteriormente para CaktoPay; é só adaptar para o fluxo Efí.

Conclusão: **dá pra fazer tudo o que você quer sem Stape e sem GTM Server**. O envio para a Meta CAPI já sai server-side da nossa edge function direto pra `graph.facebook.com`, e o Pixel client-side já é servido pelo seu subdomínio via GTM. Não há perda de domínio em momento algum, porque o checkout passa a ser **na própria página**.

> Observação importante: para a Meta CAPI o que importa é o `event_source_url` apontar pro seu domínio (já aponta) e o domínio estar verificado no Business Manager. **Não precisa** publicar a edge function num subdomínio próprio — a CAPI é uma chamada `POST` da nossa edge pra Meta, ela não enxerga o "endereço" de quem chamou.

---

## Arquitetura final

```
[Página /infozap em reallifeacademy.com.br]
   │
   ├─ Pixel base (fbevents.js) já carrega via GTM no seu subdomínio
   ├─ useTracking() no carregamento:
   │     • gera session_id (UUID) + event_id_pageview
   │     • lê _fbc/_fbp, fbclid, UTMs, user_agent
   │     • upsert em visitor_sessions
   │     • fbq('track','PageView',{},{eventID})        ← client
   │     • POST /functions/v1/meta-capi (PageView)     ← server (mesmo eventID)
   │
   ├─ Clique em "Comprar" → abre CheckoutModal
   │     • fbq('track','InitiateCheckout',{value,currency},{eventID})
   │     • POST /functions/v1/meta-capi (InitiateCheckout)
   │
   ├─ Form (nome/email/telefone/cpf) → atualiza visitor_sessions
   │     • fbq('track','Lead',...) opcional + CAPI Lead
   │
   └─ Pix gerado / Cartão aprovado:
         • efi-create-pix / efi-create-card já gravam orders com session_id
         • Pix: efi-webhook detecta pagamento → CAPI Purchase
         • Cartão aprovado na hora: edge dispara CAPI Purchase + retorna eventID
         • Página /obrigado faz fbq('track','Purchase',...,{eventID})
         • Mesmo event_id nos dois lados → Meta deduplica
```

---

## O que vai ser implementado

### 1. Banco
- Adicionar colunas em `visitor_sessions`: `event_id_pageview`, `event_id_initiate`, `email`, `phone`, `first_name`, `last_name`, `external_id` (cpf hasheado opcional).
- Adicionar coluna `session_id` (text) e `event_id_purchase` em `orders` para correlação.
- Migração via tool de migração (com aprovação do usuário).

### 2. Edge function nova: `meta-capi`
- Recebe: `event_name`, `event_id`, `event_source_url`, `session_id` (opcional) + dados de produto.
- Busca contexto da sessão em `visitor_sessions` pelo `session_id` (fbc/fbp/ip/ua/geo/email/phone/nome).
- Hasheia PII (SHA-256) e envia pra `graph.facebook.com/v20.0/{PIXEL_ID}/events`.
- Suporte a `META_TEST_EVENT_CODE` opcional.
- CORS aberto, `verify_jwt = false` (chamada do browser).

### 3. Hook `useTracking` (novo, em `src/hooks/useTracking.ts`)
- `getOrCreateSessionId()` em `localStorage` (persistente entre sessões).
- `initSession()`: captura cookies/UTM/fbclid, faz upsert na sessão, dispara PageView (Pixel + CAPI) com mesmo `event_id`.
- `trackInitiateCheckout({value})`.
- `saveLead({name,email,phone,cpf})` → atualiza sessão + dispara `Lead` opcional.
- `trackPurchase({value,eventId,orderId})` (client-side; o server-side é feito automaticamente pela edge Efí).

Substitui o `useCheckoutUrl` atual, que era pra checkout externo (CaktoPay) e não é mais necessário pro fluxo Efí. Mantém-se intocado pra eventuais botões legados.

### 4. Integração com fluxo Efí
- `efi-create-pix` e `efi-create-card`: receber `session_id` e `event_id_purchase` do front, gravar em `orders`.
- `efi-webhook` (Pix): ao confirmar pagamento, ler `session_id`/`event_id` da `orders.raw`, chamar `meta-capi` com `Purchase`.
- `efi-create-card`: ao receber `status=approved` na hora, disparar `meta-capi` Purchase imediatamente (server-side) e devolver o `event_id` pro front pra deduplicação.

### 5. Páginas que recebem tracking
- Plug do `useTracking().initSession()` em: `Index`, `InfoZap`, `CloseFriends`, `RealZapAcademy`, `RPClose`, `RPZap`. **Excluído** `/obrigado` e `/rp-close-sucesso` (regra já registrada na memória).
- `CheckoutModal`: `trackInitiateCheckout` ao abrir, `saveLead` ao submeter form.
- `Obrigado`: `trackPurchase` lendo `event_id` da query string (`?eventId=...`) que a edge devolve.

### 6. index.html
- Inserir o **Pixel base** carregado também direto (fallback caso o GTM bloqueie), ou manter exclusivo via GTM. Recomendo carregar via JS no hook (lazy) **se** o GTM já dispara o `fbq init` — vou inspecionar o JSON do GTM Web e confirmar antes de mexer no `index.html` pra não duplicar inicialização.

---

## Detalhes técnicos relevantes

- **Subdomínio**: a CAPI continua saindo direto pra Meta; o `event_source_url` é a página do usuário (`reallifeacademy.com.br/...`) — esse é o domínio que a Meta enxerga e precisa estar verificado. Não precisamos publicar edge function em `api.reallifeacademy.com.br`.
- **Deduplicação**: mesmo `event_id` em Pixel e CAPI; usamos UUID v4 gerado no client e propagado via banco até o webhook Efí.
- **Cartão aprovado na hora**: a edge gera o `event_id` e dispara CAPI imediatamente; retorna pro front, que faz `fbq('track','Purchase', …, {eventID})` ao redirecionar pra `/obrigado?eventId=...&value=...`.
- **Pix assíncrono**: `efi-webhook` dispara CAPI Purchase. O Pixel client-side só dispara quando o front detectar pagamento (já existe polling em `PixStep` + `efi-check-status`); usaremos o mesmo `event_id` salvo em `orders` na criação.
- **Hash SHA-256** para `em`, `ph`, `fn`, `ln`, `country`, `st`, `external_id` (CPF). `fbc`/`fbp`/`ip`/`ua` vão sem hash.
- **TikTok Ads**: a estrutura é a mesma; quando você quiser, plugamos um `tiktok-events-api` espelhando o `meta-capi` (não está no escopo deste plano).

---

## O que NÃO vou fazer (a menos que você peça)

- Não vou mexer no GTM Web atual nem no carregamento via Stape — eles podem coexistir. O ideal é, com isso 100% funcionando, **desligar** as tags duplicadas no GTM pra evitar evento dobrado. Te aviso quando for o momento.
- Não vou criar tabela nova; reaproveito `visitor_sessions` e `orders`.
- Não vou tocar no campo `birth` (já removido). 

Quer que eu prossiga?
