import { memo, useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Menu,
  Search,
  User,
  ShoppingBag,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NavigationSidebar } from "@/components/navigationSidebar"
import { SearchModal } from "@/components/searchModal"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice"
import { selectCartItemCount } from "@/features/cart/cartSlice"
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice"
import { logoutThunk } from "@/features/auth/authThunks"
import { selectSearchQuery } from "@/features/search/searchSlice"

const SearchButtonLabel = memo(function SearchButtonLabel() {
  const searchQuery = useAppSelector(selectSearchQuery)

  if (!searchQuery.trim()) {
    return <span className="hidden text-sm sm:inline">Search</span>
  }

  return (
    <span className="hidden text-sm sm:inline">
      {searchQuery.length > 20 ? `${searchQuery.slice(0, 20)}...` : searchQuery}
    </span>
  )
})

function getInitials(name?: string) {
  if (!name) return "U"

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

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
  const navigate = useNavigate()
  const bookmarkCount = useAppSelector(selectBookmarkCount)
  const cartItemCount = useAppSelector(selectCartItemCount)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/my/dashboard"
  const profilePath = user?.role === "admin" ? "/admin/profile" : "/my/profile"

  const handleLogout = useCallback(() => {
    void dispatch(logoutThunk())
    navigate("/auth/login")
  }, [dispatch, navigate])

  const handleDashboard = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login")
      return
    }

    navigate(dashboardPath)
  }, [dashboardPath, isAuthenticated, navigate])

  const handleProfile = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login")
      return
    }

    navigate(profilePath)
  }, [isAuthenticated, navigate, profilePath])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-2 py-4 sm:px-6 md:px-8">
          <div className="flex flex-1 items-center gap-1 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="navigation-sidebar"
              className="relative flex cursor-pointer items-center gap-1 px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:gap-2 sm:px-3"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span className="hidden text-sm sm:inline">Menu</span>
              {bookmarkCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
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
              className="flex cursor-pointer items-center gap-1 px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:gap-2 sm:px-3"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <SearchButtonLabel />
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/"
              aria-label="Keysthetix Home"
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-clip-text text-lg font-bold tracking-tighter text-transparent animate-gradient-x sm:text-2xl sm:tracking-widest">
                KEYSTHETIX
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:px-3"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            <Link to="/cart" aria-label={`Shopping cart, ${cartItemCount} items`}>
              <Button
                variant="ghost"
                size="sm"
                className="relative cursor-pointer px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:px-3"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black"
                    aria-hidden="true"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-left transition-colors hover:bg-accent/60 focus-visible:border-[#00A9AA]/50 focus-visible:bg-accent/60 focus-visible:outline-none"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-9 w-9 border border-slate-700 bg-slate-900">
                      <AvatarFallback className="bg-[#00A9AA]/10 text-xs font-semibold text-[#00A9AA]">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden min-w-0 text-left sm:block">
                      <p className="max-w-[140px] truncate text-sm font-semibold text-foreground">
                        {user?.name ?? "User"}
                      </p>
                    </div>

                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  sideOffset={10}
                  className="w-72 overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-0 text-white shadow-xl"
                >
                  <div className="border-b border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-slate-700 bg-slate-900">
                        <AvatarFallback className="bg-[#00A9AA]/10 text-base font-bold text-[#00A9AA]">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {user?.name ?? "User"}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {user?.email ?? "account@store.local"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleProfile}
                      className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-slate-300">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Profile</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-slate-300">
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">Dashboard</p>
                      </div>
                    </button>
                    <div className="my-2 h-px bg-slate-800" />

                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-auto w-full justify-start gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 focus-visible:bg-red-500/10 focus-visible:outline-none"
                      onClick={handleLogout}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/10 text-red-400">
                        <LogOut className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Logout</p>
                      </div>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:px-3"
                onClick={() => navigate("/auth/login")}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="hidden text-xs font-semibold sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <NavigationSidebar isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  )
}
