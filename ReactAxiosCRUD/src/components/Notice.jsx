import styles from "../styles/Notice.module.css";

function Notice({ notice, onDismiss }) {
  if (!notice) return null;
  return (
    <div
      className={`${styles.notice} ${notice.type === "error" ? styles.error : ""}`}
      role={notice.type === "error" ? "alert" : "status"}
    >
      <span aria-hidden="true">{notice.type === "error" ? "!" : "✓"}</span>
      <p>{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export default Notice;
