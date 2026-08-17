import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Layout } from "./components/Layout";
import { ContactsPage } from "./features/contacts/ContactsPage";
import { ProductsPage } from "./features/products/ProductsPage";
import { TasksPage } from "./features/tasks/TasksPage";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="*" element={<Navigate to="/contacts" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
