export const productMinPrice = (product) => Math.min(...product.colors.map((color) => Number(color.price)))
export const productAvailable = (product) => product.colors.some((color) => color.sizes.length > 0)
export const imageFor = (product) => product.colors.find((color) => color.images.length)?.images[0] || ''
