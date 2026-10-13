'use client'

import { CartIcon } from '../CartIcon'
import MobileDrawer from "./MobileDrawer";

import { useCategories } from '@/hooks/useCategories'
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useCartItemCount } from "@/stores/cart/cart.selectors";
import { SearchBar } from "../SearchBar";
import { UserMenu } from "../user/UserMenu";
import { Logo } from "../Logo";
import Link from "next/link";

export default function Header() {
  const { data } = useCategories(false)
  const { user, firstName, lastName } = useLoggedInUser()
  const itemCount = useCartItemCount()
  if (data) console.log(data.categories)

  return (
    <header className="bg-ink px-4 pb-3 pt-3 md:px-6 md:pb-4 md:pt-3.5">
      <div className="mx-auto max-w-350">
        {/* row 1 — on mobile: burger + logo + account + cart. on md+: everything inline */}
        <div className="flex items-center gap-3 md:gap-5">
          <MobileDrawer />

          <Logo />

          <div className="hidden whitespace-nowrap border-l border-[#37426A] pl-4 text-xs leading-tight text-[#C6CADC] lg:block">
            Deliver to
            <strong className="block text-[13px] font-semibold text-white">Alexandria, ON</strong>
          </div>

          {/* search sits inline only from md up */}
          <div className="hidden flex-1 md:flex">
            <SearchBar />
          </div>

          {/* account + cart: ALWAYS visible, compact on mobile */}
          <div className="ml-auto flex items-center gap-4 md:gap-5">
            <Link href="/account" className="hidden cursor-pointer text-xs leading-tight text-[#EDEBE1] lg:block">
              Wishlist &amp;
              <strong className="block text-[13px] font-semibold text-white">Orders</strong>
            </Link>

            <div className="md:hidden">
              <UserMenu user={user} firstName={firstName} lastName={lastName} />
            </div>
            <div className="hidden md:block">
              <UserMenu user={user} firstName={firstName} lastName={lastName} />
            </div>

            <div className="md:hidden">
              {/* <CartButton variant="compact" /> */}
              <CartIcon count={itemCount} variant="compact" />
            </div>
            <div className="hidden md:block">
              {/* <CartButton variant="full" /> */}
              <CartIcon count={itemCount} variant="full" />
            </div>
          </div>
        </div>

        {/* row 2 — full-width search on mobile only */}
        <div className="mt-3 flex overflow-hidden rounded border-2 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
