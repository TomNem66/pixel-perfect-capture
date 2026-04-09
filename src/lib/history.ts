import { HistoryItem } from "@/types/analysis";

const HISTORY_KEY = "vopatrne_history";

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: HistoryItem): void {
  const history = getHistory().filter((h) => h.url !== item.url);
  history.unshift(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}
