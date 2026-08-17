import { configureStore } from "@reduxjs/toolkit";
import { contactsReducer } from "@/features/contacts/contactsSlice";
import { productsReducer } from "@/features/products/productsSlice";
import { cartReducer } from "@/features/cart/cartSlice";
import { usersReducer } from "@/features/tasks/usersSlice";
import { tasksReducer } from "@/features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    products: productsReducer,
    cart: cartReducer,
    users: usersReducer,
    tasks: tasksReducer,
  },
});

let persistTimer: ReturnType<typeof setTimeout> | null = null;

store.subscribe(() => {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    const state = store.getState();
    localStorage.setItem("contacts", JSON.stringify(state.contacts));
    localStorage.setItem("cart", JSON.stringify(state.cart));
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, 300);
});
