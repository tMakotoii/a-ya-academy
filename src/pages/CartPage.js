import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../formatPrice'
import { useCart } from '../state/CartContext'

export default function CartPage() {
  const cart = useCart()
  const [code, setCode] = useState('')
  const [promo, setPromo] = useState(false)
  const [message, setMessage] = useState('')
  const discount = promo ? cart.total * 0.1 : 0

  const apply = () => {
    if (code.trim().toUpperCase() === 'SALE10') {
      setPromo(true)
      setMessage('Промокод применён: скидка 10%.')
    } else {
      setPromo(false)
      setMessage('Промокод не найден.')
    }
  }

  return (
    <>
      <h1>Корзина</h1>
      {!cart.items.length ? (
        <p>
          Корзина пока пуста. <Link to="/">Перейти к покупкам</Link>
        </p>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.key}>
                <img src={item.image} alt={item.name} />
                <div className="cart-info">
                  <Link to={`/product/${item.productId}?color=${item.colorId}&size=${item.sizeId}`}>{item.name}</Link>
                  <p>
                    {item.colorName}, размер {item.sizeName}
                  </p>
                  <p>
                    {formatPrice(item.price)} за шт. · сумма{' '}
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <div className="quantity">
                  <button
                    aria-label="Уменьшить количество"
                    disabled={item.quantity === 1}
                    onClick={() => cart.setQuantity(item.key, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    aria-label="Увеличить количество"
                    onClick={() => cart.setQuantity(item.key, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove"
                    onClick={() => cart.remove(item.key)}
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="summary">
            <label>
              Промокод{' '}
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="SALE10"
              />
            </label>
            <button onClick={apply}>Применить</button>
            {message && <p role="status">{message}</p>}
            {promo && <p>Скидка: −{formatPrice(discount)}</p>}
            <h2>Итого: {formatPrice(cart.total - discount)}</h2>
          </div>
        </>
      )}
    </>
  )
}
