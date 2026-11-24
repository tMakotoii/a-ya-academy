import { Link } from 'react-router-dom'

export default function NotFoundProduct() {
  return (
    <section>
      <h1>Товар не найден</h1>
      <Link to="/">Вернуться в каталог</Link>
    </section>
  )
}
