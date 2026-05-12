## Problema

No mobile, ao tocar no botão de digital na tela de login, o iOS/Android abre o fluxo "cross-device" (QR Code) em vez do Face ID / digital local. Isso acontece porque:

1. O e-mail tem uma passkey registrada no banco, mas **não existe credencial local naquele aparelho** (foi cadastrada em outro device, ou a sincronização via iCloud/Google não trouxe a chave).
2. Quando `allowCredentials` lista IDs que o aparelho não conhece, o navegador oferece o fluxo híbrido (QR) como fallback — exatamente o que apareceu no print.

Além disso, hoje o cadastro de biometria (`PasskeySetup`) só é oferecido na área de membros desktop em forma de banner discreto, então usuários mobile raramente cadastram a passkey no próprio celular.

## Objetivo

Garantir que no mobile o usuário consiga (a) cadastrar facilmente Face ID / digital do próprio aparelho e (b) nunca caia no QR Code ao tentar entrar.

## Mudanças

### 1. `src/pages/membros/MembrosLogin.tsx` — login mais inteligente
- Detectar mobile (`useIsMobile`) + suporte a autenticador de plataforma via `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()`.
- Trocar o handler `loginWithBiometrics`:
  - Chamar `webauthn-auth-options` como hoje.
  - Se `hasCredentials` for `true` mas o aparelho **não** tiver autenticador de plataforma disponível, mostrar toast claro ("Esta sessão não tem biometria cadastrada. Entre com a senha e ative a biometria abaixo") em vez de iniciar `startAuthentication` (que dispara o QR).
  - Tentar `startAuthentication` apenas quando o aparelho tem autenticador de plataforma. Em caso de erro `NotAllowedError`/`InvalidStateError`, exibir o mesmo aviso e oferecer login por senha.
- Após login por senha bem-sucedido em mobile, redirecionar e deixar o `PasskeySetup` (ver item 3) cuidar do convite imediato.

### 2. `src/components/membros/PasskeySetup.tsx` — convite proativo no mobile
- Hoje o componente exige clique no botão "Ativar agora" e fica como banner. No mobile vamos:
  - Manter o banner também visível em mobile (já é, mas com layout flex que quebra; ajustar para coluna em telas pequenas).
  - Adicionar variante "modal" leve quando `useIsMobile()` for true e nenhum credencial existir: abrir o convite automaticamente uma vez por sessão (com botão "Agora não" que respeita o `DISMISS_KEY` por 7 dias).
  - Garantir que o cadastro use `authenticatorAttachment: "platform"` (já está em `webauthn-register-options`) e mostrar mensagem específica de Face ID / digital.

### 3. `supabase/functions/webauthn-auth-options/index.ts` — restringir transports no mobile
- Receber opcional `attachment: "platform"` no body. Quando enviado, filtrar `allowCredentials` para credenciais cuja `transports` inclui `"internal"` (passkey de plataforma) e remover as do tipo `"hybrid"` puro. Se a lista ficar vazia, retornar `hasCredentials: false` — o front então mostra o aviso para usar senha.
- O front mobile passa `attachment: "platform"` ao chamar a função; desktop continua sem o filtro.

### 4. Diagnóstico/feedback
- Adicionar uma `console.warn` única no front quando o navegador devolve `NotAllowedError` para facilitar debug futuro (sem expor ao usuário).
- Texto do botão de biometria no mobile vira ícone + label "Face ID / Digital" para deixar claro o que vai acontecer.

## Não vamos mexer

- Esquema do banco (`webauthn_credentials`, `webauthn_challenges`) permanece igual.
- Funções de `register-verify`/`auth-verify` não mudam.
- Fluxo desktop continua idêntico.

## Como o usuário vai sentir

- No primeiro login mobile com senha, aparece imediatamente o convite "Ative Face ID / digital neste aparelho" — um toque cadastra a passkey local.
- Nas próximas vezes, tocar no ícone de digital abre Face ID / digital direto, sem QR.
- Se tentar biometria em um aparelho sem passkey cadastrada, recebe instrução clara em vez do QR confuso.
