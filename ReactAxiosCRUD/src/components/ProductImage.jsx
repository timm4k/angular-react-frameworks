import { useState } from "react";
import { getProductMark } from "../utils/product";
import { getCoverThumb } from "../utils/bookMetadata";
import EquipmentIcon from "./EquipmentIcon";
import styles from "../styles/ProductImage.module.css";

function iconTypeFor(product) {
  const name = product.name.toLowerCase();
  if (/\bprojector\b/.test(name)) return "projector";
  if (/\blight\b/.test(name)) return "light";
  if (/\b(gimbal|stabilizer|steady)\b/.test(name)) return "gimbal";
  if (/\b(slider|dolly)\b/.test(name)) return "slider";
  return "camera";
}

function ProductImage({ product, className = "", thumb = false }) {
  const [failed, setFailed] = useState(false);
  const hasImage = product.image && !failed;
  const isElectronics = product.category === "electronics";

  return (
    <div className={`${styles.frame} ${styles[product.category]} ${className}`}>
      {hasImage ? (
        <img
          src={thumb ? getCoverThumb(product.image) : product.image}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : isElectronics ? (
        <EquipmentIcon type={iconTypeFor(product)} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {getProductMark(product)}
        </span>
      )}
    </div>
  );
}

export default ProductImage;
