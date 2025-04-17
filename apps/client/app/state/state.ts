import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface dataType {
  text: string;
  desc: string;
}

interface DataState {
  sampleData: dataType;
  setSampleData: (newData: dataType) => void;
}

const defaultState = { text: "", desc: "" };

const useZustandState = create(
  persist<DataState>(
    (set) => ({
      sampleData: defaultState,
      setSampleData: (newData: dataType) =>
        set((state) => ({ sampleData: { ...state, ...newData } })),
    }),
    {
      name: "zustand-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { useZustandState };
