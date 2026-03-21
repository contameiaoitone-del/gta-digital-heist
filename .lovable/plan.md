

## Remover Accordion — Módulos Sempre Expandidos

### Problema
Os módulos usam `Accordion` com funcionalidade de abrir/fechar. O usuário quer remover essa interação completamente.

### Mudança em `src/pages/InfoZap.tsx` (linhas 408-431)

Substituir o `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent` por divs estáticas que mostram o mesmo layout visual, sem nenhuma interação de clique:

```tsx
<div className="space-y-3">
  {modules.map((mod, i) => (
    <div key={i} className="border rounded-xl px-5 py-4" style={{ borderColor: "#222", backgroundColor: "#111" }}>
      <div className="flex items-center gap-4 text-left mb-3">
        <span style={{ color: GREEN, fontFamily: "'Bebas Neue', cursive", fontSize: "1.1rem" }} className="text-sm font-bold">{mod.num}</span>
        <span className="text-white font-semibold text-base">{mod.title}</span>
      </div>
      <div className="space-y-2 pb-2">
        {mod.subs.map((sub, j) => (
          <div key={j} className="flex items-center gap-2 text-gray-400 text-sm">
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: GREEN }} />
            {sub}
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
```

Também remover imports não utilizados de `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` se não forem usados em outro lugar do arquivo.

