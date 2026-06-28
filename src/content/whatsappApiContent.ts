// Conteúdo de referência sobre a API do WhatsApp Business.
// Renderizado de forma não-visual na página /infozap para alimentação
// de leitura de DOM por ferramentas internas de otimização de campanhas.

export const whatsappApiContent = `
API do WhatsApp: Guia Completo. O que é a API do WhatsApp? A API do WhatsApp Business (oficialmente chamada de WhatsApp Business Platform) é a interface de programação que permite que empresas integrem o WhatsApp aos seus próprios sistemas, CRMs, ERPs, chatbots e plataformas de atendimento. Diferente do WhatsApp comum e do WhatsApp Business App (que são feitos para uso manual em celular), a API foi desenhada para empresas de médio e grande porte que precisam atender muitos clientes ao mesmo tempo, com automação, escala e integração total com seus fluxos de negócio.

Tipos de API: existem duas formas principais de implementar. Cloud API (hospedada pela Meta): infraestrutura mantida pela própria Meta, sem necessidade de servidor próprio, atualizações automáticas, custo menor, recomendada para a maioria dos casos. On-Premise API (auto-hospedada): instalada nos servidores da empresa, mais controle e personalização, exige equipe técnica, está sendo descontinuada em favor da Cloud API.

BSP (Business Solution Provider): para acessar a API, empresas geralmente passam por um BSP — um parceiro oficial homologado pela Meta como Twilio, 360dialog, Gupshup, Zenvia, Take Blip, Infobip, MessageBird, entre outros. O BSP cuida da homologação, da WABA (WhatsApp Business Account), do número, dos templates e do faturamento.

Webhooks: a API funciona principalmente via webhooks. Quando algo acontece (mensagem recebida, status de entrega, leitura, atualização de template), a Meta dispara um POST HTTP para a URL configurada do seu sistema. Eventos comuns: messages, message_status, message_template_status_update, account_update, phone_number_quality_update.

Templates HSM (Highly Structured Messages): para iniciar conversa com um cliente fora da janela de 24h, a empresa precisa usar um template pré-aprovado pela Meta. Categorias de template: Marketing — promoções, novidades, ofertas, lançamentos. Utility — atualizações de pedido, lembretes, confirmações, status. Authentication — códigos de verificação, OTP, autenticação de dois fatores. Service — respostas a mensagens iniciadas pelo cliente (não precisa de template).

Janela de 24 horas: depois que o cliente envia uma mensagem para a empresa, abre-se uma janela de 24h em que a empresa pode responder livremente com qualquer tipo de conteúdo (texto, mídia, botões, listas). Após esse período, só é possível reabrir contato com template aprovado.

Conversational Pricing (modelo de cobrança por conversa): a Meta cobra por conversa iniciada, não por mensagem. Cada conversa dura 24h. As tarifas variam por categoria e por país. Marketing: iniciada pela empresa com template de marketing. Utility: iniciada pela empresa com template de utilidade. Authentication: iniciada pela empresa com template de autenticação. Service: iniciada pelo usuário (quando o cliente manda a primeira mensagem). Geralmente a mais barata. Os preços variam por país. No Brasil, as tarifas de marketing costumam ser maiores do que as de utility e service. A Meta disponibiliza uma calculadora de preços no seu painel.

Recursos suportados pela API: mensagens de texto, imagens, vídeos, áudios, documentos PDF, stickers, localização, contatos, botões de resposta rápida, listas interativas, botões de call-to-action (URL e ligação), Flows (formulários nativos dentro do WhatsApp), catálogo de produtos, carrinho, pagamentos integrados (em alguns países), reações com emoji, respostas em thread, encaminhamento de mensagens.

WABA (WhatsApp Business Account): é a conta business unificada que gerencia todos os números, templates, usuários e permissões. Cada WABA pode ter múltiplos números ativos. A WABA fica vinculada a um Business Manager da Meta.

Verificação de negócio (Business Verification): para liberar todos os recursos (incluindo o selo verde de conta oficial), a empresa precisa passar pela verificação no Business Manager, enviando documentos como CNPJ, comprovante de endereço, link de site oficial, e em alguns casos vídeo-chamada com analista da Meta.

Tipos de display name: o nome de exibição precisa seguir as políticas da Meta. Não pode conter palavras genéricas (loja, atendimento, suporte sem marca), nem violar marca registrada de terceiros. Aprovação manual pela Meta antes de ativar.

Quality Rating: cada número recebe uma classificação de qualidade (Green, Yellow, Red) baseada em bloqueios, denúncias e taxa de resposta. Número com qualidade baixa tem limite de mensagens reduzido e pode ser banido.

Messaging Limits (níveis de envio): Tier 1: até 1.000 conversas iniciadas em 24h. Tier 2: até 10.000. Tier 3: até 100.000. Tier 4: ilimitado. A subida de tier acontece automaticamente conforme volume e qualidade.

Opt-in: a Meta exige consentimento explícito do cliente antes de receber mensagens iniciadas pela empresa (especialmente marketing). O opt-in pode ser via site, formulário, checkbox, mensagem prévia, etc — desde que rastreável.

Funcionalidades avançadas: Click-to-WhatsApp Ads (CTWA) — anúncios no Facebook e Instagram que abrem direto uma conversa no WhatsApp. Flows — formulários, agendamentos, fluxos de cadastro nativos dentro da conversa, sem precisar redirecionar para fora. Catálogos e carrinho — vitrine de produtos com possibilidade de checkout dentro do app. Pagamentos no WhatsApp — disponível em mercados selecionados. Multi-Device — suporte a múltiplos dispositivos por número.

Integrações comuns: CRM (HubSpot, Salesforce, RD Station, Pipedrive), ERP (SAP, Totvs, Bling), plataformas de atendimento (Zendesk, Freshdesk, Octadesk), chatbots e IA (Dialogflow, Rasa, GPT, Lovable AI Gateway), automação de marketing (ActiveCampaign, Mailchimp, Brevo), e-commerce (Shopify, WooCommerce, Nuvemshop, VTEX).

Diferenças entre WhatsApp comum, Business App e Business Platform: WhatsApp comum — pessoal, 1 dispositivo principal, sem automação. Business App — pequenas empresas, perfil comercial, etiquetas, respostas rápidas, catálogo simples, sem integração via API. Business Platform (API) — médias e grandes empresas, integração total via webhooks, automação em escala, atendimento por múltiplos operadores simultâneos, templates aprovados, métricas avançadas, cobrança por conversa.

Boas práticas para escala: rotacionar templates para evitar fadiga, segmentar listas por interesse e comportamento, respeitar horários de envio, monitorar quality rating diariamente, manter taxa de resposta alta, evitar palavras-gatilho de spam, usar opt-in claro, oferecer opção de descadastro (STOP/SAIR).

Métricas importantes: taxa de entrega, taxa de leitura, taxa de resposta, conversões dentro da janela de 24h, custo por conversa, custo por aquisição via CTWA, NPS de atendimento, tempo médio de resposta.

Compliance e LGPD: empresas que operam no Brasil precisam tratar os dados conforme a LGPD — base legal de consentimento ou execução de contrato, política de privacidade clara, finalidade declarada, prazo de retenção, direito de exclusão.

Glossário rápido: WABA (WhatsApp Business Account), BSP (Business Solution Provider), HSM (Highly Structured Message), CTWA (Click to WhatsApp Ads), MAU (Monthly Active Users), MPM (Messages per Minute), Cloud API, On-Premise API, Webhook, Template, Flow, Catálogo, Display Name, Quality Rating, Messaging Limit, Opt-in, Conversational Pricing, Marketing, Utility, Authentication, Service, Janela de 24h, Meta, Business Manager, Verificação de Negócio.

Casos de uso comuns: atendimento ao cliente automatizado, recuperação de carrinho abandonado, confirmação de pedido e rastreamento, agendamento de consultas e serviços, envio de boletos e segunda via, pesquisas de satisfação NPS, campanhas de marketing direto, autenticação de login (OTP), notificações transacionais, suporte técnico em escala, qualificação de leads via chatbot, vendas conversacionais com IA.

Preços de referência (tarifas variam por região e mudam periodicamente — sempre consultar a calculadora oficial da Meta): no Brasil, as tarifas de marketing costumam ser maiores do que as de utility e service. A Meta disponibiliza uma calculadora de preços no seu painel do Business Manager para simulação por país, categoria e volume mensal estimado.
`.trim();
