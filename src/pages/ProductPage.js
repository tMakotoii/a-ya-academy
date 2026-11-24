import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import NotFoundProduct from '../components/NotFoundProduct'
import ProductGallery from '../components/ProductGallery'
import { getProduct, getSizes } from '../services/api'
import { formatPrice } from '../formatPrice'
import { useCart } from '../state/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  return <ProductDetails key={id} id={id} />
}

function ProductDetails({ id }) {
  const [search, setSearch] = useSearchParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sizes, setSizes] = useState([])
  const cart = useCart()

  useEffect(() => {
    let active = true

    Promise.all([getProduct(id), getSizes()])
      .then(([product, sizes]) => {
        if (!active) return
        setProduct(product)
        setSizes(sizes)
      })
      .catch((requestError) => {
        if (active && requestError.message !== 'getProduct: Product not found') {
          setError('Не удалось загрузить товар. Попробуйте позже.')
        }
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [id])

  const color = product?.colors.find((item) => String(item.id) === search.get('color'))
    ?? product?.colors[0]
  const size = sizes.find(
    (item) => String(item.id) === search.get('size') && color?.sizes.includes(item.id),
  )

  const selectSize = (sizeId) => {
    const next = new URLSearchParams(search)
    next.set('color', String(color.id))
    next.set('size', String(sizeId))
    setSearch(next, { replace: true })
  }

  const selectColor = (value) => {
    if (value === color.id) return

    const next = new URLSearchParams(search)
    next.set('color', String(value))
    next.delete('size')
    setSearch(next, { replace: true })
  }

  if (loading) {
    return <p role="status">Загрузка товара…</p>
  }

  if (error) {
    return (
      <>
        <p role="alert">{error}</p>
        <Link to="/">В каталог</Link>
      </>
    )
  }

  if (!product) {
    return <NotFoundProduct />
  }

  return (
    <>
      <Link to="/">← Каталог</Link>
      <div className="detail">
        <ProductGallery
          key={color.id}
          images={color.images}
          alt={`${product.name}, ${color.name}`}
        />

        <div>
          <h1>{product.name}</h1>
          <p>{product.brand}</p>
          <p className="price">{formatPrice(color.price)}</p>
          <p>{color.description}</p>

          <h2>Цвет</h2>
          <div className="options">
            {product.colors.map((item) => (
              <button
                key={item.id}
                aria-pressed={item.id === color.id}
                className={item.id === color.id ? 'selected' : ''}
                onClick={() => selectColor(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <h2>Размер</h2>
          <div className="options">
            {sizes.map((item) => (
              <button
                key={item.id}
                disabled={!color.sizes.includes(item.id)}
                aria-pressed={size?.id === item.id}
                className={size?.id === item.id ? 'selected' : ''}
                onClick={() => selectSize(item.id)}
              >
                {item.name} ({item.number})
              </button>
            ))}
          </div>
          {!color.sizes.length && <p>Этот цвет закончился во всех размерах.</p>}

          <button
            className="primary"
            disabled={!size}
            onClick={() =>
              cart.add({
                productId: product.id,
                colorId: color.id,
                sizeId: size.id,
                name: product.name,
                colorName: color.name,
                sizeName: size.name,
                price: Number(color.price),
                image: color.images[0] || '',
              })
            }
          >
            Добавить в корзину
          </button>
        </div>
      </div>
    </>
  )
}
