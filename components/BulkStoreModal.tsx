"use client";

import React, { useState } from "react";
import { X, Plus, Layers, Sparkles } from "lucide-react";
import { DEFAULT_STORES } from "@/lib/presets";

interface BulkStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStores: (urls: string[]) => void;
}

export function BulkStoreModal({ isOpen, onClose, onAddStores }: BulkStoreModalProps) {
  const [text, setText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));

    if (lines.length > 0) {
      onAddStores(lines);
      setText("");
      onClose();
    }
  };

  const handleLoadDefaults = () => {
    const defaultList = DEFAULT_STORES.map((s) => s.url).join("\n");
    setText(defaultList);
  };

  return (
    <div
      id="bulk-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="bulk-modal-content"
        className="w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-base">
                Bulk Add Shopify Stores
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Paste multiple store URLs (one per line) to audit
              </p>
            </div>
          </div>
          <button
            id="close-bulk-modal-btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                Store URLs (e.g. beardbrand.com, https://allbirds.com)
              </label>
              <button
                type="button"
                id="load-default-presets-btn"
                onClick={handleLoadDefaults}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                Fill with 9 Benchmark Stores
              </button>
            </div>
            <textarea
              id="bulk-urls-input"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`https://www.beardbrand.com\nhttps://www.tazachocolate.com\nhttps://hiutdenim.co.uk\nhttps://asket.com`}
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs font-mono text-stone-800 placeholder:text-stone-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200 dark:placeholder:text-stone-600 dark:focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500">
              {text.split("\n").filter((l) => l.trim().length > 0).length} URLs queued
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-bulk-urls-btn"
                disabled={!text.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add to Audit Queue
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
