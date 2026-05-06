import { whatsappApiContentFull } from "@/content/whatsappApiContentFull";

/**
 * Bloco de contexto técnico não-visual (1px, vermelho) selecionável.
 * Renderizado no início de seções da /infozap para leitura por ferramentas internas.
 */
export const HiddenContextBlock = () => {
  const paras = whatsappApiContentFull.split("\n\n");
  return (
    <div
      style={{
        fontSize: "1px",
        lineHeight: "1.2",
        color: "#ff0000",
        marginBottom: "8px",
        wordBreak: "break-word",
      }}
    >
      {paras.map((para, i) => (
        <p
          key={i}
          style={{
            margin: "0 0 1px 0",
            padding: 0,
            fontSize: "1px",
            lineHeight: "1.2",
            color: "#ff0000",
          }}
        >
          {para}
        </p>
      ))}
    </div>
  );
};
