"use client";

import React, { useState } from "react";
import { Mail } from "lucide-react";

interface EmailInputManagerProps {
  storeUrl: string;
  currentEmail: string;
  onUpdateEmail: (email: string) => void;
  className?: string;
  onFocus?: () => void;
}

export default function EmailInputManager({
  storeUrl,
  currentEmail,
  onUpdateEmail,
  className = "",
  onFocus,
}: EmailInputManagerProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [appliedBadge, setAppliedBadge] = useState<string | null>(null);

  // Strategi 1: Heuristik Ringan (Mencoba menebak email B2B standar)
  const guessEmailHeuristic = () => {
    try {
      const url = storeUrl.startsWith("http") ? storeUrl : `https://${storeUrl}`;
      const domain = new URL(url).hostname.replace("www.", "");
      return `hello@${domain}`; // 40% toko Shopify menggunakan pola ini
    } catch {
      return "";
    }
  };

  // Strategi 2: OSINT Bypass (Membuka Google Search terarah)
  const handleGoogleSearch = () => {
    try {
      const url = storeUrl.startsWith("http") ? storeUrl : `https://${storeUrl}`;
      const domain = new URL(url).hostname.replace("www.", "");
      // Menggunakan dorking pencarian Google untuk mengekspos email publik
      const query = `site:${domain} "@${domain}" OR "contact us" OR "email" OR "support"`;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    } catch {}
  };

  const handleAutoDetect = () => {
    setIsFetching(true);
    // Terapkan tebakan logis seketika tanpa harus melakukan request server yang diblokir CORS
    const guessed = guessEmailHeuristic();
    setTimeout(() => {
      onUpdateEmail(guessed);
      setIsFetching(false);
      setAppliedBadge("Pola Diterapkan!");
      setTimeout(() => setAppliedBadge(null), 2000);
    }, 350);
  };

  return (
    <div
      className={`flex flex-col gap-2 mt-4 bg-slate-50 dark:bg-stone-900/90 p-3.5 rounded-xl border border-slate-200 dark:border-stone-800 ${className}`}
    >
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Search email</span>
          {appliedBadge && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold lowercase bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded">
              {appliedBadge}
            </span>
          )}
        </label>

        {/* Tombol Clean & Simple: 'Guess' & 'googling' */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleAutoDetect}
            disabled={isFetching}
            className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            title="Guess email pattern (hello@domain.com)"
          >
            <span>{isFetching ? "..." : "Guess"}</span>
          </button>
          <button
            type="button"
            onClick={handleGoogleSearch}
            className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            title="Search email on Google"
          >
            <span>googling</span>
          </button>
        </div>
      </div>

      <input
        type="email"
        value={currentEmail}
        onChange={(e) => onUpdateEmail(e.target.value)}
        onFocus={onFocus}
        placeholder="Atau ketik manual (cth: owner@store.com atau support@store.com)"
        className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm font-mono border border-slate-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-950 text-slate-900 dark:text-stone-100 placeholder:text-slate-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-xs"
      />
    </div>
  );
}
