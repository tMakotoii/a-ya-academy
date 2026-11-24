import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/api'
import { productAvailable, productMinPrice } from '../services/catalog'

export default function CatalogPage() {
  const [products, setProducts] = useState(null)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [available, setAvailable] = useState(false)
  const [sort, setSort] = useState('')

  useEffect(() => {
    let active = true

    getProducts()
      .then((value) => active && setProducts(value))
      .catch(() => {
        if (active) {
          setError('Не удалось загрузить каталог. Попробуйте обновить страницу.')
        }
      })

    return () => {
      active = false
    }
  }, [])

  const normalizedQuery = query.trim().toLocaleLowerCase('ru')
  const visibleProducts = (products ?? []).filter(
    (product) =>
      product.name.toLocaleLowerCase('ru').includes(normalizedQuery) &&
      (!available || productAvailable(product)),
  )

  if (sort) {
    const direction = sort === 'asc' ? 1 : -1
    visibleProducts.sort((a, b) => direction * (productMinPrice(a) - productMinPrice(b)))
  }

  return (
    <>
      <h1>Каталог</h1>
      <section className="filters">
        <input
          aria-label="Поиск по названию"
          placeholder="Найти товар"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={available}
            onChange={(event) => setAvailable(event.target.checked)}
          />{' '}
          В наличии
        </label>
        <select
          aria-label="Сортировка по цене"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="">Без сортировки</option>
          <option value="asc">Сначала дешевле</option>
          <option value="desc">Сначала дороже</option>
        </select>
      </section>

      {!products && !error ? (
        <p role="status">Загрузка каталога…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : visibleProducts.length ? (
        <div className="grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Ничего не найдено. Попробуйте изменить поиск или фильтры.</p>
      )}
    </>
  )
}
