## Trocar nome do remetente nos emails de auth para "Real Life Academy"

O nome `gta-digital-empire` está hardcoded em `supabase/functions/auth-email-hook/index.ts` (linhas 39 e 49). Renomear o projeto Lovable não atualiza esses valores — eles foram fixados quando os templates foram criados.

### Alteração
- `SITE_NAME = "gta-digital-empire"` → `SITE_NAME = "Real Life Academy"`
- `SAMPLE_PROJECT_URL` → `https://reallifeacademy.com.br` (cosmético, só preview)

### Deploy
Redeploy do `auth-email-hook` para o novo nome aparecer no `From` e no corpo dos emails.