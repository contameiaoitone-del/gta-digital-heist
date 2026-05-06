## Cores do bloco invisível conforme background de cada seção

### 1. Atualizar o componente
`src/components/HiddenContextBlock.tsx` — aceitar prop `color` opcional (default `#080808`) para que o texto fique na cor do background da seção onde está.

### 2. Aplicar cor correta em cada uso em `src/pages/InfoZap.tsx`

| Linha | Seção | Background | Cor do bloco |
|---|---|---|---|
| 242 | Hero | `#080808` | `#080808` |
| 275 | O Problema | `#080808` | `#080808` |
| 318 | O Mecanismo | `#0f0f0f` | `#0f0f0f` |
| 355 | Por que a maioria | `#080808` | `#080808` |
| 386 | Resultados Reais | `#0f0f0f` | `#0f0f0f` |
| 518 | O Que Você Aprende | `#080808` | `#080808` |
| 579 | Bônus Exclusivos | `#0f0f0f` | `#0f0f0f` |
| 605 | O Valor Real | `#080808` | `#080808` |
| 692 | A única pergunta | `#0f0f0f` | `#0f0f0f` |
| 706 | Dúvidas (FAQ) | `#080808` | `#080808` |

Para os blocos em background `#0f0f0f`, passar `<HiddenContextBlock color="#0f0f0f" />`. Os demais ficam sem prop (usam o default `#080808`).

### Arquivos
- `src/components/HiddenContextBlock.tsx` — adicionar prop `color`.
- `src/pages/InfoZap.tsx` — passar `color="#0f0f0f"` em 4 das 10 instâncias (linhas 318, 386, 579, 692).