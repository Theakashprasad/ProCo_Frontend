// store.ts

import create from 'zustand';

interface AppState {
  username: string;
  setUsername: (username: string) => void;
}

const useStore = create<AppState>((set) => ({
  username: '',
  setUsername: (username) => set({ username }),
}));

export default useStore;
