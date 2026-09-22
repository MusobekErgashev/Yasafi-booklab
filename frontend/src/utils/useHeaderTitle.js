import { create } from "zustand";

const useHeaderTitle = create((set) => ({
    title: "",
    description: "",
    setTitle: (title, description) => {
        set({ title, description })
    }
}))

export default useHeaderTitle