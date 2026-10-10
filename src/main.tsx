import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { WishlistProvider } from './context/WishlistContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
          <Toaster position="top-right" />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
