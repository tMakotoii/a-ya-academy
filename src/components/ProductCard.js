import { Link } from 'react-router-dom'
import { imageFor, productMinPrice } from '../services/catalog'
import { formatPrice } from '../formatPrice'

export default function ProductCard({ product }) {
  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <img src={imageFor(product)} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{formatPrice(productMinPrice(product))}</p>
    </Link>
  )
}
