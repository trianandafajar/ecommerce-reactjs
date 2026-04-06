import { useEffect, useCallback } from "react"
import { X, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      id="navigation-sidebar"
    >
      {/* Sidebar panel */}
      <div className="w-80 bg-background h-full shadow-2xl shadow-primary/20 animate-in slide-in-from-left duration-500 ease-out z-50 border-r border-border flex flex-col">
        <div className="p-6 h-full overflow-y-auto flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              onClick={onClose}
              className="text-2xl font-bold tracking-wider text-foreground hover:opacity-80 transition-opacity"
            >
              Keysthetix
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex items-center gap-2 text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">Close</span>
            </Button>
          </div>

          {/* Bookmarks shortcut */}
          <div className="mb-6 pb-6 border-b border-border">
            <Link to="/bookmarks" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-muted cursor-pointer relative"
              >
                <Heart className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>My Favorites</span>
                {bookmarkCount > 0 && (
                  <span
                    className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    aria-label={`${bookmarkCount} saved items`}
                  >
                    {bookmarkCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <nav aria-label="Main categories" className="flex-1">
            <ul className="space-y-1 list-none p-0 m-0">
              {MENU_ITEMS.map((item) => (
                <li key={item.category}>
                  <Link
                    to={`/?category=${item.category}#popular`}
                    onClick={onClose}
                    className="block w-full text-left text-foreground hover:text-primary hover:bg-muted px-3 py-2 rounded-lg transition-all duration-200 text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <Link
              to="/contact"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Can we help you?
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  )
}