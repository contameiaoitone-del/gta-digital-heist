// Conteúdo de referência completo (versão expandida) sobre a API do WhatsApp Business.
// Renderizado de forma não-visual (1px, vermelho) na página /infozap para alimentação
// de leitura de DOM por ferramentas internas de otimização de campanhas.

export const whatsappApiContentFull = `
API do WhatsApp: Guia Completo e Avançado.

O que é a API do WhatsApp? A API do WhatsApp Business (oficialmente chamada de WhatsApp Business Platform) é uma solução desenvolvida pela Meta para permitir que empresas integrem o WhatsApp diretamente aos seus sistemas internos, CRMs, plataformas de automação, ERPs, chatbots e centrais de atendimento. Diferente do aplicativo WhatsApp Business convencional — focado em pequenos negócios e usado em um celular — a API funciona de forma totalmente programática. Não existe interface oficial de conversa fornecida pela Meta: toda a experiência é construída pela empresa ou por provedores especializados. A API foi criada para resolver um problema central: o WhatsApp tradicional não escala para operações empresariais complexas. Empresas que precisam atender milhares de clientes, automatizar mensagens, integrar múltiplos atendentes, monitorar métricas, manter histórico de conversas ou criar fluxos inteligentes precisam utilizar a API oficial.

Evolução da Plataforma. 2018 — Lançamento da WhatsApp Business API. A primeira versão da API foi lançada em 2018 e funcionava exclusivamente no modelo On-Premise. Nesse modelo a empresa precisava manter servidores próprios, instalar o cliente da API do WhatsApp, atualizar manualmente o sistema, gerenciar redundância, monitorar disponibilidade e lidar com alta complexidade operacional. Isso tornava a adoção cara e limitada principalmente a grandes empresas. 2022 — Lançamento da Cloud API. Em maio de 2022, a Meta lançou a Cloud API, mudando completamente a arquitetura da plataforma. Agora os servidores ficam hospedados na infraestrutura da própria Meta, não há necessidade de infraestrutura local, atualizações são automáticas, a escalabilidade é praticamente instantânea e qualquer empresa pode integrar diretamente via HTTP. Essa mudança democratizou o acesso à API. Hoje, praticamente todo novo projeto utiliza Cloud API.

Por que o WhatsApp se tornou o principal canal de negócios? O WhatsApp possui mais de 2 bilhões de usuários ativos em mais de 180 países. No Brasil ele se tornou praticamente uma infraestrutura social: suporte, vendas, cobrança, relacionamento, pós-venda, logística, autenticação, marketing e atendimento acontecem dentro do aplicativo. Em muitos segmentos, o WhatsApp substituiu email, telefone, SMS, formulários e até aplicativos próprios.

Principais Benefícios da API. 1. Escalabilidade: a empresa pode enviar milhares ou milhões de mensagens, operar múltiplos atendentes simultaneamente, automatizar fluxos. 2. Automação Inteligente: chatbots, IA conversacional, respostas automáticas, fluxos condicionais, recuperação de carrinho, OTP, confirmação de pedido, aviso de entrega. 3. Integrações: Salesforce, HubSpot, RD Station, Zendesk, Freshdesk, Pipedrive, Shopify, WooCommerce, ERPs, bancos de dados, IA. 4. Atendimento Multiusuário: vários operadores, filas, departamentos, roteamento inteligente. 5. Monitoramento e Métricas: entregas, leituras, falhas, taxas de resposta, qualidade do número, engajamento, bloqueios.

Conceitos Fundamentais. Meta Business Manager: criar Business Manager, verificar empresa, criar App, vincular WhatsApp Business Account (WABA), configurar números, gerar tokens, configurar webhooks. WABA — WhatsApp Business Account: entidade empresarial dentro da Meta que agrupa números, templates, métricas, permissões, usuários e billing. Verificação de Empresa: a Meta exige CNPJ, razão social, site, email corporativo e documentos legais. Sem verificação há limitações: menor volume, menos números, restrições de templates.

Número de Telefone: cada número API é exclusivo, não pode funcionar simultaneamente no app convencional, validação via SMS, chamada ou BSP. Display Name: deve representar a empresa real, sem spam, emojis excessivos, slogans agressivos ou palavras enganosas. Qualidade do Número: monitorada continuamente — High, Medium, Low. Se cair, o limite reduz e templates podem ser pausados. Limites de Mensagens (Messaging Tiers): 250/dia, 1.000/dia, 10.000/dia, 100.000/dia, ilimitado. Aumento automático conforme qualidade, reputação, volume saudável e engajamento.

Cloud API vs On-Premise. On-Premise (Legado): infraestrutura própria, Docker/Linux, alta complexidade, custo elevado, descontinuada. Cloud API: padrão oficial — hospedagem Meta, escalabilidade automática, menor latência, atualizações automáticas, setup simplificado.

Arquitetura Técnica. REST API via HTTP. Exemplo: POST https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages com Authorization Bearer TOKEN. Payload JSON com messaging_product whatsapp, to, type text e body. Webhooks: a Meta envia eventos em tempo real — mensagens recebidas, entregas, leituras, cliques, interações, mudanças de status. A aplicação precisa expor endpoint HTTPS público. Eventos: message, message_status, template_status_update, reaction, interactive_reply.

Tipos de Mensagens. Texto, Imagem (caption, URL), Vídeo (onboarding, marketing, suporte), Documento (PDFs, contratos, boletos, notas fiscais), Áudio (MP3, OGG, voice messages), Localização (delivery, logística, lojas físicas), Contatos, Reações.

Mensagens Interativas. Reply Buttons: até 3 botões rápidos, melhora conversão. List Messages: menus organizados, SAC, URA, departamentos. CTA Buttons: abrem links, fazem ligação ou direcionam ações.

Fluxos Conversacionais. State machines, automação condicional, IA, NLP, agentes híbridos. Fluxo: entrada do lead, qualificação, coleta de dados, encaminhamento, conversão, pós-venda. Chatbots e IA: GPT, agentes RAG, IA contextual, assistentes de vendas, suporte automático. Integrações com OpenAI, Claude, Gemini, Llama e modelos próprios.

Templates (HSM). Mensagens previamente aprovadas pela Meta, necessárias fora da janela de 24h. Categorias: Marketing (promoções, mais caro), Utility (operacional/transacional), Authentication (OTP). Estrutura: Header, Body, Footer, Buttons. Variáveis {{1}} {{2}}. Exemplo: "Olá {{1}}, seu pedido {{2}} foi enviado." Aprovação: a Meta analisa linguagem, intenção, compliance, clareza, risco de spam. Rejeições comuns: promessas exageradas, clickbait, linguagem enganosa, excesso de caixa alta, conteúdo financeiro duvidoso, spam.

Janela de 24 Horas. Quando o usuário envia mensagem abre-se sessão de 24h. Dentro dela: respostas livres, sem templates obrigatórios. Fora dela: apenas templates aprovados.

Conversas e Cobrança. A Meta cobra por conversa, não por mensagem. Service (usuário inicia, mais barata), Marketing (empresa inicia com template promocional, mais cara), Utility (operacional), Authentication (OTP). Estratégias de Redução: otimizar abertura, reutilização da janela, automações inteligentes, segmentação.

Segurança. HTTPS, OAuth, criptografia, autenticação forte. WhatsApp continua com criptografia ponta a ponta nas mensagens. LGPD e Compliance: obter consentimento, permitir opt-out, armazenar dados corretamente. Exemplo opt-out: "Responda SAIR para não receber mais mensagens."

Riscos e Banimentos. A Meta pode limitar números, bloquear templates, suspender WABAs. Causas: spam, altas taxas de bloqueio, compra de listas, envio não solicitado.

Boas Práticas. Faça: opt-in, segmente, personalize, responda rápido, mantenha qualidade. Evite: disparos massivos frios, spam, listas compradas, automação abusiva.

Casos de Uso Reais. E-commerce: recuperação de carrinho, confirmação de pedido, rastreio. SaaS: onboarding, suporte, renovação, cobrança. Clínicas: lembretes, agendamento, confirmação. Bancos: OTP, antifraude, notificações.

BSPs (Business Solution Providers). Twilio, 360dialog, Infobip, Gupshup, Zenvia, Take Blip. Oferecem dashboards, suporte, automação, gerenciamento. Direto com Meta: menor custo, controle total, mais complexidade técnica. BSP: facilidade, suporte, ferramentas prontas, custo adicional, dependência do fornecedor.

Escalabilidade Empresarial. Filas, microserviços, Kafka/RabbitMQ, workers, retry queues, processamento assíncrono. Arquiteturas: Kubernetes, Docker, Redis, event-driven. Monitoramento: taxa de entrega, latência, falhas, bloqueios, qualidade. Ferramentas: Grafana, Prometheus, Datadog.

Futuro da Plataforma. IA integrada, pagamentos, catálogos, flows, commerce, automação nativa. WhatsApp Flows: experiências interativas completas dentro do app — formulários, cadastro, agendamento, seleção de produtos, onboarding sem sair da conversa. Catálogo e Commerce: cadastrar produtos, vitrines, integrar pagamentos, experiências de compra.

Conclusão. A API do WhatsApp Business se tornou uma das infraestruturas mais importantes da comunicação moderna. Hoje representa atendimento, vendas, automação, suporte, marketing, autenticação, relacionamento e operação empresarial em escala global. Empresas que dominam automação, experiência conversacional, integração, IA, compliance e boas práticas transformam o WhatsApp em um dos canais mais poderosos de crescimento e retenção do mercado digital moderno.
`.trim();
