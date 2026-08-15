import { CATEGORY_LABELS } from "../utils/product";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductList.module.css";

function emptyStateMessage({ query, category }) {
  if (query)
    return {
      title: "No matching products",
      hint: "Try another title, author, brand or category",
    };
  if (category !== "all")
    return {
      title: "Nothing here yet",
      hint: `No ${CATEGORY_LABELS[category]} in the collection yet — add the first one`,
    };
  return {
    title: "The collection is empty",
    hint: "Add the first product to begin your midnight collection",
  };
}

function ProductList({
  products,
  loading,
  error,
  query,
  category,
  onSelect,
  onEdit,
  onDelete,
  onToggleStock,
  onRetry,
  busyId,
}) {
  if (loading) {
    return (
      <div
        className={styles.grid}
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <div className={styles.skeleton} key={index} />
        ))}
      </div>
    );
  }

  if (error && !products.length) {
    return (
      <div className={styles.empty} role="alert">
        <span aria-hidden="true">!</span>
        <h3>Cannot reach the server</h3>
        <p>
          Run <code>npm run server</code> (json-server on port 3001) to start
          the API, then retry
        </p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!products.length) {
    const message = emptyStateMessage({ query, category });
    return (
      <div className={styles.empty}>
        <span aria-hidden="true">◇</span>
        <h3>{message.title}</h3>
        <p>{message.hint}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStock={onToggleStock}
          busy={busyId === product.id}
        />
      ))}
    </div>
  );
}

export default ProductList;
