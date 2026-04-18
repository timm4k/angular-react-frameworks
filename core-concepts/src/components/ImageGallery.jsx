import { useState } from "react";
import img1 from "../assets/images/oioi.jpg";
import img2 from "../assets/images/woah.jpg";
import img3 from "../assets/images/okidoki.jpg";
import img4 from "../assets/images/oopsiee.jpg";

export const ImageGallery = () => {
  const images = [img1, img2, img3, img4];
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="card green">
      <span className="tag">2.3 Image slider</span>

      <div className="gallery-container">
        <img
          src={images[index]}
          className="gallery-img"
          alt={`Slide ${index + 1}`}
        />
        <div className="gallery-counter">
          {index + 1} / {images.length}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
        <button style={{ flex: 1 }} onClick={prev}>
          Prev
        </button>
        <button style={{ flex: 1 }} onClick={next}>
          Next
        </button>
      </div>

      <div className="code-box">
        <p style={{ color: "var(--success)" }}>
          // Concept: Cyclic array traversal
        </p>
        <p>
          <strong>Next</strong> button uses <code>(index + 1) % length</code> to
          reset to 0 when it reaches end
        </p>
        <p>
          <strong>Prev</strong> button uses{" "}
          <code>(index - 1 + length) % length</code> to jump to the last element
          if index becomes negative
        </p>
        <p style={{ marginTop: "10px" }}>
          This modulo arithmetic ensures the index always stays within{" "}
          <strong>0</strong> and <strong>{images.length - 1}</strong>, creating
          an infinite loop
        </p>
      </div>
    </div>
  );
};
