import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'

const KEY = 'mini-catalog-cart-v1'
const CartContext = createContext(null)

const itemKey = ({ productId, colorId, sizeId }) => [productId, colorId, sizeId].join(':')

const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]')

    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(
        (item) =>
          item &&
          Number.isFinite(Number(item.productId)) &&
          Number.isFinite(Number(item.colorId)) &&
          Number.isFinite(Number(item.sizeId)) &&
          Number.isFinite(Number(item.price)) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          typeof item.name === 'string' &&
          typeof item.colorName === 'string' &&
          typeof item.sizeName === 'string',
      )
      .map((item) => ({
        name: item.name,
        colorName: item.colorName,
        sizeName: item.sizeName,
        image: item.image,
        quantity: item.quantity,
        productId: Number(item.productId),
        colorId: Number(item.colorId),
        sizeId: Number(item.sizeId),
        price: Number(item.price),
      }))
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = itemKey(action.item)
      const existing = state.find((item) => itemKey(item) === key)

      if (existing) {
        return state.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...state, { ...action.item, quantity: 1 }]
    }

    case 'quantity':
      return state.map((item) =>
        itemKey(item) === action.key
          ? {
              ...item,
              quantity: Math.max(1, Math.floor(action.quantity) || 1),
            }
          : item,
      )

    case 'remove':
      return state.filter((item) => itemKey(item) !== action.key)

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
    }
  }, [items])

  const value = {
    items: items.map((item) => ({ ...item, key: itemKey(item) })),
    add: (item) => dispatch({ type: 'add', item }),
    setQuantity: (key, quantity) => dispatch({ type: 'quantity', key, quantity }),
    remove: (key) => dispatch({ type: 'remove', key }),
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
