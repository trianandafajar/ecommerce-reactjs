import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Menu, Search, User, ShoppingBag, LogOut, Plus, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/navigationSidebar"
import { SearchModal } from "@/components/searchModal"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice"
import { selectCartItems } from "@/features/cart/cartSlice"
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice"
import { logoutThunk } from "@/features/auth/authThunks"
import { selectSearchQuery } from "@/features/search/searchSlice"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light"
  )

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), [])
  const openMenu = useCallback(() => setIsMenuOpen(true), [])
  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const openSearch = useCallback(() => setIsSearchOpen(true), [])
  const closeSearch = useCallback(() => setIsSearchOpen(false), [])

  const dispatch = useAppDispatch()
  const bookmarkCount = useAppSelector(selectBookmarkCount)
  const cartItems = useAppSelector(selectCartItems)
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)
  const searchQuery = useAppSelector(selectSearchQuery)

  const handleUserClick = useCallback(() => {
    if (isAuthenticated) {
      dispatch(logoutThunk())
    } else {
      window.location.href = "/auth/login"
    }
  }, [isAuthenticated, dispatch])

  const searchLabel =
    searchQuery.trim()
      ? searchQuery.length > 20
        ? searchQuery.slice(0, 20) + "..."
        : searchQuery
      : "Search"

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 text-sm font-medium"
        >
          Skip to content
        </a>

        <div className="flex items-center justify-between px-2 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto h-20">
          <div className="flex-1 flex items-center gap-1 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="navigation-sidebar"
              className="flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 cursor-pointer relative"
            >
              <Menu className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm hidden sm:inline">Menu</span>
              {bookmarkCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${bookmarkCount} bookmarks`}
                >
                  {bookmarkCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openSearch}
              aria-label="Open search"
              className="flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 cursor-pointer"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm hidden sm:inline">{searchLabel}</span>
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/"
              aria-label="Keysthetix — Home"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-lg sm:text-2xl font-bold tracking-tighter sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x">
                KEYSTHETIX
              </span>
            </Link>
          </div>

          {/* Kanan */}
          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode
                ? <Sun className="w-4 h-4" aria-hidden="true" />
                : <Moon className="w-4 h-4" aria-hidden="true" />
              }
            </Button>

            <Link to="/admin/product/create" aria-label="Add new product">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>

            <Link to="/cart" aria-label={`Shopping cart, ${cartItemCount} items`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 relative"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-black dark:bg-white dark:text-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 flex items-center gap-1"
              onClick={handleUserClick}
              aria-label={isAuthenticated ? `Logout ${user?.name ?? ""}` : "Login"}
            >
              {isAuthenticated
                ? <LogOut className="w-4 h-4" aria-hidden="true" />
                : <User className="w-4 h-4" aria-hidden="true" />
              }
              <span className="text-xs hidden sm:inline">
                {isAuthenticated ? user?.name : "Login"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <NavigationSidebar isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}