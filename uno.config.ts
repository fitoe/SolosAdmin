import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: {
    'app-card': 'rounded-4 border border-slate-200 bg-white shadow-sm',
    'app-page': 'min-h-0 flex flex-col gap-4',
    'app-title': 'text-18px font-700 text-slate-900',
    'app-subtitle': 'text-13px text-slate-500',
  },
  theme: {
    colors: {
      brand: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#2563eb',
        600: '#1d4ed8',
        700: '#1e40af',
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.1,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
})
