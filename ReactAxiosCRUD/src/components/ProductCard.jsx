import { memo } from "react";
import ProductImage from "./ProductImage";
import {
  CATEGORY_LABELS,
  formatPriceLabel,
  isPersonalProduct,
} from "../utils/product";
import styles from "../styles/ProductCard.module.css";

const ProductCard = memo(function ProductCard({
  product,
  onSelect,
  onEdit,
  onDelete,
  onToggleStock,
  busy,
}) {
  const isPersonal = isPersonalProduct(product);

  const openDetails = () => onSelect(product);
  const handleKeyDown = (event) => {
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      openDetails();
    }
  };

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex="0"
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      aria-label={`View details for ${product.name}`}
    >
      <ProductImage product={product} className={styles.visual} thumb />
      <span className={styles.category}>
        {CATEGORY_LABELS[product.category]}
      </span>
      <span className={styles.edition}>
        {isPersonal ? "YOUR PRODUCT" : product.source || "MIDNIGHT SELECTION"}
      </span>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <h3>{product.name}</h3>
          </div>
          <strong className={styles.price}>{formatPriceLabel(product)}</strong>
        </div>
        <p className={styles.description}>
          {product.description || "No description has been added yet"}
        </p>
        <div className={styles.footer}>
          <button
            type="button"
            className={product.inStock ? styles.inStock : styles.outOfStock}
            onClick={(event) => {
              event.stopPropagation();
              onToggleStock(product);
            }}
            disabled={busy}
            title={
              product.inStock ? "Mark as out of stock" : "Mark as in stock"
            }
            aria-pressed={product.inStock}
          >
            <i aria-hidden="true" />
            {product.inStock ? "In stock" : "Out of stock"}
          </button>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(product);
              }}
              disabled={busy}
            >
              Edit
            </button>
            <button
              className={styles.deleteButton}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(product);
              }}
              disabled={busy}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
