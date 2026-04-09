interface ProgressBarProps {
  value: number     // 0–100
  color?: string    // Tailwind bg class
  label?: string
  className?: string
  height?: string   // Tailwind h- class
}

export function ProgressBar({
  value,
  color = 'bg-primary-400',
  label,
  className = '',
  height = 'h-3',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
