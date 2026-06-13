import { Star } from 'lucide-react'
import { useState } from 'react'

export default function StarRating({ value = 0, onChange, size = 'md', readonly = false }) {
  const [hovered, setHovered] = useState(0)

  const sizeClass = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered || value) >= star
        return (
          <button
            key={star}
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              className={`${sizeClass} transition-colors duration-150 ${
                filled ? 'fill-accent-gold text-accent-gold' : 'text-text-secondary'
              }`}
            />
          </button>
        )
      })}
      {value > 0 && !readonly && (
        <span className="ml-1 text-xs text-text-secondary">{value}/5</span>
      )}
    </div>
  )
}
