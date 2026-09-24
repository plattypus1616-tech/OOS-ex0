"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Hook kustom untuk State yang persisten dengan arsitektur tertunda (Deferred State).
 * 
 * 1. Render pertama (Server & Klien) HARUS identik menggunakan initialValue untuk mencegah hydration mismatch.
 * 2. Baca localStorage HANYA setelah komponen sukses terpasang (Mounted) di Klien.
 * 3. Tulis ke localStorage setiap kali state (value) berubah setelah fase mount selesai.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  // 1. Render pertama (Server & Klien) HARUS identik menggunakan initialValue
  const [value, setValue] = useState<T>(initialValue);
  const isHydratedRef = useRef(false);

  // 2. Baca localStorage HANYA setelah komponen sukses terpasang (Mounted) di Klien
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(key);
        if (saved) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setValue(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error(`Gagal membaca ${key} dari localStorage:`, error);
    } finally {
      isHydratedRef.current = true;
    }
  }, [key]);

  // 3. Tulis ke localStorage setiap kali state (value) berubah
  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Gagal menyimpan ${key} ke localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}


