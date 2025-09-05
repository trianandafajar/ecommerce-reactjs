import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { store } from "@/app/store";
import HomePage from "@/pages/homePage";
import { Footer } from "@/components/foother";
import LoginPage from "@/pages/loginPage";
import ProductPage from "@/pages/productDetailPage";
import CartPage from "@/pages/cartPage";
import CheckoutPage from "./pages/checkoutPage";
import BookmarksPage from "./pages/bookmarkPage";

function App() {
  return (
    <Provider store={store}>
      <div className="font-sans antialiased">
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage/>} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
        </Routes>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
