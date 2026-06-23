"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/ui/SearchBar";
import Chip from "@/components/ui/Chip";
import EmptyState from "@/components/ui/EmptyState";
import { Search } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { searchOccupations } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

// Import existing result components, we will refactor them to Tailwind separately
import ResultCard from "@/components/results/ResultCard";
import OccupationDrawer from "@/components/results/OccupationDrawer";

const EXAMPLES = ["I grow wheat", "मैं गेहूं उगाता हूं", "সামুদ্রিক মাছ চাষের কার্যক্রম", "நான் உப்பு உற்பத்தி செய்கிறேன்"];

export default function Home() {
  const { addHistory, currentQuery, setCurrentQuery } = useSearchStore();
  const [query, setQuery] = useState("");
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [normalizationInfo, setNormalizationInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [activeResult, setActiveResult] = useState<SearchResult | null>(null);

  // Sync zustand currentQuery to local input if it changes externally (e.g., clicking sidebar history)
  useEffect(() => {
    if (currentQuery && currentQuery !== query) {
      setQuery(currentQuery);
      handleSearch(currentQuery);
    }
  }, [currentQuery]);

  async function handleSearch(searchTerm: string) {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentQuery(searchTerm); // Sync back to store

    try {
      const res = await searchOccupations(searchTerm, 8, "auto");
      setResults(res.results || []);
      setNormalizationInfo(res.normalization || null);
      addHistory(searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectQuery(q: string) {
    setQuery(q);
    handleSearch(q);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Stack */}
      <motion.div 
        className="flex flex-col items-center justify-center w-full mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <div className="w-full mx-auto bg-bg-subtle rounded-md p-6 sm:p-10 border border-border/60 shadow-sm relative mb-8">
          <p className="text-[14px] font-semibold text-text-secondary mb-4 text-left">
            Enter business activity description
          </p>
          <div className="w-full">
            <SearchBar 
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-xs text-text-muted">
            <span className="italic">Supports natural language queries in multiple Indian languages in text or voice format</span>
            <span className="font-semibold mt-2 sm:mt-0 text-text-secondary">NIC 2025</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          {EXAMPLES.map((ex) => (
            <Chip key={ex} onClick={() => handleSelectQuery(ex)}>
              {ex}
            </Chip>
          ))}
        </div>
      </motion.div>

      {/* Main Workspace Area */}
      <div className="w-full max-w-[880px] mx-auto">
        {!hasSearched ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <EmptyState 
              icon={Search}
              title="Start Searching"
              subtitle="Enter an occupation in any language to discover the correct NCO classification code."
            />
          </motion.div>
        ) : (
          <div className="flex flex-col space-y-6">
            {normalizationInfo && normalizationInfo.original !== normalizationInfo.normalized && (
              <div className="bg-surface border border-border rounded-card p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-text-muted uppercase">How we read your query</h3>
                  {normalizationInfo.applied_steps && normalizationInfo.applied_steps.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft/10 text-primary uppercase">Rules</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="px-4 py-2.5 bg-bg-subtle border border-border rounded-lg text-[15px] text-text font-medium shadow-sm">
                    {normalizationInfo.original}
                  </div>
                  
                  <div className="text-primary font-bold text-lg flex items-center justify-center relative">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="M18 8L22 12L18 16"/><path d="M2 12H22"/><path d="M2 12C2 12 5.5 6 12 6C18.5 6 22 12 22 12"/><path d="M2 12C2 12 5.5 18 12 18C18.5 18 22 12 22 12"/>
                    </svg>
                    <div className="absolute inset-0 bg-surface mix-blend-color"></div>
                    <span className="absolute text-[22px] font-black text-primary-soft tracking-tighter" style={{ fontFamily: 'sans-serif' }}>⟿</span>
                  </div>

                  <div className="px-4 py-2.5 bg-search-gradient text-white rounded-lg text-[15px] font-semibold shadow-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                    {normalizationInfo.normalized}
                  </div>
                </div>

                {normalizationInfo.applied_steps && normalizationInfo.applied_steps.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {normalizationInfo.applied_steps.map((step: string, i: number) => (
                      <div key={i} className="text-[11px] px-2.5 py-1.5 bg-bg-subtle border border-border rounded text-text-secondary font-mono flex items-center shadow-sm">
                        {step.startsWith("typo:") ? (
                          <>
                            <span className="text-primary font-bold mr-1">typo:</span>
                            {step.replace("typo: ", "")}
                          </>
                        ) : step.startsWith("translation:") ? (
                          <>
                            <span className="text-primary font-bold mr-1">translated:</span>
                            {step.replace("translation: ", "")}
                          </>
                        ) : (
                          step
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-[11.5px] text-text-muted flex items-center gap-2 pt-1">
                  <span>Detected: <strong className="text-text-secondary font-semibold">{normalizationInfo.detected_language}</strong></span>
                  <span className="w-1 h-1 rounded-full bg-border-strong"></span>
                  <span>script <strong className="text-text-secondary font-semibold">{normalizationInfo.detected_script}</strong></span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2 mb-4">
              <h2 className="text-[13px] text-text-secondary">
                Found <strong className="text-text font-semibold">{results.length} results</strong> in 0.2 seconds
              </h2>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface border border-border rounded-card h-32 w-full"></div>
                ))}
                <p className="text-center text-text-muted text-sm italic mt-4">AI is matching...</p>
              </div>
            ) : error ? (
              <div className="bg-surface border-l-4 border-danger p-6 rounded-card shadow-sm text-danger">
                <strong>Error:</strong> {error}
                <button 
                  onClick={() => handleSearch(currentQuery)}
                  className="mt-4 px-4 py-2 bg-bg-subtle border border-border rounded-btn text-text-secondary hover:text-text block"
                >
                  Retry Search
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <ResultCard 
                    key={result.nco_code} 
                    result={result} 
                    index={idx}
                    query={currentQuery}
                    onOpenDrawer={() => setActiveResult(result)} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Search}
                title="No matching occupations found"
                subtitle="We couldn't find any NCO codes matching your query. Try rephrasing or using a different synonym."
              />
            )}
          </div>
        )}
      </div>

      <OccupationDrawer 
        result={activeResult} 
        onClose={() => setActiveResult(null)} 
      />
    </div>
  );
}