"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { collectionCopy, collectionHref, printableCollections } from "@/lib/printable-collections";

export default function FreePrintablesMenu({ locale, mobile = false, onNavigate }: { locale: string; mobile?: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  const copy = collectionCopy(locale);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return <div className="relative" ref={root}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={event => {
      if (event.key === "Escape" && open) {
        event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus();
      }
    }}>
    <button ref={trigger} id={`${id}-trigger`} type="button" aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(!open)} className="flex items-center gap-1 text-left hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-4">
      {copy.title}<ChevronDown size={15} aria-hidden="true" />
    </button>
    <ul id={id} aria-labelledby={`${id}-trigger`} hidden={!open}
      className={mobile ? "mt-3 space-y-1 border-l-2 border-indigo-100 pl-3" : "absolute left-0 top-full z-[70] mt-3 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"}>
      {printableCollections.map(item => <li key={item.id}>
        <a href={collectionHref(item, locale)} hrefLang={item.englishOnly ? "en" : locale}
          onClick={() => { setOpen(false); onNavigate?.(); }}
          className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-2">
          {copy[item.id]}{item.englishOnly && <span className="ml-2 text-xs">({copy.english})</span>}
        </a>
      </li>)}
    </ul>
  </div>;
}
