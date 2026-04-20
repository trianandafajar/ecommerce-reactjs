import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setQuery,
  selectSearchQuery,
  selectSearchResults,
  selectSearchLoading,
  clearQuery,
} from "@/features/search/searchSlice";
import { fetchSearchSuggestions } from "@/features/search/searchThunks";
import { useSearchParams, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const limitedSuggestions = useMemo(
    () => suggestions.slice(0, 8),
    [suggestions],
  );

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [limitedSuggestions]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

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
      if (q.trim()) {
        navigate(`/products?search=${encodeURIComponent(q.trim())}`);
      } else {
        navigate('/products');
      }
      onClose();
    },
    [navigate, onClose],
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
    ],
  );

  const handleClickSuggestion = useCallback(
    (index: number) => {
      const chosen = limitedSuggestions[index];
      if (!chosen) return;
      dispatch(setQuery(chosen));
      runMainSearchAndClose(chosen);
    },
    [limitedSuggestions, dispatch, runMainSearchAndClose],
  );

  const handleBackdropMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
        runMainSearchAndClose(searchQuery);
      }
    },
    [onClose, searchQuery, runMainSearchAndClose],
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(clearQuery());
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-start justify-center pt-24 animate-in fade-in duration-300"
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-card w-full max-w-3xl mx-4 rounded-2xl border border-border shadow-2xl shadow-primary/10 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border bg-background">
          <Search className="w-6 h-6 text-primary ml-6" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search  Keysthetix..."
            className="flex-1 px-6 py-6 text-xl bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
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
          {searchQuery.trim() !== "" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="mr-3 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-10 w-10 p-0 flex items-center justify-center transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <div className="p-4 bg-card">
          <div className="text-sm font-medium text-muted-foreground mb-3 px-2">
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
                    className={`text-base p-4 cursor-pointer rounded-xl transition-all duration-200 flex items-center gap-3 ${isHighlighted
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted text-foreground border border-transparent"
                      }`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleClickSuggestion(idx);
                    }}
                  >
                    <Search
                      className={`w-4 h-4 ${isHighlighted ? "text-primary" : "text-muted-foreground"}`}
                    />
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
