import { useEffect, useRef, useState } from "react";
import { Smile, Palette } from "lucide-react";

const EMOJIS = [
  "😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😍","🥰","😘","😎","🤩","🥳",
  "🤔","🤨","😐","😶","🙄","😏","😴","🤤","😪","🤐","🤯","😱","😡","🤬","🤡","💀",
  "👍","👎","👏","🙌","🙏","💪","🤝","✌️","🤞","👌","✍️","🫶","🤜","🤛","✊","👊",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💖","💗","💘","💝","💞","💟","❣️","💔",
  "🔥","⭐","🌟","✨","⚡","💥","💯","🎯","🚀","🏆","🥇","🎉","🎊","🎁","💎","👑",
  "💰","💵","💸","🤑","📈","📊","📉","💳","🪙","🧠","👁️","👀","🗣️","🦾","🤖","🛡️",
  "✅","❌","⚠️","❗","❓","✔️","➡️","⬅️","⬆️","⬇️","🔝","🔻","➕","➖","🆕","🆗",
  "📱","💻","📞","📧","🔗","📎","📌","📍","📅","🕐","⏰","⏳","🌍","🌎","🌐","🏠",
];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export function RichTextField({ value, onChange, placeholder, className = "", multiline = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [color, setColor] = useState("#ffffff");
  const colorRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const exec = (cmd: string, val?: string) => {
    ref.current?.focus();
    restoreSelection();
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const insertEmoji = (e: string) => {
    ref.current?.focus();
    restoreSelection();
    document.execCommand("insertText", false, e);
    if (ref.current) onChange(ref.current.innerHTML);
    setShowEmoji(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-1 mb-1">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); colorRef.current?.click(); }}
          className="flex items-center gap-1 px-2 py-1 rounded border border-white/15 hover:border-[#00ff88] text-xs text-gray-300"
          title="Cor do texto selecionado"
        >
          <Palette className="h-3.5 w-3.5" /> Cor
          <span className="inline-block h-3 w-3 rounded border border-white/30" style={{ background: color }} />
        </button>
        <input
          ref={colorRef}
          type="color"
          value={color}
          onChange={(e) => { setColor(e.target.value); exec("foreColor", e.target.value); }}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
        />
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowEmoji((s) => !s); }}
          className="flex items-center gap-1 px-2 py-1 rounded border border-white/15 hover:border-[#00ff88] text-xs text-gray-300"
          title="Inserir emoji"
        >
          <Smile className="h-3.5 w-3.5" /> Emoji
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.currentTarget as HTMLDivElement).innerHTML)}
        onBlur={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        data-placeholder={placeholder}
        className={`rich-editable w-full rounded bg-black/40 border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-[#00ff88] text-sm ${multiline ? "min-h-[80px]" : "min-h-[40px]"} ${className}`}
        style={{ whiteSpace: "pre-wrap" }}
      />
      {showEmoji && (
        <div className="absolute z-50 mt-1 left-0 bg-[#111] border border-white/15 rounded p-2 shadow-xl w-[280px] max-h-[220px] overflow-auto">
          <div className="grid grid-cols-8 gap-1">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onMouseDown={(ev) => { ev.preventDefault(); insertEmoji(e); }}
                className="text-lg hover:bg-white/10 rounded p-0.5"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
