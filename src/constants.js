export const OPTIONS_SANITIZE_TEXT_EDITOR = {
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'img',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span', 'font', 'u'],
  allowedAttributes: {
    '*': ['style'],
    img: ['src', 'alt'],
    font: ['color', 'size', 'face']
  },
  transformTags: {
    'img': (tagName, attribs) => {
      return {
        tagName,
        attribs: {
          ...attribs,
          style: 'max-width: 100%; width: 100%;'
        }
      }
    }
  }
}
