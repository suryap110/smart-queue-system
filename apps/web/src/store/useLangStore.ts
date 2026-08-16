import { create } from 'zustand';

export type Language = 'en' | 'hi';

interface LangState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (enText: string, hiText: string) => string;
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
  t: (enText: string, hiText: string) => {
    return get().lang === 'hi' ? hiText : enText;
  }
}));
