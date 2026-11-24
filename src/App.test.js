import { createRoot } from 'react-dom/client'
import { act, Simulate } from 'react-dom/test-utils'
import App from './App'

let container
let root

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true
  jest.useFakeTimers()
  localStorage.clear()
  container = document.createElement('div')
  document.body.append(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  jest.useRealTimers()
  delete global.IS_REACT_ACT_ENVIRONMENT
})

async function open(path) {
  window.history.replaceState(null, '', path)
  root = createRoot(container)
  act(() => root.render(<App />))
  await act(async () => jest.advanceTimersByTime(250))
}

function button(label) {
  return [...container.querySelectorAll('button')].find(
    (element) => (element.getAttribute('aria-label') || element.textContent) === label,
  )
}

function click(element) {
  act(() => element.click())
}

test('a cart line can be changed and removed after restoring it from localStorage', async () => {
  await open('/product/1?color=2&size=4')
  const add = button('Добавить в корзину')
  expect(add.disabled).toBe(false)
  click(add)
  click(add)
  expect(container.querySelector('.cart-link').textContent).toContain('2 шт.')

  act(() => root.unmount())
  await open('/cart')
  expect(container.querySelector('.cart-info').textContent).toContain('белый, размер L')
  expect(container.querySelector('.quantity span').textContent).toBe('2')
  change(container.querySelector('.summary input'), ' sale10 ')
  click(button('Применить'))
  expect(container.querySelector('.summary h2').textContent).toContain('225')
  click(button('Уменьшить количество'))
  expect(container.querySelector('.quantity span').textContent).toBe('1')
  expect(button('Уменьшить количество').disabled).toBe(true)
  click(button('Увеличить количество'))
  expect(container.querySelector('.quantity span').textContent).toBe('2')
  click(button('Удалить'))
  expect(container.textContent).toContain('Корзина пока пуста')
  expect(JSON.parse(localStorage.getItem('mini-catalog-cart-v1'))).toEqual([])
})

test('changing to an unavailable color resets the gallery and disables every size', async () => {
  await open('/product/1?color=1&size=1')
  click(button('Фото 2'))
  expect(container.querySelector('.hero-image').getAttribute('src')).toContain('black_back')
  click(button('серый'))
  expect(window.location.search).toBe('?color=3')
  expect(container.querySelector('.hero-image').getAttribute('src')).toContain('gray_front')
  expect(container.querySelectorAll('.options button:disabled')).toHaveLength(6)
  expect(button('Добавить в корзину').disabled).toBe(true)
})

function change(element, value) {
  act(() => {
    element.value = value
    Simulate.change(element)
  })
}

test('the catalog filters by availability and name and sorts by minimum color price', async () => {
  await open('/')
  const names = () => [...container.querySelectorAll('.product-card h2')].map(
    (heading) => heading.textContent,
  )

  expect(names()).toHaveLength(6)
  change(container.querySelector('select'), 'asc')
  expect(names()).toEqual(['Кепка', 'Майка', 'Футболка', 'Шорты', 'Худи', 'Пальто'])
  change(container.querySelector('select'), 'desc')
  expect(names()[0]).toBe('Пальто')
  click(container.querySelector('input[type="checkbox"]'))
  expect(names()).not.toContain('Пальто')
  change(container.querySelector('[aria-label="Поиск по названию"]'), ' ХУДИ ')
  expect(names()).toEqual(['Худи'])
})

test('an unknown product shows a way back to the catalog', async () => {
  await open('/product/999')
  expect(container.querySelector('main h1').textContent).toBe('Товар не найден')
  expect(container.querySelector('main a').getAttribute('href')).toBe('/')
})
