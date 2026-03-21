

## Adicionar carrossel de capas dos módulos na seção "O que você aprende"

### Contexto
A seção de módulos (linha 374-406 do InfoZap.tsx) atualmente só tem o accordion com os módulos. O usuário quer adicionar um carrossel de capas estilo GTA (como na imagem de referência image-93.png) acima do accordion.

### Alterações

**1. Copiar as 5 imagens de capa para src/assets/**
- `image-87.png` → `src/assets/infozap-mod-1.png` (Seja Bem Vindo)
- `image-88.png` → `src/assets/infozap-mod-2.png` (Estruturando Tudo)
- `image-89.png` → `src/assets/infozap-mod-3.png` (Criando seu Produto)
- `image-90.png` → `src/assets/infozap-mod-4.png` (ZapData)
- `image-91.png` → `src/assets/infozap-mod-5.png` (Produtos e Nichos)

**2. Adicionar carrossel na seção de módulos (src/pages/InfoZap.tsx)**
- Importar as 5 capas e o componente Carousel
- Inserir um carrossel autoplay com loop entre o título e o accordion
- Cards com aspect ratio 2:3 (vertical), bordas arredondadas, sombra e hover glow (como na referência)
- Layout: 4 visíveis no desktop, 2 no tablet, 1.5 no mobile
- Expandir container de `max-w-3xl` para `max-w-5xl` para acomodar o carrossel

**3. Corrigir build error dos result images**
- Os arquivos result-8 a result-14 não existem no diretório de assets (foram copiados via exec mas não persistiram)
- Remover os imports e entradas do array `resultPrints` para result-8 a result-14, ou re-copiar os arquivos

### Resultado esperado
Seção com título → carrossel de capas GTA com autoplay → accordion de módulos, similar à imagem de referência.

