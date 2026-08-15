export const CATEGORY_LABELS = {
  electronics: "Electronics",
  clothes: "Clothes",
  books: "Books",
};

export function isPersonalProduct(product) {
  return product.isUserAdded === true;
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatPriceLabel(product) {
  return product.price == null ? "Open record" : formatPrice(product.price);
}

export function getProductMark(product) {
  const words = product.name.trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
