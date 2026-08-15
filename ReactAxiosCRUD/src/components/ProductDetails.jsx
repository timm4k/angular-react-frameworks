import ProductImage from "./ProductImage";
import {
  CATEGORY_LABELS,
  formatPriceLabel,
  isPersonalProduct,
} from "../utils/product";
import { useEscapeKey } from "../hooks/useEscapeKey";
import styles from "../styles/ProductDetails.module.css";

function ProductDetails({
  product,
  onClose,
  onEdit,
  onDelete,
  onToggleStock,
  busy,
}) {
  const isPersonal = isPersonalProduct(product);
  useEscapeKey(onClose);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
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
          aria-label="Close product details"
        >
          ×
        </button>
        <ProductImage product={product} className={styles.image} />
        <div className={styles.content}>
          <div className={styles.badges}>
            <span>{CATEGORY_LABELS[product.category]}</span>
            <span>
              {isPersonal
                ? "Your product"
                : product.source || "Midnight selection"}
            </span>
          </div>
          <h2 id="details-title">{product.name}</h2>
          <div className={styles.summary}>
            <strong>{formatPriceLabel(product)}</strong>
            <span
              className={
                product.inStock ? styles.available : styles.unavailable
              }
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
          <p className={styles.description}>
            {product.description || "No description has been added yet"}
          </p>

          <dl className={styles.metadata}>
            {product.author && (
              <div>
                <dt>Author</dt>
                <dd>{product.author}</dd>
              </div>
            )}
            {product.brand && (
              <div>
                <dt>Brand</dt>
                <dd>{product.brand}</dd>
              </div>
            )}
            {product.year && (
              <div>
                <dt>First published</dt>
                <dd>{product.year}</dd>
              </div>
            )}
            <div>
              <dt>Source</dt>
              <dd>
                {isPersonal
                  ? "Personal collection"
                  : product.source || "Midnight Market"}
              </dd>
            </div>
          </dl>

          {product.details?.length > 0 && (
            <div className={styles.tags}>
              {product.details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => onToggleStock(product)}
              disabled={busy}
            >
              {product.inStock ? "Mark as out of stock" : "Mark as in stock"}
            </button>
            <button
              type="button"
              onClick={() => onEdit(product)}
              disabled={busy}
            >
              Edit Product
            </button>
            <button
              className={styles.delete}
              type="button"
              onClick={() => onDelete(product)}
              disabled={busy}
            >
              Delete Product
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
