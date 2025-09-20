"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Brain, Check, X } from "lucide-react";
import { getDocumentTitle } from "@/lib/format-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useDiscoveryModal } from "@/contexts/DiscoveryModalContext";
import { useDiscoverySearch } from "@/hooks/useDiscoverySearch";
import { useDebounce } from "@/hooks/use-debounce";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  findMatchingDocuments,
  findMatchingDocumentsSync,
  getDocumentsByCountry
} from "@/lib/document-library";
import { SearchInput } from "./SearchInput";
import { NoResults } from "./NoResults";
import { ResultCardSkeleton } from "./ResultCardSkeleton";
const ResultsGrid = React.lazy(
  () => import("./ResultsGrid").then((module) => ({ default: module.ResultsGrid }))
);
export default function DocumentDiscoveryModal() {
  const { t } = useTranslation("common");
  const params = useParams();
  const locale = params.locale || "en";
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const scrollContainerRef = useRef(null);
  const {
    showDiscoveryModal,
    setShowDiscoveryModal,
    discoveryInput,
    setDiscoveryInput
  } = useDiscoveryModal();
  const {
    results: firestoreResults,
    loading: isSearching,
    searchFirestore,
    resetMetrics
  } = useDiscoverySearch();
  const [searchInput, setSearchInput] = useState("");
  const [suggestion] = useState("");
  const [localResults, setLocalResults] = useState([]);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState(false);
  const [activeQuery, setActiveQuery] = useState("");
  const [remoteQuery, setRemoteQuery] = useState("");
  const latestQueryRef = useRef("");
  const localCacheRef = useRef(/* @__PURE__ */ new Map());
  const debouncedSearchInput = useDebounce(searchInput, 300);
  const clearResults = useCallback(() => {
    resetMetrics();
    setSearchInput("");
    setLocalResults([]);
    setIsUsingLocalFallback(false);
    setActiveQuery("");
    latestQueryRef.current = "";
    setRemoteQuery("");
  }, [resetMetrics]);
  const performSearch = useCallback(
    async (rawQuery) => {
      const query = rawQuery.trim();
      if (!query) {
        return;
      }
      latestQueryRef.current = query;
      setActiveQuery(query);
      setRemoteQuery("");
      try {
        await getDocumentsByCountry("us");
      } catch (_error) {
      }
      const cachedResults = localCacheRef.current.get(query);
      let convertedResults = cachedResults ?? null;
      if (!cachedResults) {
        let localDocs = [];
        try {
          localDocs = await findMatchingDocuments(query, locale);
        } catch (_error) {
          localDocs = findMatchingDocumentsSync(query, locale);
        }
        if (latestQueryRef.current !== query) {
          return;
        }
        convertedResults = localDocs.slice(0, 10).map((doc, index) => {
          const translation = doc.translations?.[locale] ?? doc.translations?.en;
          const description = translation?.description || doc.description || `Legal document for ${doc.category?.toLowerCase() ?? "general"} matters`;
          return {
            id: doc.id,
            title: getDocumentTitle(doc, locale),
            description,
            confidence: Math.max(0.9 - index * 0.1, 0.1),
            reason: "keyword",
            category: doc.category,
            tags: translation?.aliases?.length ? [...translation.aliases] : doc.translations?.en?.aliases ?? doc.aliases ?? []
          };
        });
        localCacheRef.current.set(query, convertedResults);
      }
      if (convertedResults && latestQueryRef.current === query) {
        setLocalResults(convertedResults);
        setIsUsingLocalFallback(convertedResults.length > 0);
      }
      searchFirestore(query).then(() => {
        if (latestQueryRef.current === query) {
          setRemoteQuery(query);
        }
      }).catch(() => {
      });
    },
    [locale, searchFirestore]
  );
  const results = useMemo(() => {
    if (!activeQuery) {
      return [];
    }
    const hasRemoteForActive = remoteQuery === activeQuery && firestoreResults.length > 0;
    if (hasRemoteForActive && !isUsingLocalFallback) {
      return firestoreResults;
    }
    if (isUsingLocalFallback && localResults.length > 0) {
      return localResults;
    }
    return hasRemoteForActive ? firestoreResults : localResults;
  }, [activeQuery, firestoreResults, isUsingLocalFallback, localResults, remoteQuery]);
  const {
    isListening,
    isSupported: isVoiceSupported,
    startListening,
    transcript
  } = useSpeechRecognition({
    locale,
    onResult: (text) => {
      setSearchInput(text);
      setDiscoveryInput(text);
      performSearch(text);
    }
  });
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!activeQuery || remoteQuery !== activeQuery) {
      return;
    }
    if (firestoreResults.length > 0) {
      setIsUsingLocalFallback(false);
    }
  }, [activeQuery, firestoreResults, remoteQuery]);
  useEffect(() => {
    if (debouncedSearchInput.trim()) {
      performSearch(debouncedSearchInput);
    } else if (debouncedSearchInput === "") {
      clearResults();
    }
  }, [debouncedSearchInput, performSearch, clearResults]);
  useEffect(() => {
    if (discoveryInput && discoveryInput !== searchInput) {
      setSearchInput(discoveryInput);
    }
  }, [discoveryInput, searchInput]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showDiscoveryModal) {
        handleClose();
      }
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === "S") {
        e.preventDefault();
        if (showDiscoveryModal && isVoiceSupported) {
          startListening();
        }
      }
    };
    if (showDiscoveryModal) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [showDiscoveryModal, isVoiceSupported, startListening]);
  useEffect(() => {
    if (showDiscoveryModal) {
      const mainContent = document.querySelector("main");
      const headerContent = document.querySelector("header");
      const footerContent = document.querySelector("footer");
      const bodyContent = document.querySelector("body > div:not([data-radix-portal])");
      [mainContent, headerContent, footerContent, bodyContent].forEach((element) => {
        if (element && !element.contains(document.activeElement)) {
          element.setAttribute("aria-hidden", "true");
        }
      });
      return () => {
        [mainContent, headerContent, footerContent, bodyContent].forEach((element) => {
          if (element) {
            element.removeAttribute("aria-hidden");
          }
        });
      };
    }
  }, [showDiscoveryModal]);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const checkOverflow = () => {
        setIsOverflowing(container.scrollHeight > container.clientHeight);
      };
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
    }
  }, [results]);
  const handleDocumentClick = (docId) => {
    setShowDiscoveryModal(false);
    clearResults();
    setDiscoveryInput("");
  };
  const handleClose = () => {
    setShowDiscoveryModal(false);
    clearResults();
    setDiscoveryInput("");
  };
  if (!isHydrated) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Dialog, { open: showDiscoveryModal, onOpenChange: setShowDiscoveryModal }, /* @__PURE__ */ React.createElement(
    DialogContent,
    {
      className: "max-w-6xl h-[95vh] flex flex-col p-0 border-0 shadow-2xl bg-white dark:bg-gray-900 [&>button:last-child]:hidden"
    },
    /* @__PURE__ */ React.createElement(DialogHeader, { className: "sr-only" }, /* @__PURE__ */ React.createElement(DialogTitle, null, "Smart Document Finder")),
    /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden rounded-t-lg header-gradient" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-2 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" }), /* @__PURE__ */ React.createElement("div", { className: "relative px-5 py-4 pb-5" }, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold text-white flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30" }, /* @__PURE__ */ React.createElement(Brain, { className: "h-8 w-8 text-white drop-shadow-lg", style: { color: "#E7FFF9", strokeWidth: "2px" } })), /* @__PURE__ */ React.createElement("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block" }, "Smart Document Finder"))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleClose,
        className: "absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
        "aria-label": "Close modal"
      },
      /* @__PURE__ */ React.createElement(X, { className: "h-5 w-5 text-white", style: { color: "#E7FFF9", strokeWidth: "2px" } })
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-800/50 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex-shrink-0 px-6 py-4 pb-3 sticky top-0 bg-gray-50/50 dark:bg-gray-800/50 z-10 border-b border-gray-200 dark:border-gray-700" }, /* @__PURE__ */ React.createElement(
      SearchInput,
      {
        value: searchInput,
        onChange: (value) => {
          setSearchInput(value);
          setDiscoveryInput(value);
        },
        onVoiceToggle: startListening,
        isListening,
        isVoiceSupported,
        showHelpText: results.length === 0
      }
    ), isListening && /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "bg-red-50 dark:bg-red-950/50 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 w-8 bg-red-500 rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "h-3 w-3 bg-white rounded-full animate-pulse" })), /* @__PURE__ */ React.createElement("div", { className: "absolute -inset-1 bg-red-500 rounded-full animate-ping opacity-25" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-red-700 dark:text-red-300" }, "\u{1F3A4} Listening... Speak now"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-600 dark:text-red-400 mt-1" }, 'Say something like "I need a vehicle bill of sale"')))))), transcript && !isListening && /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-50 dark:bg-emerald-950/50 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-700" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ React.createElement(Check, { className: "h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1" }, "Voice captured:"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-900 dark:text-gray-100 font-medium mb-2 italic" }, '"', transcript, '"'), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setSearchInput(transcript);
          performSearch(transcript);
        },
        className: "text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
      },
      "\u2713 Use this"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: startListening,
        className: "text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      },
      "\u{1F3A4} Try again"
    )))))))), /* @__PURE__ */ React.createElement(
      "div",
      {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        className: "sr-only"
      },
      isSearching ? "Searching for legal documents..." : results.length > 0 ? `Found ${results.length} matching legal ${results.length === 1 ? "document" : "documents"}. Use arrow keys to navigate through results.` : searchInput ? "No matching documents found. Try different keywords or browse categories." : ""
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: scrollContainerRef,
        className: `flex-1 overflow-y-auto px-6 relative ${isOverflowing ? "scroll-fade-out" : ""}`,
        "aria-live": "polite",
        "aria-label": "Search results"
      },
      isSearching || !results ? /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pb-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4" }, [...Array(4)].map((_, i) => /* @__PURE__ */ React.createElement(ResultCardSkeleton, { key: i })))) : results.length > 0 ? /* @__PURE__ */ React.createElement(React.Suspense, { fallback: /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pb-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4" }, [...Array(4)].map((_, i) => /* @__PURE__ */ React.createElement(ResultCardSkeleton, { key: i })))) }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4 pb-8" }, isUsingLocalFallback && /* @__PURE__ */ React.createElement("div", { className: "mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-blue-700 dark:text-blue-300" }, /* @__PURE__ */ React.createElement(Brain, { className: "inline-block w-4 h-4 mr-2" }), "Showing results from local document library")), /* @__PURE__ */ React.createElement(
        ResultsGrid,
        {
          results,
          locale,
          onDocumentClick: handleDocumentClick,
          isLoading: isSearching
        }
      ))) : searchInput ? /* @__PURE__ */ React.createElement(
        NoResults,
        {
          searchQuery: searchInput,
          suggestion,
          onSuggestionClick: (text) => {
            setSearchInput(text);
            performSearch(text);
          }
        }
      ) : null
    ), /* @__PURE__ */ React.createElement("div", { className: "flex-shrink-0 px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 dark:text-gray-400 text-center" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Disclaimer:"), " Not legal advice; consult an attorney for personalized guidance.")))
  ));
}
