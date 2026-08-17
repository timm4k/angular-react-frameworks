import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/hooks";
import { createSelector } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export type SortField = "name" | "price";
export type SortOrder = "asc" | "desc";

interface ProductsState {
  filterCategory: string;
  onlyInStock: boolean;
  sortField: SortField;
  sortOrder: SortOrder;
  ids: string[];
  entities: Record<string, Product>;
}

const productsAdapter = createEntityAdapter<Product>();

const initialProductsState: ProductsState = {
  ...productsAdapter.getInitialState(),
  filterCategory: "all",
  onlyInStock: false,
  sortField: "name",
  sortOrder: "asc",
};

const SEED_PRODUCTS: Product[] = [
  {
    id: nanoid(),
    name: "Mechanical Keyboard",
    price: 129.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Wireless Mouse",
    price: 49.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "USB-C Hub",
    price: 34.99,
    category: "Electronics",
    inStock: false,
  },
  {
    id: nanoid(),
    name: "Monitor Stand",
    price: 59.99,
    category: "Accessories",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Desk Lamp",
    price: 29.99,
    category: "Accessories",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Notebook Set",
    price: 14.99,
    category: "Stationery",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Gel Pen Pack",
    price: 8.99,
    category: "Stationery",
    inStock: false,
  },
  {
    id: nanoid(),
    name: "Ergonomic Chair",
    price: 399.99,
    category: "Furniture",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Standing Desk",
    price: 549.99,
    category: "Furniture",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Cable Organizer",
    price: 19.99,
    category: "Accessories",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Noise-Canceling Headphones",
    price: 199.99,
    category: "Electronics",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Webcam HD",
    price: 79.99,
    category: "Electronics",
    inStock: false,
  },
  {
    id: nanoid(),
    name: "Whiteboard Marker Set",
    price: 12.99,
    category: "Stationery",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Footrest",
    price: 44.99,
    category: "Furniture",
    inStock: true,
  },
  {
    id: nanoid(),
    name: "Sticky Notes",
    price: 5.99,
    category: "Stationery",
    inStock: true,
  },
];

const seededState = productsAdapter.setAll(initialProductsState, SEED_PRODUCTS);

export const productsSlice = createSlice({
  name: "products",
  initialState: seededState,
  reducers: {
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.filterCategory = action.payload;
    },
    toggleInStockFilter(state) {
      state.onlyInStock = !state.onlyInStock;
    },
    setSortField(state, action: PayloadAction<SortField>) {
      state.sortField = action.payload;
    },
    toggleSortOrder(state) {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
    },
    randomizeStock(state, action: PayloadAction<string[]>) {
      const cartIds = new Set(action.payload);
      state.ids.forEach((id) => {
        if (cartIds.has(id)) {
          state.entities[id].inStock = true;
        } else {
          state.entities[id].inStock = Math.random() > 0.4;
        }
      });
    },
    setInStock(state, action: PayloadAction<{ id: string; inStock: boolean }>) {
      const product = state.entities[action.payload.id];
      if (product) product.inStock = action.payload.inStock;
    },
  },
});

export const {
  setCategoryFilter,
  toggleInStockFilter,
  setSortField,
  toggleSortOrder,
  randomizeStock,
  setInStock,
} = productsSlice.actions;
export const productsReducer = productsSlice.reducer;

const { selectAll: selectAllProducts } = productsAdapter.getSelectors(
  (state: { products: ReturnType<typeof productsReducer> }) => state.products,
);

const selectProductFilterCategory = (state: RootState) =>
  state.products.filterCategory;
const selectProductOnlyInStock = (state: RootState) =>
  state.products.onlyInStock;
const selectProductSortField = (state: RootState) => state.products.sortField;
const selectProductSortOrder = (state: RootState) => state.products.sortOrder;

export {
  selectProductFilterCategory,
  selectProductOnlyInStock,
  selectProductSortField,
  selectProductSortOrder,
};

const selectFilteredProducts = createSelector(
  [selectAllProducts, selectProductFilterCategory, selectProductOnlyInStock],
  (products, category, onlyInStock) => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (onlyInStock && !p.inStock) return false;
      return true;
    });
  },
);

export const selectSortedProducts = createSelector(
  [selectFilteredProducts, selectProductSortField, selectProductSortOrder],
  (products, sortField, sortOrder) => {
    return [...products].sort((a, b) => {
      const cmp =
        sortField === "name" ? a.name.localeCompare(b.name) : a.price - b.price;
      return sortOrder === "asc" ? cmp : -cmp;
    });
  },
);

export const selectUniqueCategories = createSelector(
  [selectAllProducts],
  (products) => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set).sort();
  },
);
