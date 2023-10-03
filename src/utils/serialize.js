import { Text } from 'slate'
import escapeHtml from 'escape-html'

const serialize = node => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
      case 'paragraph':
        return `${children}<br>`
    // case 'quote':
    //   return `<blockquote><p>${children}</p></blockquote>`
    // case 'link':
    //   return `<a href="${escapeHtml(node.url)}">${children}</a>`
    default:
      return children
  }
};

export default serialize;