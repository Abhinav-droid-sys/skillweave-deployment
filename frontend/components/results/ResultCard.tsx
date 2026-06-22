"use client";

import React, { useState } from "react";
import ConfidenceRing from "./ConfidenceRing";
import type { SearchResult } from "@/lib/types";
import { assignCode, submitFeedback } from "@/lib/api";
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ResultCardProps {
  result: SearchResult;
  index: number;
  rank?: number;
  onOpenDrawer: (result: SearchResult) => void;
  searchLogId?: number | null;
  query: string;
}

const RANK_LABELS: Record<number, { text: string; className: string }> = {
  0: { text: "BEST MATCH", className: "bg-success/10 text-success border-success/20" },
  1: { text: "MATCH #2", className: "bg-primary-soft/10 text-primary border-primary/20" },
  2: { text: "MATCH #3", className: "bg-bg-subtle text-text-muted border-border" },
  3: { text: "MATCH #4", className: "bg-bg-subtle text-text-muted border-border" },
  4: { text: "MATCH #5", className: "bg-bg-subtle text-text-muted border-border" },
};

export default function ResultCard({
  result,
  index,
  rank = index,
  onOpenDrawer,
  searchLogId = null,
  query,
}: ResultCardProps) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [expanded, setExpanded] = useState(false);

  const isTopMatch = index === 0;

  async function handleFeedback(type: "up" | "down") {
    const isRemove = feedback === type;
    const nextFeedback = isRemove ? null : type;
    setFeedback(nextFeedback);

    try {
      await submitFeedback({
        search_log_id: searchLogId,
        nco_code: result.nco_code,
        query: query,
        positive: type === "up" && !isRemove,
      });
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  }

  return (
    <Card 
      className={`p-5 sm:p-6 transition-all duration-300 ${
        isTopMatch ? "border-primary/40 shadow-lg scale-[1.01] relative z-10" : "hover:shadow-md hover:-translate-y-px hover:border-border-strong"
      }`}
    >
      {/* Subtle glow for top match */}
      {isTopMatch && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-20" style={{
          background: "linear-gradient(135deg, var(--primary) 0%, transparent 50%, var(--accent) 100%)",
          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          padding: "1px"
        }} />
      )}

      {/* Ranking badge */}
      {rank in RANK_LABELS && (
        <div className={`inline-flex items-center text-[10px] font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded-pill border mb-3 ${RANK_LABELS[rank].className}`}>
          {RANK_LABELS[rank].text}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Code Chip */}
        <div className="shrink-0">
          <span className="font-mono text-sm font-bold text-primary bg-primary-soft/10 px-2.5 py-1.5 rounded-md inline-block">
            {result.nco_code}
          </span>
        </div>

        {/* Title & Summary */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-text leading-tight mb-1">
            {result.display_title || result.title}
          </h3>
          {result.summary && (
            <p className="text-[13.5px] text-text-muted leading-relaxed">
              {result.summary}
            </p>
          )}
        </div>

        {/* Confidence Ring */}
        <ConfidenceRing value={result.confidence} />
      </div>

      {/* Why this match */}
      {result.reason && (
        <div className="mt-4 p-3 text-[13.5px] text-text-secondary bg-primary-soft/5 border-l-[3px] border-primary rounded-r-md leading-relaxed">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-primary mr-2">Why this match</span>
          {result.reason}
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 text-sm text-text-secondary leading-relaxed">
          {result.description}
        </div>
      )}

      {/* Breadcrumb Hierarchy */}
      {result.hierarchy_path && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
          {result.hierarchy_path.split(" > ").map((node, i, arr) => (
            <React.Fragment key={i}>
              <span className={i === arr.length - 1 ? "text-primary font-semibold" : ""}>
                {node}
              </span>
              {i < arr.length - 1 && (
                <span className="text-text-muted/50">›</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Actions Row */}
      <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[12.5px] font-semibold text-primary hover:text-primary-soft transition-colors"
          >
            {expanded ? "Hide details" : "Show details"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onOpenDrawer(result)}
            className="text-[12.5px] font-semibold text-primary hover:text-primary-soft hover:underline transition-colors"
          >
            View Details
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Feedback */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFeedback("up")}
              className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${
                feedback === "up" 
                  ? "bg-success/10 border-success text-success" 
                  : "bg-bg-subtle border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedback("down")}
              className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${
                feedback === "down" 
                  ? "bg-danger/10 border-danger text-danger" 
                  : "bg-bg-subtle border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
