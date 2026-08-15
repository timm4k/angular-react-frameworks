import styles from "../styles/Header.module.css";

function Header({ onAdd }) {
  return (
    <header className={styles.header}>
      <a
        className={styles.brand}
        href="#catalog"
        aria-label="Midnight Market home"
      >
        <span className={styles.logo}>MM</span>
        <span>
          <strong>Midnight Market</strong>
          <small>Curated goods after dark</small>
        </span>
      </a>
      <button className={styles.addButton} type="button" onClick={onAdd}>
        <span aria-hidden="true">＋</span> Add Product
      </button>
    </header>
  );
}

export default Header;
