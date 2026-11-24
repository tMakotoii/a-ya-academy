import { Link } from 'react-router-dom'
import { useCart } from '../state/CartContext'
import { formatPrice } from '../formatPrice'

export default function Header() {
  const cart = useCart()

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        Каталог одежды
      </Link>
      <Link className="cart-link" to="/cart">
        Корзина · {cart.count} шт. - {formatPrice(cart.total)}
      </Link>
    </header>
  )
}
