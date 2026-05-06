const Privacidade = () => (
  <div className="min-h-screen px-4 py-16" style={{ backgroundColor: "#080808", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Bebas Neue', cursive" }}>Política de Privacidade</h1>
      <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
        <p>Esta Política descreve como coletamos, utilizamos e protegemos os dados dos usuários do InfoZap, em conformidade com a LGPD (Lei 13.709/2018).</p>
        <h2 className="text-xl font-bold text-white mt-6">1. Dados coletados</h2>
        <p>Coletamos nome, e-mail, telefone e dados de pagamento informados durante a compra, além de dados técnicos de navegação (cookies, IP, tipo de dispositivo).</p>
        <h2 className="text-xl font-bold text-white mt-6">2. Finalidade</h2>
        <p>Os dados são utilizados para liberar o acesso ao treinamento, prestar suporte, enviar comunicações relacionadas ao produto e mensurar o desempenho de campanhas publicitárias.</p>
        <h2 className="text-xl font-bold text-white mt-6">3. Compartilhamento</h2>
        <p>Compartilhamos dados apenas com processadores de pagamento, plataformas de e-mail e ferramentas de mensuração estritamente necessários à operação.</p>
        <h2 className="text-xl font-bold text-white mt-6">4. Direitos do titular</h2>
        <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, pelo e-mail informado em <a href="/contato" className="underline">/contato</a>.</p>
        <h2 className="text-xl font-bold text-white mt-6">5. Cookies</h2>
        <p>Utilizamos cookies para melhorar a experiência de navegação e mensurar o desempenho de campanhas. Você pode desativá-los nas configurações do seu navegador.</p>
      </div>
    </div>
  </div>
);
export default Privacidade;
