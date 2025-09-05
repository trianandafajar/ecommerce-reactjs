import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setQuery,
  clearQuery,
  selectSearchQuery,
  selectSearchResults,
} from "@/features/search/searchSlice";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const filteredResults = useAppSelector(selectSearchResults);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl mx-4 shadow-2xl">
        <div className="flex items-center border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Search React Market"
            className="flex-1 px-4 py-4 text-lg outline-none"
            autoFocus
            value={searchQuery}
            onChange={(e) => dispatch(setQuery(e.target.value))}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              dispatch(clearQuery());
              onClose();
            }}
            className="mr-2 hover:bg-gray-100 cursor-pointer !rounded-none"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6">
          <div className="text-sm text-gray-600 mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "Popular searches"}
          </div>
          <div className="space-y-2">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => (
                <div
                  key={index}
                  className="text-sm hover:bg-gray-50 p-2 cursor-pointer rounded transition-colors"
                  onClick={() => dispatch(setQuery(item))}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No results found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
