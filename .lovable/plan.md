
Objetivo: fazer o card no mobile usar a imagem inteira, sem sobras internas e sem “cortar”, encostando até a borda do card.

Plano de implementação

1. Ajustar `src/pages/Links.tsx`
   - Manter a lógica de `mobileImage` para o ZapData.
   - Trocar o card com `backgroundImage` por uma estrutura com `<img />`.
   - Usar a imagem selecionada (`mobileImage` no mobile, `image` no desktop) como `src` real do `<img>`.

2. Remover a causa do espaço sobrando
   - Retirar `min-h-[200px] md:min-h-[240px]` do card com imagem.
   - Retirar `backgroundSize: 'contain'`, `backgroundPosition` e `backgroundRepeat`, porque isso cria “área de card” separada da proporção real da imagem.
   - Deixar o próprio `<img>` definir a altura natural do card.

3. Garantir que a imagem ocupe todo o card até a borda
   - Aplicar no `<img>` algo como `w-full h-auto block`.
   - Manter `rounded-lg overflow-hidden gta-card-border` no container externo.
   - Preservar o ícone de link absoluto por cima da imagem.

Resultado esperado
- No mobile, o banner do ZapData vai aparecer inteiro.
- Não vai sobrar espaço vazio dentro do card.
- A arte vai ocupar toda a área até a linha da borda.

Detalhe técnico
- Hoje o problema acontece porque o card tem altura fixa e a imagem está como fundo com `contain`.
- `contain` preserva a imagem inteira, mas deixa espaço vazio quando a proporção da imagem não bate com a do container.
- Com `<img className="w-full h-auto block" />`, a altura passa a acompanhar a proporção real da imagem, então a borda “abraça” a arte sem sobras.
