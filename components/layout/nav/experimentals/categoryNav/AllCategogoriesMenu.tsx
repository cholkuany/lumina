"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCategories, type NestedCategory } from "@/hooks/useCategories";

const visible = (cats: NestedCategory[] = []) =>
  cats.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

const href = (c: { slug: string }) => `/products/?category=${c.slug}`;

export default function AllCategoriesMenu() {
  const { data } = useCategories(false);

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const departments = useMemo(() => visible(data?.categories), [data?.categories]);
  const active = departments.find((d) => d.id === activeId) ?? departments[0];
  const groups = useMemo(() => visible(active?.children), [active]);

  // close on outside click and on Escape
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13px] font-bold text-white transition-colors ${open ? "border-gold bg-white/10" : "border-transparent hover:border-gold hover:bg-white/5"
          }`}
      >
        <span className="flex flex-col gap-0.75" aria-hidden="true">
          <span className="block h-0.5 w-3.5 bg-current" />
          <span className="block h-0.5 w-3.5 bg-current" />
          <span className="block h-0.5 w-3.5 bg-current" />
        </span>
        All categories
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 flex w-190 max-w-[92vw] overflow-hidden rounded-b-md border border-line bg-white shadow-[0_18px_40px_rgba(22,33,62,0.18)]">
          {departments.length === 0 || !active ? (
            <p className="w-full p-5 text-[13px] text-muted">No categories available.</p>
          ) : (
            <>
              {/* left pane: top-level categories */}
              <ul className="w-52.5 shrink-0 border-r border-line bg-paper py-2">
                {departments.map((dept) => {
                  const isActive = dept.id === active.id;
                  return (
                    <li key={dept.id}>
                      <Link
                        href={href(dept)}
                        onClick={close}
                        onMouseEnter={() => setActiveId(dept.id)}
                        onFocus={() => setActiveId(dept.id)}
                        className={`flex w-full items-center justify-between px-4 py-1.75 text-left text-[13px] transition-colors ${isActive
                          ? "bg-white font-semibold text-ink shadow-[inset_3px_0_0_0_#D8A23B]"
                          : "text-text hover:bg-white/70"
                          }`}
                      >
                        {dept.name}
                        <span className="text-muted" aria-hidden="true">›</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* right pane: child categories + their children */}
              <div className="max-h-105 flex-1 overflow-y-auto p-5">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="font-serif text-[17px] font-bold text-ink">{active.name}</h3>
                  <Link
                    href={href(active)}
                    onClick={close}
                    className="text-[12px] font-semibold text-forest hover:underline"
                  >
                    Shop all {active.name.toLowerCase()} →
                  </Link>
                </div>

                {groups.length === 0 ? (
                  <p className="text-[13px] text-muted">Browse everything in {active.name}.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-3">
                    {groups.map((group) => (
                      <div key={group.id}>
                        <Link
                          href={href(group)}
                          onClick={close}
                          className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted hover:text-gold-deep"
                        >
                          {group.name}
                        </Link>
                        <ul className="space-y-1">
                          {visible(group.children).map((item) => (
                            <li key={item.id}>
                              <Link
                                href={href(item)}
                                onClick={close}
                                className="block text-[12.5px] leading-snug text-text hover:text-gold-deep hover:underline"
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
