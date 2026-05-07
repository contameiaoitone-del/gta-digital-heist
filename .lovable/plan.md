## Garantir Purchase Pixel antes do redirect pra área de membros

### Problema

Em `src/pages/Obrigado.tsx`:
- `trackPurchase` (Pixel client-side) é chamado em um `useEffect`
- `auto-login-after-payment` roda **em paralelo** e, assim que retorna o `magic_link`, executa `window.location.href = magic_link` — saindo da página antes do beacon do Pixel sair

Resultado: server-side CAPI funciona, mas o Pixel browser nem chega a disparar → Meta vê só metade dos eventos e às vezes nem deduplica direito.

### Solução

Reescrever o fluxo de `Obrigado.tsx` para garantir esta ordem:

1. **Disparar `Purchase` no Pixel imediatamente** ao montar (`fbq("track", "Purchase", ..., {eventID})`)
2. **Aguardar mínimo de 4 segundos** com contagem regressiva visível ("Redirecionando em 4… 3… 2… 1")
3. **Buscar o magic link em paralelo** (sem redirecionar ainda)
4. **Botão CTA "Acessar área de membros"** visível desde o início — usuário pode clicar antes do timer
5. **Após 4s + magic link pronto:** redireciona automaticamente
6. **Se magic link falhar:** botão fica como fallback para `/membros/login`

### Mudanças em `src/pages/Obrigado.tsx`

- Refatorar os 2 `useEffect` para coordenar Pixel + auto-login
- Adicionar state `countdown` (4 → 0)
- Adicionar state `magicLink` (string | null)
- Só fazer `window.location.href = magicLink` quando `countdown === 0 && magicLink !== null`
- Mostrar botão "Acessar área de membros" sempre (não só em failure)
  - Quando `magicLink` pronto: `<a href={magicLink}>` direto (mais confiável que navigate)
  - Quando ainda carregando: `<a href="/membros/login">` como fallback
- Texto: "Pagamento confirmado! Você será redirecionado em {countdown}s..."

### Por que 4 segundos?

- Tempo suficiente para o Pixel browser disparar o request `fbevents.js?ev=Purchase` e receber resposta
- Curto o bastante para não frustrar o usuário
- O usuário pode clicar no botão a qualquer momento e pular a espera

### Validação

1. Comprar via Pix → ao cair na `/obrigado`, ver toast/loader + countdown
2. Em `/admin/capi-log`: `Purchase` com `success=true`
3. No Meta Events Manager → Test Events: deve aparecer `Purchase` **Browser** + **Server** com mesmo `event_id` (deduplicado)
4. Após 4s redireciona pra área de membros logado