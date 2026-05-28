import { useState } from 'react'

interface ColorSettingsProps {
  onColorsChange: (colors: {
    bubbleCore: string
    bubbleShell: string
    gridCell: string
    gridSection: string
  }) => void
  currentColors: {
    bubbleCore: string
    bubbleShell: string
    gridCell: string
    gridSection: string
  }
}

function ColorSettings({ onColorsChange, currentColors }: ColorSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [colors, setColors] = useState(currentColors)

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)
    onColorsChange(newColors)
  }

  const presetColors = {
    default: {
      name: 'Red',
      bubbleCore: '#ff0000',
      bubbleShell: '#cc0000',
      gridCell: '#333333',
      gridSection: '#555555'
    },
    blue: {
      name: 'Blue',
      bubbleCore: '#0066ff',
      bubbleShell: '#0044cc',
      gridCell: '#1a237e',
      gridSection: '#283593'
    },
    green: {
      name: 'Green',
      bubbleCore: '#00ff00',
      bubbleShell: '#00cc00',
      gridCell: '#1b5e20',
      gridSection: '#2e7d32'
    },
    purple: {
      name: 'Purple',
      bubbleCore: '#9c27b0',
      bubbleShell: '#7b1fa2',
      gridCell: '#4a148c',
      gridSection: '#6a1b9a'
    },
    orange: {
      name: 'Orange',
      bubbleCore: '#ff6600',
      bubbleShell: '#cc5200',
      gridCell: '#e65100',
      gridSection: '#ff6f00'
    },
    cyan: {
      name: 'Cyan',
      bubbleCore: '#00ffff',
      bubbleShell: '#00cccc',
      gridCell: '#006064',
      gridSection: '#0097a7'
    }
  }

  const applyPreset = (preset: keyof typeof presetColors) => {
    setColors(presetColors[preset])
    onColorsChange(presetColors[preset])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
        title="Color Settings"
      >
        <span className="text-2xl">🎨</span>

        {/* Ripple effect */}
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>

        {/* Indicator dot when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-[#1a1a2e]/95 backdrop-blur-sm border border-[#0f3460] rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sky-400 text-xl font-bold">Color Palette</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* Live Preview */}
          <div className="mb-4 p-3 bg-[#0f3460]/30 rounded-lg border border-[#0f3460]/50">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: colors.bubbleShell }}
                ></div>
                <div
                  className="absolute inset-2 rounded-full"
                  style={{ backgroundColor: colors.bubbleCore }}
                ></div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Preview</div>
                <div className="flex gap-1">
                  <div
                    className="w-full h-2 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: colors.gridCell }}
                  ></div>
                  <div
                    className="w-full h-2 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: colors.gridSection }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm font-semibold mb-2 block">Quick Presets:</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(presetColors).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => applyPreset(key as keyof typeof presetColors)}
                  className="relative h-12 rounded-xl cursor-pointer border-2 border-transparent hover:border-sky-400 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg group"
                  style={{
                    backgroundColor: preset.bubbleCore,
                    boxShadow: `0 4px 12px ${preset.bubbleCore}40`
                  }}
                  title={preset.name}
                >
                  <div className="absolute inset-1 rounded-lg opacity-60" style={{ backgroundColor: preset.bubbleShell }}></div>
                  <span className="relative z-10 text-white text-xs font-bold drop-shadow-lg">{preset.name}</span>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="space-y-3">
            <label className="text-gray-300 text-sm font-semibold block">Custom Colors:</label>

            <div className="space-y-2">
              {[
                { key: 'bubbleCore', label: 'Bubble Core', icon: '🔴' },
                { key: 'bubbleShell', label: 'Bubble Shell', icon: '🟡' },
                { key: 'gridCell', label: 'Grid Cell', icon: '🔲' },
                { key: 'gridSection', label: 'Grid Section', icon: '🔳' }
              ].map(({ key, label, icon }) => (
                <div key={key} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <span>{icon}</span>
                      <span>{label}:</span>
                    </label>
                    <span
                      className="text-xs font-mono bg-[#0f3460]/50 px-2 py-0.5 rounded text-gray-400 group-hover:text-sky-400 transition-colors"
                    >
                      {colors[key as keyof typeof colors]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors[key as keyof typeof colors]}
                      onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-[#0f3460] hover:border-sky-400 transition-colors"
                    />
                    <div
                      className="flex-1 h-10 rounded-lg border-2 border-[#0f3460] transition-colors duration-300"
                      style={{ backgroundColor: colors[key as keyof typeof colors] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer hint */}
          <div className="mt-4 pt-3 border-t border-[#0f3460]/30 text-center">
            <span className="text-xs text-gray-500">Click presets or use color pickers to customize</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorSettings
