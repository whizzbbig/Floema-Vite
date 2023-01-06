export const prismicHelpersLinks = (doc) => {
  if (doc.type === 'product') {
    return `/product/${doc.uid}/`
  } else {
    return `/${doc.uid}/`
  }
}
