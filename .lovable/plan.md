Remover a seção "Novidades" da página de membros (`Membros.tsx`).

## O que mudar
A seção de Novidades (linhas 218-238) renderiza os mesmos módulos já exibidos na seção "Módulos", apenas reordenados por `created_at`. Isso cria duplicação visual sem valor adicional.

## Alteração
- Apagar o bloco condicional `{modules.length > 6 && (<Row title="Novidades">...)}` do `Membros.tsx`.
- Nenhuma outra mudança no arquivo ou em outros componentes é necessária.
