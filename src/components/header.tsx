import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigationSidebar";
import { SearchModal } from "@/components/searchModal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice";
import { selectCartItems } from "@/features/cart/cartSlice";
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice";
import { logoutThunk } from "@/features/auth/authThunks";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dispatch = useAppDispatch();

  const bookmarkCount = useAppSelector(selectBookmarkCount);
  const cartItems = useAppSelector(selectCartItems);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleUserClick = () => {
    if (isAuthenticated) {
      dispatch(logoutThunk());
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-2 sm:px-4 py-3 max-w-full">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-1 sm:gap-2 text-black hover:bg-gray-50 px-2 sm:px-3 cursor-pointer relative"
            >
              <Menu className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Menu</span>
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 sm:gap-2 text-black hover:bg-gray-50 px-2 sm:px-3 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Search</span>
            </Button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-black">
                REACT MARKET
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-black cursor-pointer hover:bg-gray-50 px-2 sm:px-3 relative"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-black cursor-pointer hover:bg-gray-50 px-2 sm:px-3 flex items-center gap-1"
              onClick={handleUserClick}
              title={isAuthenticated ? `Logout (${user?.username})` : "Login"}
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">
                {isAuthenticated ? user?.username : "Login"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NavigationSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
