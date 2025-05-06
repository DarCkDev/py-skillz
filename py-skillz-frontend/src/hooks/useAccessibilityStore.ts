import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FontSize = 'small' | 'medium' | 'large';
type LineHeight = 'small' | 'medium' | 'large';

interface AccessibilityState {
  highContrast: boolean;
  fontSize: FontSize;
  lineHeight: LineHeight;
  setHighContrast: (value: boolean) => void;
  setFontSize: (size: FontSize) => void;
  setLineHeight: (height: LineHeight) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  highContrast: false,
  fontSize: 'medium' as FontSize,
  lineHeight: 'medium' as LineHeight,
};

// accesibilidad en localStorage
export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setHighContrast: (value: boolean) => set({ highContrast: value }),
      setFontSize: (size: FontSize) => set({ fontSize: size }),
      setLineHeight: (height: LineHeight) => set({ lineHeight: height }),
      
      
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'pi-skillz-accessibility', // nombre para localStorage
      
      // Podemos definir qué campos queremos mantener en localStorage
      partialize: (state) => ({
        highContrast: state.highContrast,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
      }),
    }
  )
);
