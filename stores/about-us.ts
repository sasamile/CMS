import { create } from "zustand"

interface AboutUsState {
  selectedItem: string
  setSelectedItem: (item: string) => void
}

export const useAboutUsStore = create<AboutUsState>((set) => ({
  selectedItem: "Crear", // Valor inicial por defecto
  setSelectedItem: (item: string) => set({ selectedItem: item }),
}))
