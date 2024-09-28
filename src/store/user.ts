// store.ts

import create from "zustand";

interface AppState {
  role: string;
  setRole: (role: string) => void;
  payment: boolean;
  setPayment: (payment: boolean) => void;
  image: Blob | null;
  setImage: (image: Blob | null) => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
  selectedConversation: string | null;
  setSelectedConversation: (selectedConversation: string | null) => void;
  followId: string;
  setFollowId: (followId: string | undefined) => void;
  premimum: boolean;
  setPremium: (premimum: boolean) => void;
  video: string;
  setVideo: (video: string) => void;
  communityId: string;
  setCommunityId: (communityId: string) => void;
}

const useStore = create<AppState>((set) => ({
  role: "ddd",
  setRole: (role) => set({ role }),
  payment: false,
  setPayment: (payment) => set({ payment }),
  image: null,
  setImage: (image) => set({ image }),
  modal: false,
  setModal: (modal) => set({ modal }),
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  followId: "",
  setFollowId: (followId) => set({ followId }),
  premimum: false,
  setPremium: (premimum) => set({ premimum }),
  video:
    "https://pomodo.s3.eu-north-1.amazonaws.com/aesthetic+anime+car+shorts+loop+_+youtube+shorts+_+gif+loop+%23shorts+(1).mp4",
  setVideo: (video) => set({ video }),
  communityId: "",
  setCommunityId: (communityId) => set({ communityId }),
}));

export default useStore;

// const { setPayment } = useStore();
