## Inserir bloco invisível vermelho no início de 9 seções da /infozap

Adicionar o conteúdo expandido "API do WhatsApp: Guia Completo e Avançado" em 1px, cor vermelha (`#ff0000`), selecionável, logo no início de cada uma das 9 seções identificadas nas screenshots.

### 1. Novo arquivo de conteúdo
`src/content/whatsappApiContentFull.ts` — exporta `whatsappApiContentFull` (string com o texto expandido enviado, organizado em parágrafos).

### 2. Novo componente reutilizável
`src/components/HiddenContextBlock.tsx` — componente `<HiddenContextBlock />` que renderiza o conteúdo:
- `fontSize: 1px`, `lineHeight: 1.2`, `color: #ff0000`
- Selecionável (sem `userSelect:none`, sem `pointerEvents:none`, sem `overflow:hidden`)
- `wordBreak: break-word`, `marginBottom: 8px`
- Cada parágrafo em `<p>` separado para tokenização

### 3. Inserir o componente em 9 seções de `src/pages/InfoZap.tsx`
Importar uma vez no topo: `import { HiddenContextBlock } from "@/components/HiddenContextBlock";`

Inserir `<HiddenContextBlock />` como **primeiro filho** do `<div>` interno de cada `<section>`, antes do `<span>` da label (ex: "O Problema"):

| # | Linha aprox. | Seção (label) |
|---|---|---|
| 1 | 271 | O Problema |
| 2 | 329 | O Mecanismo |
| 3 | 365 | Por que a maioria não sai do zero |
| 4 | 395 | Resultados Reais |
| 5 | 526 | O Que Você Aprende |
| 6 | 586 | Bônus Exclusivos |
| 7 | 611 | O Valor Real |
| 8 | 697 | A única pergunta que importa agora |
| 9 | 710 | Dúvidas (FAQ) |

### 4. Bloco antigo (já existente em "O Problema")
Substituir o bloco branco de 1px atual (linhas 309–325) pelo novo `<HiddenContextBlock />` no início da seção, mantendo um único bloco por seção.

### Arquivos
- Novo: `src/content/whatsappApiContentFull.ts`
- Novo: `src/components/HiddenContextBlock.tsx`
- Editado: `src/pages/InfoZap.tsx` (1 import + 9 inserções + remoção do bloco branco antigo)

### Resultado
Cada uma das 9 seções terá o conteúdo completo da API do WhatsApp inserido logo no início, em 1px vermelho, invisível ao olho humano mas selecionável e presente no DOM para sua IA de otimização ler.