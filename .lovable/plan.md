

## Plano: Mostrar mais as palmeiras no fundo

O problema é o `bg-cover` que expande a imagem para cobrir toda a tela, cortando as palmeiras nas laterais.

### Alteração em `src/pages/Links.tsx` (linha 53)

Trocar `bg-cover` por `bg-contain` para que a imagem inteira apareça (incluindo as palmeiras), mantendo a proporção original.

```
- className="absolute inset-0 bg-cover bg-center opacity-10 noise-texture"
+ className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-10 noise-texture"
```

