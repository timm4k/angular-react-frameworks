import { useEscapeKey } from "../hooks/useEscapeKey";
import styles from "../styles/DeleteDialog.module.css";

function DeleteDialog({ product, onCancel, onConfirm, deleting }) {
  useEscapeKey(onCancel, !deleting);

  return (
    <div className={styles.backdrop} role="presentation">
      <section
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <span className={styles.warning} aria-hidden="true">
          !
        </span>
        <p>Permanent action</p>
        <h2 id="delete-title">Remove {product.name}?</h2>
        <p id="delete-description" className={styles.description}>
          This product will be permanently removed from the Midnight Market
          database
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={onCancel} disabled={deleting}>
            Keep Product
          </button>
          <button
            className={styles.confirm}
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            autoFocus
          >
            {deleting ? "Removing…" : "Delete Product"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteDialog;
