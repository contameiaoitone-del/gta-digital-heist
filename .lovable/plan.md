
## Registrar webhook Efí automaticamente + status em tempo real

Resolve o "não tem onde colocar webhook no painel da Efí" fazendo tudo via API, sem o usuário tocar em nada.

### 1. Atualizar `efi-check-status` — consultar Efí em tempo real

Hoje só lê do banco. Vou mudar para, no caso de Pix pendente, consultar `GET /v2/cob/{txid}` na Efí via mTLS. Se status = `CONCLUIDA`, marca `paid` no banco e retorna. Garante que o pagamento é detectado **mesmo que o webhook não esteja ativo** — o polling do front (a cada 4s) já basta.

### 2. Nova edge function `efi-register-webhook`

Faz `PUT /v2/webhook/{chave_pix}?ignorar=` na Efí com `{ webhookUrl: "https://.../efi-webhook" }` + header `x-skip-mtls-checking: true` (truque oficial da Efí pra webhooks que não validam mTLS de servidor — necessário porque Supabase Edge não aceita mTLS de entrada). Idempotente, pode rodar quantas vezes quiser.

### 3. Eu chamo a function `efi-register-webhook` automaticamente

Logo após o deploy, faço uma chamada `curl` à edge function `efi-register-webhook` com o tool de teste. Se voltar `ok: true`, o webhook está registrado na sua chave Pix e pronto.

### Resultado

- **Pix funciona com ou sem webhook** (real-time polling no `check-status`).
- **Webhook registrado automaticamente** na sua chave Pix sem você fazer nada.
- Você não precisa mexer em nada na Efí nem rodar comando local.
