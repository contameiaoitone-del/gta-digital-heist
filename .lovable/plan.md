A logo anterior estava sendo esticada (proporção quadrada com texto pequeno = caixa preta enorme com letras finas).

## Conserto
1. Substituir o arquivo `src/assets/infozap-logo.png` pela nova imagem `Design_sem_nome_43.png` (já copiada com overwrite). Essa nova logo é quadrada com fundo transparente — vai funcionar bem porque é o glyph "INFOZAP" centralizado.
2. Em `Membros.tsx`, trocar o dimensionamento da `<img>` da logo para usar **largura** ao invés de altura, garantindo que a proporção do PNG seja respeitada (`h-auto`):
   - De: `className="h-20 md:h-28 lg:h-32 w-auto mb-3 drop-shadow-2xl"`
   - Para: `className="w-[260px] md:w-[400px] lg:w-[480px] h-auto -ml-2 -mt-4 mb-1 drop-shadow-2xl select-none pointer-events-none"`
   
   O `-ml-2 -mt-4` compensa o whitespace ao redor da logo (já que o PNG é quadrado com a marca centralizada), e a largura controlada deixa a logo grande e bonita sem esticar.

## Arquivos
- `src/assets/infozap-logo.png` (substituído)
- `src/pages/membros/Membros.tsx`
