import Link from "next/link";
import AllCategoriesMenu from "./AllCategogoriesMenu";
import { departments } from "../categories";

const quickLinks = [
  { label: "Today's deals", href: "sale" },
  { label: "New arrivals", href: "new" },
  { label: "Best sellers", href: "popular" },
  { label: "Gift cards", href: "gift-cards" },
];

const chipClass =
  "whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-[13px] font-medium text-[#D8DAE6] hover:border-gold hover:bg-white/5 hover:text-white md:px-3.5";

export default function CategoryNav() {
  return (
    // `relative` + non-scrolling flex row. The menu button lives OUTSIDE the
    // scroll container so its flyout isn't clipped, while the chip strip keeps
    // overflow-x scrolling at every breakpoint.
    <nav className="bg-ink relative flex items-stretch bg-ink-soft px-4 md:px-6">
      <AllCategoriesMenu />

      <div className="scrollHiddened flex items-stretch gap-0.5 overflow-x-auto">
        {quickLinks.map((link) => (
          <Link key={link.label} href={`/products/?filter=${link.href}`} className={chipClass}>
            {link.label}
          </Link>
        ))}

        {departments.map((dept) => (
          <Link key={dept.slug} href={`/products/?category=${dept.slug}`} className={chipClass}>
            {dept.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
