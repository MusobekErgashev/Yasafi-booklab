import { create } from "zustand";

const useQuery = create((set) => ({
    query: "",
    setQuery: (query) => set({ query }),
    clearQuery: () => set({ query: "" })
}))

export default useQuery