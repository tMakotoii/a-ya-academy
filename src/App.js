import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import PageLayout from './components/PageLayout'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import { CartProvider } from './state/CartContext'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index element={<CatalogPage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route
              path="*"
              element={
                <>
                  <h1>Страница не найдена</h1>
                  <Link to="/">На главную</Link>
                </>
              }
            />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
