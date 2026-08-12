import { useEffect, useRef, useState } from "react";
import styles from "../styles/Task.module.css";

function OutsideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleMouseDown = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener("mousedown", handleMouseDown);
    return () =>
      document.body.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  return (
    <article className={styles.card}>
      <span className={styles.number}>3.3</span>
      <p className={styles.eyebrow}>Record notes</p>
      <h3>Open the pressing details</h3>
      <div className={styles.album}>
        <div className={styles.albumArt}>
          NOBODY&apos;S
          <br />
          FOOL
        </div>
        <div>
          <strong>Nobody&apos;s Fool</strong>
          <span>Cinderella</span>
          <small>1986 · Mercury Records</small>
        </div>
      </div>
      <button onClick={() => setIsOpen(true)}>View record details</button>

      {isOpen && (
        <div className={styles.backdrop}>
          <div
            ref={modalRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-title"
          >
            <button
              className={styles.close}
              onClick={() => setIsOpen(false)}
              aria-label="Close details"
            >
              ×
            </button>
            <span className={styles.eyebrow}>October 1986 · Mercury</span>
            <h3 id="record-title">Nobody&apos;s Fool</h3>
            <p>
              Cinderella&apos;s power ballad and the lead single from their
              debut album, Night Songs
            </p>
            <dl>
              <div>
                <dt>Format</dt>
                <dd>7-inch single</dd>
              </div>
              <div>
                <dt>B-side</dt>
                <dd>Push, Push</dd>
              </div>
              <div>
                <dt>Catalog</dt>
                <dd>884 851-7</dd>
              </div>
            </dl>
            <p className={styles.note}>
              Click anywhere outside this card to close it
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default OutsideModal;
