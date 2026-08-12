import styles from "./LibraryControls.module.css";

function LibraryControls({ filters, genres, resultCount, onChange }) {
  return (
    <section
      className={styles.controls}
      aria-label="Search, filter, and sort books"
    >
      <label className={styles.search}>
        <span aria-hidden="true">⌕</span>
        <span className={styles.srOnly}>Search the Open Library catalog</span>
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          placeholder="Search title, author, or subject"
        />
      </label>
      <label>
        <span className={styles.srOnly}>Genre</span>
        <select
          value={filters.genre}
          onChange={(event) => onChange({ genre: event.target.value })}
        >
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </label>
      <label>
        <span className={styles.srOnly}>Sort books</span>
        <select
          value={filters.sortBy}
          onChange={(event) => onChange({ sortBy: event.target.value })}
        >
          <option value="relevance">Most relevant</option>
          <option value="rating">Highest rated</option>
          <option value="year">Newest published</option>
          <option value="title">Title A–Z</option>
          <option value="author">Author A–Z</option>
        </select>
      </label>
      <span className={styles.result}>{resultCount} results</span>
    </section>
  );
}
export default LibraryControls;
