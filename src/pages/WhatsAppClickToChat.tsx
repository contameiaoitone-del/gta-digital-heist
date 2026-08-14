import { useLayoutEffect } from "react";

const PHONE = "5531973504913";
const REDIRECT_MESSAGE = "Hola, vengo de TikTok, ¡estoy interesada en sesiones de fotos!";
const redirectLink = `https://wa.me/${PHONE}?text=${encodeURIComponent(REDIRECT_MESSAGE)}`;

const WhatsAppClickToChat = () => {
  useLayoutEffect(() => {
    window.location.replace(redirectLink);
  }, []);

  return null;
};

export default WhatsAppClickToChat;
