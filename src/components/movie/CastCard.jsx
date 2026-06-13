import { profileUrl } from '../../services/tmdbService'
import { User } from 'lucide-react'

export default function CastCard({ actor }) {
  if (!actor) return null
  
  return (
    <div className="shrink-0 w-28 sm:w-32 group">
      <div className="rounded-xl overflow-hidden aspect-[2/3] bg-surface-light mb-2">
        {actor.profile_path ? (
          <img
            src={profileUrl(actor.profile_path)}
            alt={actor.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-light">
            <User className="w-8 h-8 text-text-secondary opacity-50" />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-text-primary line-clamp-1">{actor.name}</p>
      <p className="text-xs text-text-secondary line-clamp-1">{actor.character}</p>
    </div>
  )
}
