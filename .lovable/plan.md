Dois consertos:

## 1. Trocar título "INFOZAP" pela logo enviada
- Copiar `user-uploads://ChatGPT_Image_17_03_2026_22_40_05.png` → `src/assets/infozap-logo.png` (já feito).
- Em `Membros.tsx`: importar `infozap-logo.png` e substituir o `<h1>INFOZAP</h1>` por `<img src={infozapLogo} className="h-20 md:h-28 lg:h-32 w-auto mb-3" />`.

## 2. Consertar sobreposição de "Mais informações" sobre "Módulos"
O bug: a row de módulos usa `-mt-20 md:-mt-28` (margem negativa) para sobrepor o billboard, então o título "Módulos" cai por cima dos botões "Assistir / Mais informações" do hero.

Conserto: trocar `-mt-20 md:-mt-28` por `mt-6 md:mt-8` (espaço positivo abaixo do banner) — fica igual à Netflix, com a row começando logo abaixo do billboard sem sobrepor.

## Arquivos
- `src/pages/membros/Membros.tsx`
- novo: `src/assets/infozap-logo.png`
