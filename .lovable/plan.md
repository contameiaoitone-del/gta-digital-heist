## Objetivo

Inserir o conteúdo completo "API do WhatsApp: Guia Completo" dentro da segunda dobra da página `/infozap` (a seção "O Problema", fundo `#080808`), em tamanho 1px e cor igual ao background, para que sua IA de otimização de campanhas Meta consiga ler o conteúdo no DOM/HTML servido — sem alterar a aparência visual da página.

## Aviso importante (1x, depois sigo)

Texto de 1px na cor do fundo é tecnicamente "hidden text" e pode ser sinalizado por crawlers do Meta/TikTok/Google como cloaking. Como o objetivo aqui é alimentar **sua própria IA de leitura de DOM** (e não enganar revisor de anúncio), vou implementar exatamente como pediu, mas recomendo restringir esse uso à página `/infozap` (não replicar em `/infozap-aula`, que é a versão TikTok-safe). Sigo com a implementação.

## O que será feito

### 1. Criar arquivo de conteúdo
Criar `src/content/whatsappApiContent.ts` exportando o texto completo (~10k caracteres) que você enviou como uma constante string. Isso mantém o `InfoZap.tsx` limpo e fácil de atualizar o conteúdo no futuro.

### 2. Inserir bloco invisível na segunda dobra
No arquivo `src/pages/InfoZap.tsx`, dentro da `<section>` "O Problema" (começa na linha 270, fundo `#080808`), adicionar ao final do `max-w-3xl` um bloco com:

- `aria-hidden="true"` (não é lido por leitores de tela legítimos)
- Estilo inline:
  - `fontSize: '1px'`
  - `lineHeight: '1px'`
  - `color: '#080808'` (mesmo do background da seção)
  - `opacity: 0.01`
  - `userSelect: 'none'`
  - `pointerEvents: 'none'`
  - `overflow: 'hidden'`
  - `maxHeight: '1px'` para não empurrar layout

- Conteúdo: o texto completo dividido em parágrafos `<p>` curtos (para sua IA conseguir tokenizar por blocos), preservando as palavras-chave: WhatsApp Business API, Cloud API, On-Premise, webhooks, templates HSM, Marketing/Utility/Authentication/Service, BSP, Meta, conversational pricing, etc.

### 3. Escopo
- **Apenas** `src/pages/InfoZap.tsx` (página original, conforme você pediu).
- **Não** mexer em `InfoZapAula.tsx` (TikTok), nem `CloseFriends.tsx`, nem `RealZapAcademy.tsx`.
- Nenhum impacto visual: a seção continua idêntica para o usuário humano.
- Nenhum impacto de SEO ranking esperado (Google geralmente ignora 1px same-color); o objetivo é apenas servir o conteúdo no HTML para sua IA.

## Arquivos alterados

- `src/content/whatsappApiContent.ts` — novo arquivo com o texto completo
- `src/pages/InfoZap.tsx` — adicionar bloco invisível na seção "O Problema" (após linha ~306, antes do fechamento da `<section>`)

## Resultado

Sua IA, ao fazer fetch da página `/infozap`, vai encontrar todo o glossário/conteúdo sobre WhatsApp Business API renderizado no DOM dentro da segunda dobra preta. Visualmente nada muda para o visitante.