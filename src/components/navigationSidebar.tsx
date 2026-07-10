import { X, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer"
import { useAppSelector } from "@/app/hooks"
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice"

interface NavigationSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const MENU_ITEMS = [
  { label: "Custom Keyboards", category: "keyboards" },
  { label: "Switches", category: "switches" },
  { label: "Keycaps", category: "keycaps" },
  { label: "Desk Mats", category: "deskmat" },
  { label: "Tools & Lubes", category: "tools" },
  { label: "PCBs & Plates", category: "pcbs" },
  { label: "Group Buys", category: "groupbuys" },
  { label: "In-Stock Items", category: "instock" },
  { label: "Guides & Tutorials", category: "guides" },
  { label: "Contact Support", category: "support" },
]

export function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
  const bookmarkCount = useAppSelector(selectBookmarkCount)

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      direction="left"
    >
      <DrawerContent
        className="w-[20rem] border-r border-border bg-card p-0 shadow-2xl shadow-black/10 sm:max-w-[22rem]"
        aria-label="Navigation menu"
        id="navigation-sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              to="/"
              onClick={onClose}
              className="text-xl font-semibold uppercase tracking-[0.12em] text-foreground transition-opacity hover:opacity-80"
            >
              Keysthetix
            </Link>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close navigation menu"
                className="flex h-9 items-center gap-2 rounded-full px-3 text-foreground hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-medium">Close</span>
              </Button>
            </DrawerClose>
          </div>

          <div className="mb-4 border-b border-border pb-4">
            <Link to="/bookmarks" onClick={onClose}>
              <Button
                variant="ghost"
                className="relative flex h-11 w-full justify-start rounded-xl px-3 text-foreground hover:bg-muted cursor-pointer"
              >
                <Heart className="mr-2.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium">My Favorites</span>
                {bookmarkCount > 0 && (
                  <span
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    aria-label={`${bookmarkCount} saved items`}
                  >
                    {bookmarkCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <nav aria-label="Main categories" className="flex-1">
            <ul className="m-0 list-none space-y-0.5 p-0">
              {MENU_ITEMS.map((item) => (
                <li key={item.category}>
                  <Link
                    to={`/?category=${item.category}#popular`}
                    onClick={onClose}
                    className="block w-full rounded-xl px-3.5 py-2.5 text-left text-sm text-foreground transition-colors duration-200 hover:bg-muted hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 border-t border-border pt-4">
            <Link
              to="/contact"
              onClick={onClose}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Can we help you?
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
