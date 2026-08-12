import BookCard from "./BookCard";
import styles from "./BookList.module.css";

function BookList({ books, favorites, loading, onOpen, onFavorite }) {
  if (loading && !books.length)
    return (
      <div className={styles.loading} aria-live="polite">
        Searching the stacks…
      </div>
    );
  if (!books.length) {
    return (
      <div className={styles.empty}>
        <span aria-hidden="true">⌕</span>
        <h2>No books found</h2>
        <p>Try a different search, genre, or save a few favorites first</p>
      </div>
    );
  }
  return (
    <>
      {loading && <div className={styles.refreshing}>Updating catalog…</div>}
      <section className={styles.grid} aria-label="Books in the library">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={favorites.includes(book.id)}
            onOpen={onOpen}
            onFavorite={onFavorite}
          />
        ))}
      </section>
    </>
  );
}
export default BookList;
