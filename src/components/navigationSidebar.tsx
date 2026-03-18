import { X, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice";

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
  const bookmarkCount = useAppSelector(selectBookmarkCount);

  const menuItems = [
    "Custom Keyboards",
    "Switches",
    "Keycaps",
    "Desk Mats",
    "Tools & Lubes",
    "PCBs & Plates",
    "Group Buys",
    "In-Stock Items",
    "Guides & Tutorials",
    "Contact Support",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-80 bg-background h-full shadow-2xl shadow-primary/20 animate-in slide-in-from-left duration-500 ease-out z-50 border-r border-border">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-wider text-foreground">Neo Keys</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 text-foreground hover:bg-muted cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Close</span>
            </Button>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-100">
            <Link to="/bookmarks" onClick={onClose}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-gray-50 cursor-pointer relative"
              >
                <Heart className="w-4 h-4 mr-3" />
                <span>My Favorites</span>
                {bookmarkCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {bookmarkCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          <nav className="space-y-6">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button className="text-left text-foreground hover:text-gray-600 transition-colors text-base cursor-pointer">
                  {item}
                </button>
              </div>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <button className="text-left text-foreground hover:text-gray-600 transition-colors text-sm">
              Can we help you?
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 z-40" onClick={onClose} />
    </div>
  );
}
