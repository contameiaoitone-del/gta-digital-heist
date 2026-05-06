import { whatsappApiContentFull } from "@/content/whatsappApiContentFull";

interface HiddenContextBlockProps {
  /** Cor do texto — deve combinar com o background da seção. Default: #080808 */
  color?: string;
}

/**
 * Bloco de contexto técnico não-visual (1px) selecionável.
 * Renderizado no início de seções da /infozap para leitura por ferramentas internas.
 * A cor deve ser igual ao background da seção onde for inserido.
 */
export const HiddenContextBlock = ({ color = "#080808" }: HiddenContextBlockProps) => {
  const paras = whatsappApiContentFull.split("\n\n");
  return (
    <div
      style={{
        fontSize: "1px",
        lineHeight: "1.2",
        color,
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
            color,
          }}
        >
          {para}
        </p>
      ))}
    </div>
  );
};
