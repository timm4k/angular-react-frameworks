import styles from "./Header.module.css";

function Header({
  bookCount,
  favoriteCount,
  activeView,
  onViewChange,
  onAddClick,
}) {
  return (
    <header className={styles.header}>
      <a
        className={styles.brand}
        href="#library-title"
        aria-label="Noir Shelf home"
      >
        <span className={styles.mark}>N</span>
        <span>
          NOIR <i>SHELF</i>
        </span>
      </a>
      <nav className={styles.nav} aria-label="Library views">
        <button
          className={activeView === "catalog" ? styles.active : ""}
          onClick={() => onViewChange("catalog")}
        >
          Catalog <span>{bookCount}</span>
        </button>
        <button
          className={activeView === "favorites" ? styles.active : ""}
          onClick={() => onViewChange("favorites")}
        >
          Favorites <span>{favoriteCount}</span>
        </button>
      </nav>
      <button className={styles.addButton} type="button" onClick={onAddClick}>
        <span aria-hidden="true">＋</span> Add book
      </button>
    </header>
  );
}
export default Header;
