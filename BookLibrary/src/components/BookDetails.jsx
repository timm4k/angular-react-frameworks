import { useEffect, useState } from "react";
import styles from "./BookDetails.module.css";

function BookDetails({
  book,
  favorites,
  similarBooks,
  loading,
  onClose,
  onFavorite,
  onDelete,
  onFindSimilar,
  onOpenBook,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isFavorite = favorites.includes(book.id);

  useEffect(() => {
    const close = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        <button
          className={styles.close}
          type="button"
          onClick={onClose}
          aria-label="Close book details"
        >
          ×
        </button>
        <div className={styles.top}>
          <div className={styles.coverArea}>
            {book.cover ? (
              <img src={book.cover} alt={"Cover of " + book.title} />
            ) : (
              <div className={styles.fallback}>{book.title}</div>
            )}
          </div>
          <div className={styles.info}>
            <span className={styles.source}>
              {book.source === "user" ? "Personal book" : "Open Library record"}
            </span>
            <h2 id="details-title">{book.title}</h2>
            <p className={styles.author}>by {book.author}</p>
            <div className={styles.stats}>
              <span>
                <b>{book.year || "—"}</b>First published
              </span>
              <span>
                <b>{book.rating || "—"}</b>Rating
              </span>
              <span>
                <b>{book.editionCount || "—"}</b>Editions
              </span>
            </div>
            <p className={styles.description}>
              {loading && !book.description
                ? "Loading full record…"
                : book.description ||
                  "A personal title from your own collection"}
            </p>
            <div className={styles.subjects}>
              {book.subjects?.slice(0, 6).map((subject) => (
                <span key={subject}>{subject}</span>
              ))}
            </div>
            <div className={styles.actions}>
              <button
                className={isFavorite ? styles.favoriteActive : styles.favorite}
                onClick={() => onFavorite(book)}
              >
                ♥ {isFavorite ? "Saved to favorites" : "Add to favorites"}
              </button>
              {book.source !== "user" && (
                <button
                  className={styles.similar}
                  onClick={() => onFindSimilar(book)}
                  disabled={loading}
                >
                  Find similar books
                </button>
              )}
              {book.source === "open-library" && (
                <a
                  href={"https://openlibrary.org" + book.workKey}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {similarBooks.length > 0 && (
          <div className={styles.similarSection}>
            <h3>Readers may also like</h3>
            <div className={styles.similarGrid}>
              {similarBooks.map((item) => (
                <button key={item.id} onClick={() => onOpenBook(item)}>
                  <img src={item.coverSmall} alt="" />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.author}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {book.source === "user" && (
          <div className={styles.danger}>
            {!confirmingDelete ? (
              <button onClick={() => setConfirmingDelete(true)}>
                Remove personal book
              </button>
            ) : (
              <div>
                <span>Remove this book permanently?</span>
                <button onClick={() => setConfirmingDelete(false)}>
                  Cancel
                </button>
                <button
                  className={styles.confirm}
                  onClick={() => onDelete(book.id)}
                >
                  Yes, remove
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
export default BookDetails;
