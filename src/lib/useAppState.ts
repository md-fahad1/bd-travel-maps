"use client";

import { useCallback, useEffect, useState } from "react";

export interface TripItem {
  district: string;
  day: number;
  done: boolean;
}

export interface AppState {
  visited: string[];
  theme: string;
  name: string;
  photo: string | null;
  showLabels: boolean;
  trip: TripItem[];
  tripDays: number;
}

const KEY = "bd-maps:v1";

const DEFAULT: AppState = {
  visited: [],
  theme: "classic",
  name: "",
  photo: null,
  showLabels: true,
  trip: [],
  tripDays: 3,
};

/** All state lives in the browser (localStorage). Nothing is sent to a server. */
export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked (e.g. a big photo) - ignore */
    }
  }, [state, ready]);

  const update = useCallback((patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  return { state, update, ready };
}
