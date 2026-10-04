import { create } from 'zustand';

export type StageViewMode = 'full' | 'cockpit' | 'drivetrain' | 'wheels' | 'saddle';

export type VisualState = {
  activeView: StageViewMode;
  selectedColorId: string | null;
  activeCategory: string | null;
  setActiveView: (view: StageViewMode) => void;
  setSelectedColorId: (colorId: string) => void;
  setActiveCategory: (categoryId: string | null) => void;
};

export const useVisualStore = create<VisualState>((set) => ({
  activeView: 'full',
  selectedColorId: null,
  activeCategory: 'quadro',
  setActiveView: (view) => set({ activeView: view }),
  setSelectedColorId: (colorId) => set({ selectedColorId: colorId }),
  setActiveCategory: (categoryId) => {
    // Automatically map category to matching stage focus view
    let targetView: StageViewMode = 'full';
    if (categoryId === 'rodas' || categoryId === 'pneus') targetView = 'wheels';
    else if (categoryId === 'guiador') targetView = 'cockpit';
    else if (categoryId === 'selim') targetView = 'saddle';
    else if (categoryId === 'grupo' || categoryId === 'pedaleiro') targetView = 'drivetrain';
    else if (categoryId === 'quadro') targetView = 'full';

    set({ activeCategory: categoryId, activeView: targetView });
  },
}));
