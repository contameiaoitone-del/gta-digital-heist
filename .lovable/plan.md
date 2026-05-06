## Conceder acesso admin para caiormdalcin@gmail.com

Usuário já existe em `auth.users` (id: `44cf9481-ead7-4fb9-8bd9-40093c3fed5e`).

### Ação
Inserir registro em `public.user_roles` com `role = 'admin'` para esse user_id (idempotente via `ON CONFLICT DO NOTHING`).

### SQL
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('44cf9481-ead7-4fb9-8bd9-40093c3fed5e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

Após executar, basta acessar `/admin` logado com esse email.