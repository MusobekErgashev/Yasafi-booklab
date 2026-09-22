import { create } from "zustand";

const useOpenMenu = create((set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))

export default useOpenMenu