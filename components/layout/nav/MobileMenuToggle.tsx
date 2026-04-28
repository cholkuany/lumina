import { Menu, X } from 'lucide-react'

type MobileMenuToggleProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const MobileMenuToggle = ({ open, setOpen }: MobileMenuToggleProps) => (
  <button className="lg:hidden p-2 -ml-2" onClick={() => setOpen(!open)}>
    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
  </button>
)
