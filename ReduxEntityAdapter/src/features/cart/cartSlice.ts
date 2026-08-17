import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

const cartAdapter = createEntityAdapter<CartItem>();

interface CartSummary {
  totalItems: number;
  totalPrice: number;
}

function loadCart() {
  try {
    const raw = localStorage.getItem("cart");
    if (raw)
      return JSON.parse(raw) as ReturnType<typeof cartAdapter.getInitialState>;
  } catch {}
  return cartAdapter.getInitialState();
}

export const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addToCart: {
      reducer: cartAdapter.upsertOne,
      prepare: (productId: string, name: string, price: number) => ({
        payload: { id: nanoid(), productId, name, quantity: 1, price },
      }),
    },
    incrementQuantity(state, action: PayloadAction<string>) {
      const item = state.entities[action.payload];
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action: PayloadAction<string>) {
      const item = state.entities[action.payload];
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart: cartAdapter.removeOne,
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const { selectAll: selectAllCartItems } = cartAdapter.getSelectors(
  (state: { cart: ReturnType<typeof cartReducer> }) => state.cart,
);

export const selectCartSummary = createSelector(
  [selectAllCartItems],
  (items): CartSummary => {
    return items.reduce(
      (acc, item) => ({
        totalItems: acc.totalItems + item.quantity,
        totalPrice: acc.totalPrice + item.price * item.quantity,
      }),
      { totalItems: 0, totalPrice: 0 },
    );
  },
);

export const selectCartProductIds = createSelector(
  [selectAllCartItems],
  (items) => items.map((i) => i.productId),
);
