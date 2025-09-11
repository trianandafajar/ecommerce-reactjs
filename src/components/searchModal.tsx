import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setQuery,
  selectSearchQuery,
  selectSearchResults,
  selectSearchLoading,
} from "@/features/search/searchSlice";
import { fetchSearchSuggestions } from "@/features/search/searchThunks";
import { fetchProducts } from "@/features/product/productThunks";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const suggestions = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectSearchLoading);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  const limitedSuggestions = useMemo(
    () => suggestions.slice(0, 8),
    [suggestions]
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [limitedSuggestions]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (searchQuery.trim() === "") return;

    debounceRef.current = window.setTimeout(() => {
      dispatch(fetchSearchSuggestions({ query: searchQuery, limit: 8 }));
      debounceRef.current = null;
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchQuery, dispatch]);

  const runMainSearchAndClose = useCallback(
    (q: string) => {
      dispatch(
        fetchProducts({
          page: 1,
          per_page: 12,
          ...(q.trim() ? { search: q } : {}),
        })
      );
      onClose();
    },
    [dispatch, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const maxIndex = limitedSuggestions.length - 1;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
          return;

        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
          return;

        case "Home":
          e.preventDefault();
          setHighlightedIndex(0);
          return;

        case "End":
          e.preventDefault();
          setHighlightedIndex(maxIndex);
          return;

        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex <= maxIndex) {
            const chosen = limitedSuggestions[highlightedIndex];
            if (chosen) {
              dispatch(setQuery(chosen));
              runMainSearchAndClose(chosen);
              return;
            }
          }
          runMainSearchAndClose(searchQuery);
          return;

        case "Escape":
          onClose();
          return;

        default:
          return;
      }
    },
    [
      highlightedIndex,
      limitedSuggestions,
      dispatch,
      runMainSearchAndClose,
      searchQuery,
      onClose,
    ]
  );

  const handleClickSuggestion = useCallback(
    (index: number) => {
      const chosen = limitedSuggestions[index];
      if (!chosen) return;
      dispatch(setQuery(chosen));
      runMainSearchAndClose(chosen);
    },
    [limitedSuggestions, dispatch, runMainSearchAndClose]
  );

  const handleBackdropMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
        runMainSearchAndClose(searchQuery);
      }
    },
    [onClose, searchQuery, runMainSearchAndClose]
  );

  const handleClearAndClose = useCallback(() => {
    dispatch(setQuery(""));
    runMainSearchAndClose("");
    onClose();
  }, [dispatch, onClose, runMainSearchAndClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center pt-20"
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-2xl mx-4 shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close
      >
        <div className="flex items-center border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 ml-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search React Market"
            className="flex-1 px-4 py-4 text-lg outline-none"
            value={searchQuery}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `search-suggestion-${highlightedIndex}`
                : undefined
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAndClose}
            className="mr-2 hover:bg-gray-100 cursor-pointer !rounded-none"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="text-sm text-gray-600 mb-4">
            {searchQuery ? `Results for "${searchQuery}"` : "Type to search"}
          </div>

          <div
            role="listbox"
            id="search-suggestions"
            className="space-y-2"
            aria-label="Search suggestions"
          >
            {loading ? (
              <div className="text-sm text-gray-500 p-2">Loading...</div>
            ) : limitedSuggestions.length > 0 ? (
              limitedSuggestions.map((item, idx) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <div
                    id={`search-suggestion-${idx}`}
                    key={item + "-" + idx}
                    role="option"
                    aria-selected={isHighlighted}
                    className={`text-sm p-2 cursor-pointer rounded transition-colors ${
                      isHighlighted ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                    onMouseDown={(e) => {
                      // use onMouseDown to avoid losing focus before click
                      e.preventDefault();
                      handleClickSuggestion(idx);
                    }}
                  >
                    {item}
                  </div>
                );
              })
            ) : (
              searchQuery && (
                <div className="text-sm text-gray-500 p-2">
                  No results found
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
