import { useState } from 'react'

export default function ProductGallery({ images, alt }) {
  const [imageIndex, setImageIndex] = useState(0)

  return (
    <div className="gallery">
      {images.length ? (
        <>
          <img
            className="hero-image"
            src={images[imageIndex]}
            alt={alt}
          />
          <div className="thumbs">
            {images.map((src, index) => (
              <button
                className={imageIndex === index ? 'selected' : ''}
                key={src}
                onClick={() => setImageIndex(index)}
                aria-label={`Фото ${index + 1}`}
                aria-pressed={imageIndex === index}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Изображения отсутствуют</p>
      )}
    </div>
  )
}
