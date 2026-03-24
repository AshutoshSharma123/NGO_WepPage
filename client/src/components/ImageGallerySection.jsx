import { useMemo, useState } from "react";

export function ImageGallerySection({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const safeImages = useMemo(
    () =>
      images.length
        ? images
        : [
            {
              title: "Community Care",
              imageUrl:
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
              description: "Moments from field support and relief outreach."
            }
          ],
    [images]
  );

  const currentImage = safeImages[activeIndex] || safeImages[0];

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % safeImages.length);
  };

  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + safeImages.length) % safeImages.length);
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX == null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchStartX - touchEndX;

    if (deltaX > 40) {
      goNext();
    } else if (deltaX < -40) {
      goPrev();
    }

    setTouchStartX(null);
  };

  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-heading">
        <p className="eyebrow">Image gallery</p>
        <h2>Stories from the ground in a modern swipeable gallery.</h2>
      </div>

      <div
        className="gallery-shell"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="gallery-stage">
          <img className="gallery-image" src={currentImage.imageUrl} alt={currentImage.title} />
          <div className="gallery-overlay">
            <span className="gallery-kicker">Featured moment</span>
            <h3>{currentImage.title}</h3>
            <p>{currentImage.description}</p>
          </div>
        </div>

        <div className="gallery-controls">
          <button className="gallery-nav" type="button" onClick={goPrev}>
            Previous
          </button>
          <div className="gallery-dots">
            {safeImages.map((image, index) => (
              <button
                key={`${image.title}-${index}`}
                type="button"
                className={index === activeIndex ? "gallery-dot active" : "gallery-dot"}
                aria-label={`Show ${image.title}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button className="gallery-nav" type="button" onClick={goNext}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
