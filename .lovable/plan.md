## Plano: clonar `/infozap` em `/infozap-aula` adaptada às políticas do TikTok Ads

A página atual `src/pages/InfoZap.tsx` **não será alterada**. Vou criar uma cópia em `src/pages/InfoZapAula.tsx`, registrar a rota `/infozap-aula` em `src/App.tsx` e reescrever só os trechos que violam políticas do TikTok Ads. Identidade visual, layout, ordem das seções, módulos estáticos, vídeo Panda 9:16, modal de checkout, preço R$67, garantia 7 dias, pixel/CAPI/UTMs e `useCheckoutUrl` permanecem iguais.

Sem cloaking. A LP nova é pública para qualquer visitante; ela apenas será o destino dos anúncios do TikTok.

---

### 1. Mudanças por bloco da `InfoZap.tsx` original

**A) `enemyBlocks` (linhas ~56-62) e seção PAIN (linhas ~280-295)**
Hoje: “guru ficou rico, você ficou com a conta no vermelho”, “sangrei dinheiro”, “trabalho de escravo”, “autoconfiança destruída”, “não tenho dinheiro pra arriscar mais”, “WhatsApp trava tudo”.
Política TikTok violada: *Personal attributes / shaming* (não pode explorar fracasso financeiro pessoal, dívida, autoestima) e *Negative life events*.
Novo: 5 cards neutros sobre dificuldades de execução — falta de método claro, dificuldade em interpretar métricas, falta de processo de atendimento, dificuldade em estruturar oferta, dificuldade em organizar rotina. Sem culpa, sem dívida, sem ataque a outros profissionais (“guru”, “gestor de tráfego”).

**B) `mechanismBenefits` (linhas ~64-71) e seção MECHANISM (linhas ~310-327+)**
Hoje: “Começa com R$15 por dia”, “Zero reembolso”, “Liquidez imediata”, “Pix cai direto”, “máquina de vendas”, “De zero a R$1.000 por dia em menos de 1 mês”, “o cliente paga depois”.
Políticas TikTok violadas:
- *Unrealistic / guaranteed earnings* (proibido valor + prazo: “R$1.000/dia em 30 dias”).
- *Get-rich-quick schemes* (proibido prometer enriquecimento rápido com baixo investimento).
- *Misleading refund language* (“zero reembolso” pode ser lido como negar direito do consumidor / CDC).
Novo: Pay After Delivery descrito como **metodologia de experiência do cliente** com 6 pilares neutros — clareza da oferta, atendimento estruturado, entrega organizada, acompanhamento, leitura de métricas, melhoria contínua. Nada de cifras, prazos ou “Pix”.

**C) `statsCards` (linhas ~81-86)**
Hoje: “20-30% Taxa de conversão”, “R$0 Reembolso”, “R$500.000 Faturamento gerado pelos alunos”.
Política violada: *Earnings claims* e *Misleading statistics* — TikTok reprova números de conversão e faturamento exibidos como prova do produto.
Novo cards neutros: “+140 alunos”, “11 módulos”, “Acesso vitalício”, “Garantia de 7 dias”.

**D) `videoTestimonials` (linhas ~88-93)**
Hoje legendas: “Em 7 dias fez R$1.000”, “Primeiro mês fez R$10.000”, “20 dias … R$8.000 no Pix”, “Pix caindo em tempo real”.
Política violada: *Testimonials with specific income* + *Atypical results without disclaimer* — depoimentos não podem citar valor recebido.
Novo: manter os mesmos 4 vídeos, mas trocar a legenda para descrever **a experiência com o método** (ex.: “Sobre como aplicou o método no início”, “Sobre organizar a operação”, “Sobre o processo de aprendizado”). Adicionar disclaimer logo abaixo: *“Depoimentos representam experiências individuais. Conteúdo educacional, não garante resultados.”*

**E) `resultPrints` (linhas ~95-103) e carrossel de prints**
Hoje: 7 prints com legendas “Primeiro Pix no mesmo dia”, “Pix caindo todo dia”, “De zero a R$1k/dia”.
Política violada: *Before/after financial proof* + *Screenshots of money / bank notifications* — TikTok proíbe prints de Pix, saldo, painel de vendas como prova.
Novo: **remover o bloco inteiro de prints** na versão TikTok. Esse é o item mais sensível e não tem como reescrever sem violar.

**F) Hero (linhas ~241-263)**
Hoje H1: “Do zero ao primeiro Pix em até 7 dias vendendo infoproduto de Lowticket direto no WhatsApp”. Bullets: “Escala de WhatsApp sem bloqueio”, “Estrutura de Tráfego completa e infálivel”. CTA: “🔥 QUERO MEU ACESSO AGORA — R$67”.
Políticas violadas:
- *Income + timeframe promise* (“primeiro Pix em até 7 dias”).
- *Circumventing platform rules* (“sem bloqueio” sugere burlar regras do WhatsApp/Meta).
- *Absolute claims* (“infálivel”).
- *Excessive urgency / shouting* (caps lock + emoji de fogo).
Novo H1: “Aprenda a estruturar uma operação digital com WhatsApp, automação e tráfego pago.”
Subtítulo educacional. Bullets neutros: estrutura, automação, métricas, organização, comunidade.
CTA: “Quero acessar o treinamento — R$67” (mesmo botão, sem caps total, sem fogo).

**G) `baseModules` + `advancedModules` (linhas ~105-120) e títulos no `moduleCovers` (linhas ~31-49)**
Hoje: “Códigos de Trapaças”, “Tudo sobre Escala / WhatsApp sem bloqueio / chips / rodízio”, “Primeiros Anúncios … com R$15/dia”, “Funis Prontos pra Copiar e Colar”.
Políticas violadas:
- *Circumvention of third-party rules* (“sem bloqueio”, “rodízio de chips” lido como evasão).
- *Earnings hook* (R$15/dia atrelado a venda).
- *Deceptive practices framing* (“trapaças”).
Novos títulos:
- “Códigos de Trapaças” → “Estratégias avançadas e boas práticas”.
- “Tudo sobre Escala” → “Organização para crescimento”.
- “Primeiros Anúncios no Meta — Tráfego Pago / R$15/dia” → “Fundamentos para iniciar campanhas de tráfego pago”.
- “Funis Prontos pra Copiar e Colar” → “Modelos de funil para estudo e adaptação”.
Conteúdo das `subs` reescrito com a mesma lógica (sem “sem bloqueio”, sem cifras, sem promessa).

**H) `bonuses` + `valueStack` (linhas ~122-138)**
Hoje: ok em maior parte, mas `resolves` tem “Não saber se está lucrando”, “Medo de investir”.
Ajuste leve: manter bônus e preços R$1.379 → R$67. Remover frases de medo e troca por descrição funcional do bônus.

**I) `notForYouItems` (linhas ~140-145)**
Hoje: “Acha que vai ter resultado sem investir pelo menos R$15/dia em anúncio”, “Quer resultado em 24h”.
Política violada: *Implied earnings* + *Timeframe promise* (mesmo em negativa, reforça promessa).
Novo: itens sobre perfil de aluno — “Não está disposto a estudar e aplicar passo a passo”, “Espera resultado sem dedicar tempo”, “Não quer seguir um método estruturado”.

**J) `faqs` (linhas ~147-154)**
Reescrever:
- “Quanto preciso investir em anúncio?” — remover o trecho “R$15/dia → R$500/dia em 30 dias”. Resposta neutra: “É possível começar com orçamento baixo. Qualquer investimento é decisão do aluno e os retornos não são garantidos.”
- “E se eu não gostar?” — manter garantia de 7 dias, mas sem “risco é 100% nosso” (linguagem absoluta). Texto factual: “Garantia de 7 dias prevista por lei. Se solicitar reembolso nesse prazo, devolvemos 100% do valor.”
- “Quando recebo o acesso?” — manter, sem “Pix instantâneo, seu acesso também” (não associar Pix a velocidade de ganho; aqui é só sobre liberação de acesso, então pode ficar “Acesso liberado automaticamente após confirmação de pagamento”).
- Adicionar pergunta: **“O treinamento garante resultados?”** Resposta: “Não. É um treinamento educacional. Resultados dependem de dedicação, contexto e execução de cada aluno.”

**K) `marqueeItems` (linhas ~156-162)**
Hoje: “Pix caindo direto na conta”.
Trocar por: “Acesso vitalício”, “Mais de 140 alunos”, “Garantia de 7 dias”, “11 módulos”, “Comunidade exclusiva”.

**L) Botão `CTAButton` (linhas ~193-202)**
Trocar texto “🔥 QUERO MEU ACESSO AGORA — R$67” por “Quero acessar o treinamento — R$67”. Funcionalidade idêntica (abre o `CheckoutModal`).

**M) Garantia / linha “Risco zero”**
Onde aparecer “risco zero”, “você só perde se não tentar”, “sem perguntas”: trocar por descrição factual da garantia de 7 dias do CDC.

**N) Disclaimer global novo**
Adicionar bloco visível antes do footer:
*“Este é um treinamento educacional. Não garantimos renda, vendas ou resultados específicos. O desempenho varia conforme dedicação, contexto, investimento e execução de cada aluno. Depoimentos representam experiências individuais e não devem ser interpretados como resultado típico.”*
Atende à exigência do TikTok de *clear disclosure* em produtos relacionados a geração de renda.

**O) Páginas legais no rodapé**
TikTok exige que a LP tenha **Termos de Uso, Política de Privacidade e Contato** acessíveis. Criar:
- `src/pages/legal/Termos.tsx` → rota `/termos`
- `src/pages/legal/Privacidade.tsx` → rota `/privacidade`
- `src/pages/legal/Contato.tsx` → rota `/contato`
Conteúdo padrão simples + e-mail de contato. Linkar no rodapé da nova LP.

---

### 2. Arquivos criados/alterados

Criados:
- `src/pages/InfoZapAula.tsx` (cópia ajustada da InfoZap atual com todas as mudanças acima).
- `src/pages/legal/Termos.tsx`
- `src/pages/legal/Privacidade.tsx`
- `src/pages/legal/Contato.tsx`

Alterados:
- `src/App.tsx` — registrar 4 novas rotas.

Não tocados:
- `src/pages/InfoZap.tsx` (LP original 100% preservada).
- Qualquer outra página, hook, edge function, pixel, CAPI ou checkout.

---

### 3. Recomendações para o anúncio (não é código, mas evita reprovação em cascata)

TikTok reprova quando o criativo promete X e a LP entrega Y. Para a LP nova ser aprovada, o **anúncio também precisa** evitar: prints de Pix, “R$X por dia”, “largue o CLT”, antes/depois financeiro, “renda extra garantida”, “em 7 dias você…”, “sem bloqueio”. Use linguagem educacional batendo com a LP.

---

Aprove para eu implementar exatamente isso.