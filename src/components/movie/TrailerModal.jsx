import Modal from '../ui/Modal'

export default function TrailerModal({ isOpen, onClose, videoId, title }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" title={title}>
      <div className="aspect-video w-full bg-black">
        {videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={`Trailer for ${title}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-text-secondary">
            <p className="text-xl mb-2">🎥</p>
            <p>Trailer not available</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
