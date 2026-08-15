import styles from "../styles/CatalogToolbar.module.css";

const categories = [
  ["all", "All products"],
  ["electronics", "Electronics"],
  ["clothes", "Clothes"],
  ["books", "Books"],
];

function CatalogToolbar({ query, onQueryChange, category, onCategoryChange }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={styles.searchIcon} aria-hidden="true">
            ⌕
          </span>
          <span className="srOnly">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search title, author, brand or product"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </label>
        <div className={styles.filters} aria-label="Filter by category">
          {categories.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={category === value ? styles.active : ""}
              onClick={() => onCategoryChange(value)}
              aria-pressed={category === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CatalogToolbar;
