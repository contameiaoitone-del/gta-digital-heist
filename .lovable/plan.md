## Diagnóstico

O player do VTurb continua não aparecendo no preview. Verifiquei o que está acontecendo:

- A aula tem `vturb_player_id` salvo corretamente no banco (com `<vturb-smartplayer>` + `<script>` que injeta o `player.js` da Converteai).
- A página `Aula.tsx` está renderizando: o container preto (16:9) aparece na tela.
- Porém **não há nenhuma requisição** para `scripts.converteai.net` na aba network, nem o elemento `<vturb-smartplayer>` aparece no DOM final.
- Não há erros no console (sem CSP, sem Trusted Types).

Conclusão: o `<script>` interno do embed do VTurb (que faz `document.createElement("script"); s.src=".../player.js"; document.head.appendChild(s)`) **não está sendo executado** pelo nosso injector via `template.innerHTML` + `s.text = old.text`. Mesmo a correção anterior que recriava o script tag não está disparando o load do `player.js`. Sem `player.js`, o custom element `vturb-smartplayer` nunca é registrado e nunca renderiza nada — o container fica preto.

## Solução

Trocar a abordagem frágil de "extrair scripts do template e recriá-los" por algo determinístico: extrair a **URL do player.js** diretamente do embed via regex e carregar como `<script src="...">` real no `<head>`. Esse é o padrão usado pelos próprios geradores de embed do VTurb e nunca falha.

### Mudanças em `src/pages/membros/Aula.tsx`

1. Substituir o `useEffect` de injeção VTurb por:
   - `container.innerHTML = lesson.vturb_player_id` — renderiza `<vturb-smartplayer id="vid-...">` no DOM (o `<script>` inline contido aí não executa, mas tudo bem).
   - Extrair a URL do `player.js` do embed com regex (`/https:\/\/scripts\.converteai\.net\/[^"'\s]+\/player\.js/`).
   - Se o `<head>` ainda não tem um `<script>` com esse `src`, criar um `<script async src="...">` real e anexar em `document.head`. (Re-anexar quando trocar de aula é seguro: `player.js` só registra o custom element uma vez.)
   - Para o `vturb_optimization_code`: extrair as URLs dos `<link rel="preload">` / `<link rel="dns-prefetch">` e o snippet `_plt`. Inserir as `<link>` em `document.head` (criando elementos via `document.createElement('link')`) e executar o `_plt` setando `window._plt` diretamente em JS, sem depender de parser de scripts inline.

2. Manter a limpeza no retorno do `useEffect` apenas para os `<link>` injetados (não remover `player.js`, pois é global e cacheado).

3. Como fallback, se a regex não casar, manter a abordagem atual (recriar `<script>` no container) para não quebrar embeds não-padrão.

### Por que isso funciona

- `customElements.define("vturb-smartplayer", ...)` no `player.js` faz upgrade automático de qualquer `<vturb-smartplayer>` já presente no DOM no momento do registro e de qualquer um adicionado depois. Logo, basta garantir que `player.js` carregue uma vez.
- Não dependemos mais de o navegador tratar `<script>` dentro de `<template>.content` da forma esperada (que é onde nossa implementação atual está silenciosamente falhando).

## Validação

Depois da mudança:
1. Abrir `/treinamento/membros/aula/b5a37733-...` e confirmar via DevTools → Network que `scripts.converteai.net/.../player.js` é requisitado e responde 200.
2. Confirmar que `<vturb-smartplayer>` aparece no DOM com o player renderizado dentro.
3. Confirmar que o vídeo toca normalmente.

Sem mudanças em banco, RLS, edge functions, rotas ou outros componentes — só o bloco de injeção do VTurb em `Aula.tsx`.