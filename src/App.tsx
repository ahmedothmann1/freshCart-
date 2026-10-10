import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { AccountPage } from './pages/AccountPage'
import { AddressesPage } from './pages/AddressesPage'
import { BrandsPage } from './pages/BrandsPage'
import { CartPage } from './pages/CartPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProductsPage } from './pages/ProductsPage'
import { RegisterPage } from './pages/RegisterPage'
import { SupportPage } from './pages/SupportPage'
import { WishlistPage } from './pages/WishlistPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/allorders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
