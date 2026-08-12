import { memo } from "react";
import styles from "./BookCard.module.css";

function BookCard({ book, isFavorite, onOpen, onFavorite }) {
  return (
    <article className={styles.card} onClick={() => onOpen(book)}>
      <div className={styles.coverWrap}>
        {book.cover ? (
          <img
            className={styles.cover}
            src={book.cover}
            alt={"Cover of " + book.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.fallback}>
            <span>{book.author}</span>
            <strong>{book.title}</strong>
          </div>
        )}
        {book.source === "user" && (
          <span className={styles.personal}>Personal</span>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.genre}>{book.genre || "Fiction"}</span>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <footer>
          <span>{book.year || "Year unknown"}</span>
          {book.rating && (
            <span className={styles.rating}>
              <b aria-hidden="true">★</b> {book.rating.toFixed(1)}
            </span>
          )}
          <button
            type="button"
            className={isFavorite ? styles.liked : ""}
            onClick={(event) => {
              event.stopPropagation();
              onFavorite(book);
            }}
            aria-label={
              (isFavorite ? "Remove " : "Add ") +
              book.title +
              (isFavorite ? " from favorites" : " to favorites")
            }
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ♥
          </button>
        </footer>
      </div>
    </article>
  );
}
export default memo(BookCard);
