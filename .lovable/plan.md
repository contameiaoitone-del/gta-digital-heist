## Login com Passkey (biometria — Face ID / digital)

Adicionar um botão com ícone de digital na tela `/membros/login` que permite ao usuário autenticar via passkey (WebAuthn) usando a biometria do dispositivo (Face ID, Touch ID, digital Android, Windows Hello). Usaremos `@simplewebauthn/browser` no frontend e `@simplewebauthn/server` em uma Edge Function.

### Fluxo do usuário

1. Usuário já cadastrado faz login normal (email + senha) uma primeira vez.
2. Em `/membros` (ou na própria tela de login após login), aparece um banner "Ativar login com biometria". Ao clicar, o navegador pede Face ID / digital e a passkey é registrada.
3. Em logins futuros: usuário digita o e-mail → clica no ícone de digital ao lado → o navegador pede biometria → login automático sem senha.

### Banco de dados (nova migração)

Tabela `webauthn_credentials`:
- `user_id` (uuid, FK auth.users)
- `credential_id` (text, único — base64url)
- `public_key` (text — base64url)
- `counter` (bigint)
- `transports` (text[])
- `device_name` (text)
- `last_used_at` (timestamptz)

Tabela `webauthn_challenges` (curta duração, ~5 min):
- `email` (text) ou `user_id` (uuid)
- `challenge` (text)
- `type` (`registration` | `authentication`)
- `expires_at` (timestamptz)

RLS: somente o próprio usuário lê/deleta suas credenciais; inserts feitos via Edge Function (service role).

### Edge Functions

Quatro funções, todas usando `@simplewebauthn/server` via npm import (`npm:@simplewebauthn/server`):

1. `webauthn-register-options` (auth obrigatório) — gera opções de registro, salva challenge.
2. `webauthn-register-verify` (auth obrigatório) — verifica resposta, persiste credencial.
3. `webauthn-auth-options` (público) — recebe `email`, busca user_id e credenciais, retorna opções de autenticação + salva challenge. Para evitar enumeração de e-mails, sempre retorna opções (com `allowCredentials` vazio se não existir).
4. `webauthn-auth-verify` (público) — verifica resposta, e se válida emite uma sessão Supabase via `auth.admin.generateLink({ type: 'magiclink' })` + troca por sessão, OU usa `signInWithIdToken` custom. Padrão escolhido: gerar magic link e devolver `action_link` que o cliente abre internamente para criar a sessão (mais simples e seguro que JWT custom).

`rpId` = host do app (ex.: `gta-digital-heist.lovable.app`). `origin` = `window.location.origin`. Configurar via env var `WEBAUTHN_RP_ID` + `WEBAUTHN_ORIGIN`.

### Frontend (`MembrosLogin.tsx`)

- Instalar `@simplewebauthn/browser`.
- Adicionar botão `<button>` com ícone `Fingerprint` (lucide) ao lado do campo de e-mail.
- Habilitado apenas se: `email` preenchido E `browserSupportsWebAuthn()` retorna true.
- Ao clicar: chama `webauthn-auth-options` → `startAuthentication()` → `webauthn-auth-verify` → cria sessão → `navigate('/membros')`.
- Tratamento de erros: "Nenhuma passkey encontrada para este e-mail. Faça login com senha e ative a biometria nas configurações."

### Registro da passkey

Adicionar componente `PasskeySetup.tsx` em `/membros` (página principal) — card "Ative login por biometria" mostrado quando o usuário ainda não tem credencial registrada. Botão chama `webauthn-register-options` → `startRegistration()` → `webauthn-register-verify`.

### Detalhes técnicos

- Biblioteca: `@simplewebauthn/browser` (cliente) e `@simplewebauthn/server` (Deno via `npm:`).
- `userVerification: 'preferred'`, `authenticatorAttachment: 'platform'` para priorizar biometria do dispositivo.
- Challenges armazenados server-side e expirados em 5 min.
- RP ID configurável por env var para funcionar tanto no preview quanto no domínio publicado.

### Fora de escopo

- Gerenciamento avançado (renomear/remover passkeys individuais) — apenas listagem básica + botão remover.
- Sincronização entre dispositivos (já é nativa via iCloud Keychain / Google Password Manager).
- 2FA combinando senha + passkey.