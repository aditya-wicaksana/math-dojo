interface NumberPadProps {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  allowFraction?: boolean
}

const DIGITS = ['7', '8', '9', '4', '5', '6', '1', '2', '3']

export function NumberPad({ value, onChange, onSubmit, allowFraction = false }: NumberPadProps) {
  const press = (ch: string) => {
    if (ch === '⌫') {
      onChange(value.slice(0, -1))
    } else if (ch === '/') {
      if (!value.includes('/')) onChange(value + '/')
    } else {
      onChange(value + ch)
    }
  }

  return (
    <div className="md:hidden w-full max-w-xs mx-auto">
      <div className="grid grid-cols-3 gap-2">
        {DIGITS.map(d => (
          <button
            key={d}
            onPointerDown={(e) => { e.preventDefault(); press(d) }}
            className="h-14 rounded-2xl bg-white shadow-md text-2xl font-black text-gray-800 active:scale-95 active:bg-gray-100 transition-all touch-target"
          >
            {d}
          </button>
        ))}
        {allowFraction ? (
          <button
            onPointerDown={(e) => { e.preventDefault(); press('/') }}
            className="h-14 rounded-2xl bg-white shadow-md text-2xl font-black text-gray-500 active:scale-95 active:bg-gray-100 transition-all"
          >
            /
          </button>
        ) : (
          <div />
        )}
        <button
          onPointerDown={(e) => { e.preventDefault(); press('0') }}
          className="h-14 rounded-2xl bg-white shadow-md text-2xl font-black text-gray-800 active:scale-95 active:bg-gray-100 transition-all"
        >
          0
        </button>
        <button
          onPointerDown={(e) => { e.preventDefault(); press('⌫') }}
          className="h-14 rounded-2xl bg-red-50 shadow-md text-2xl text-red-400 active:scale-95 active:bg-red-100 transition-all"
        >
          ⌫
        </button>
      </div>

      {/* Submit */}
      <button
        onPointerDown={(e) => { e.preventDefault(); onSubmit() }}
        disabled={!value.trim()}
        className="w-full mt-3 h-14 rounded-2xl bg-primary-400 text-white text-xl font-black shadow-lg active:scale-95 disabled:opacity-50 transition-all"
      >
        ✓ Check
      </button>
    </div>
  )
}
