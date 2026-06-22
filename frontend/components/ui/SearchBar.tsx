"use client";

import React, { useState } from "react";
import { Search, Mic, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (val: string) => void;
  loading?: boolean;
}

export default function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-IN");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  const toggleMic = () => {
    // If already listening, stop it.
    if (isListening) {
      if ((window as any).__recognition) {
        (window as any).__recognition.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please try using Google Chrome or Microsoft Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    (window as any).__recognition = recognition;
    
    // continuous=true keeps the mic open until stopped. 
    // interimResults=true gives us the words as the user is speaking them.
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = voiceLang;

    // Capture the current input value so we can append to it
    let baseTranscript = value;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      // Live update the search box as the user speaks!
      const displayText = (baseTranscript + " " + final + interim).trim();
      onChange(displayText);

      // Once a sentence is finalized, update the base for the next sentence
      if (final) {
        baseTranscript = (baseTranscript + " " + final).trim();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Voice recognition error:", event.error);
      if (event.error === 'not-allowed') {
        alert("Microphone access was denied. Please allow microphone permissions in your browser settings.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
      setIsListening(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        relative flex items-center w-full max-w-[880px] bg-surface rounded-search border
        transition-all duration-300 mx-auto
        ${isFocused ? "border-primary shadow-focus" : "border-border shadow-sm hover:border-border-strong"}
      `}
    >
      <div className="pl-5 pr-3 text-text-muted">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder='Describe the occupation… e.g. "farmer, teacher, software engineer, tractor driver…"'
        className="flex-1 py-4 bg-transparent outline-none text-text placeholder:text-text-muted/70 text-base"
        aria-label="Search occupations"
      />

      <div className="flex items-center gap-3 pr-2">

        <button
          type="button"
          onClick={toggleMic}
          className={`
            relative p-3 rounded-full transition-colors flex items-center justify-center
            ${isListening ? "text-primary" : "text-text-muted hover:bg-bg-subtle hover:text-text"}
          `}
          aria-label={isListening ? "Stop listening" : "Start voice search"}
          aria-live="polite"
        >
          <Mic className="w-5 h-5 relative z-10" />
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary-soft/20 rounded-full"
              />
            )}
          </AnimatePresence>
        </button>

        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="bg-search-gradient text-white flex items-center gap-2 px-6 py-3 rounded-btn font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Searching..." : "Search"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </form>
  );
}
