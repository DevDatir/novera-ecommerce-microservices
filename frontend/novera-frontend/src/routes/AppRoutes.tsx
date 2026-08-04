import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import ProductDetailsPage from "../pages/ProductDetails/ProductDetailsPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ProductsPage from "../pages/Product/ProductPage";
import CartPage from "../pages/Cart/CartPage";
import AddressPage from "../components/address/AddressPage";
import CheckoutPage from "../components/checkout/CheckoutPage";
import PaymentPage from "../pages/Payment/PaymentPage";

import OrdersPage from "../pages/Orders/OrdersPage";
import OrderDetailsPage from "../pages/Orders/OrderDetailsPage";

const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<HomePage />} />

        <Route
            path="/products"
            element={<ProductsPage/>}
        />

        <Route
            path="/products/:id/:slug"
            element={<ProductDetailsPage/>}
        />

        <Route
        path="/cart"
        element={
            <ProtectedRoute>
            <CartPage />
            </ProtectedRoute>
        }
        />

        <Route
            path="/payment/:orderId"
            element={
                <ProtectedRoute>
                    <PaymentPage />
                </ProtectedRoute>
            }
        />

        <Route
        path="/orders"
        element={
            <ProtectedRoute>
            <OrdersPage />
            </ProtectedRoute>
        }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
              <ProtectedRoute>
                  <CheckoutPage />
              </ProtectedRoute>
          }
        />

        {/* <Route
        path="/profile"
        element={
            <ProtectedRoute>
            <ProfilePage />
            </ProtectedRoute>
        }
        /> */}

        <Route
            path="/addresses"
            element={
                <ProtectedRoute>
                    <AddressPage />
                </ProtectedRoute>
            }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

      </Route>

    </Routes>
  );
};

export default AppRoutes;