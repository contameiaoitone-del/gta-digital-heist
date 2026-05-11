import { useState } from "react";

interface SmartThumbProps {
  sources: (string | null | undefined)[];
  alt: string;
  className?: string;
}

const SmartThumb = ({ sources, alt, className }: SmartThumbProps) => {
  const candidates = sources.filter((s): s is string => !!s);
  const [idx, setIdx] = useState(0);
  if (candidates.length === 0 || idx >= candidates.length) return null;
  return (
    <img
      src={candidates[idx]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
    />
  );
};

export default SmartThumb;