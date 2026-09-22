import { create } from "zustand";

const useDarkMode = create((set) => ({
    isDark: false,
    toggle: () => set((state) => ({ isDark: !state.isDark }))
}))

export default useDarkMode