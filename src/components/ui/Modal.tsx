import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      {/* Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-slide-up">
        {title && (
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
