"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { departments, slugify } from "./categories";

export default function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // lock body scroll while the drawer is open, and close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 text-white md:hidden"
      >
        <span className="block h-0.5 w-4.5 bg-current" />
        <span className="block h-0.5 w-4.5 bg-current" />
        <span className="block h-0.5 w-4.5 bg-current" />
      </button>

      {open && (
        <div className="fixed inset-0 z-60 md:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} aria-hidden />

          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-90 flex-col bg-white shadow-2xl">
            {/* drawer header */}
            <div className="flex shrink-0 items-center justify-between bg-ink px-4 py-3.5">
              <span className="flex items-baseline gap-0.5 font-serif text-lg font-bold text-white">
                Lumina<span className="text-xl leading-none text-gold">.</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-xl leading-none text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* account block */}
              <div className="border-b-8 border-paper px-4 py-4">
                <a
                  href="#"
                  className="mb-3 block w-full rounded bg-gold py-2.5 text-center text-[13px] font-bold text-ink"
                >
                  Sign in
                </a>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {["Your orders", "Your cart", "Wish list", "Returns", "Track package", "Help centre"].map((l) => (
                    <a key={l} href="#" className="py-1 text-[13px] text-text hover:text-gold-deep">
                      {l}
                    </a>
                  ))}
                </div>
              </div>

              {/* nested categories accordion */}
              <div className="px-4 py-3">
                <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                  Shop by department
                </h4>
                <ul className="divide-y divide-line">
                  {departments.map((dept) => {
                    const isOpen = expanded === dept.slug;
                    return (
                      <li key={dept.slug}>
                        <button
                          type="button"
                          onClick={() => {
                            setExpanded(isOpen ? null : dept.slug);
                            setExpandedGroup(null);
                          }}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between py-3 text-left text-[14px] font-semibold text-text"
                        >
                          {dept.name}
                          <span className={`text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}>
                            ›
                          </span>
                        </button>

                        {isOpen && (
                          <ul className="pb-2 pl-3">
                            {dept.groups.map((group) => {
                              const gKey = `${dept.slug}:${group.name}`;
                              const gOpen = expandedGroup === gKey;
                              return (
                                <li key={group.name} className="border-l border-line pl-3">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedGroup(gOpen ? null : gKey)}
                                    aria-expanded={gOpen}
                                    className="flex w-full items-center justify-between py-2 text-left text-[13px] font-medium text-text"
                                  >
                                    {group.name}
                                    <span className={`text-muted transition-transform ${gOpen ? "rotate-90" : ""}`}>
                                      ›
                                    </span>
                                  </button>
                                  {gOpen && (
                                    <ul className="pb-1.5 pl-3">
                                      {group.items.map((item) => (
                                        <li key={item}>
                                          <Link
                                            href={`/${dept.slug}/${slugify(group.name)}/${slugify(item)}`}
                                            onClick={() => setOpen(false)}
                                            className="block py-1.5 text-[12.5px] text-muted hover:text-gold-deep"
                                          >
                                            {item}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                            <li className="border-l border-line pl-3">
                              <Link
                                href={`/products?category=${dept.slug}`}
                                onClick={() => setOpen(false)}
                                className="block py-2 text-[12.5px] font-semibold text-forest"
                              >
                                Shop all {dept.name.toLowerCase()} →
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t-8 border-paper px-4 py-4">
                <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">Settings</h4>
                {["Deliver to Alexandria, ON", "English — CAD $", "Sell on Lumina"].map((l) => (
                  <a key={l} href="#" className="block py-2 text-[13px] text-text hover:text-gold-deep">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
