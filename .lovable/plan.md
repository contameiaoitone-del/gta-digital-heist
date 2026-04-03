

## Plano: Adicionar 6 novas capas de módulos ao carrossel do InfoZap

**Arquivo:** `src/pages/InfoZap.tsx`

### 1. Copiar as 6 imagens para `src/assets/`
- `ChatGPT_Image_Dec_20_2025_11_11_39_PM-2.png` → `infozap-mod-conceitos.png` (Conceitos do Digital)
- `ChatGPT_Image_Apr_2_2026_09_59_15_PM.png` → `infozap-mod-comunidade.png` (Comunidade Exclusiva no Whatsapp)
- `image-130.png` → `infozap-mod-meta1.png` (Meta Ads Parte 1)
- `image-131.png` → `infozap-mod-meta2.png` (Meta Ads Parte 2)
- `image-132.png` → `infozap-mod-meta3.png` (Meta Ads Parte 3)
- `image-133.png` → `infozap-mod-trafego.png` (Tráfego Avançado)

### 2. Atualizar imports e array `moduleCovers`
Adicionar os 6 novos imports e expandir o array de 5 para 11 itens:

```
infozapMod1 — Seja Bem Vindo
infozapModConceitos — Conceitos do Digital
infozapMod5 — Produtos e Nichos
infozapMod2 — Estruturando Tudo
infozapMod3 — Criando seu Produto
infozapModMeta1 — Meta Ads Parte 1
infozapModMeta2 — Meta Ads Parte 2
infozapModMeta3 — Meta Ads Parte 3
infozapModTrafego — Tráfego Avançado
infozapMod4 — ZapData
infozapModComunidade — Comunidade Exclusiva no Whatsapp
```

Nenhuma outra seção é alterada.

