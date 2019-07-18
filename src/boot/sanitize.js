import sanitizeHtml from 'sanitize-html'
import { OPTIONS_SANITIZE_TEXT_EDITOR } from '../constants'

export default async ({ Vue }) => {
  Vue.prototype.$sanitize = (HTML, options = OPTIONS_SANITIZE_TEXT_EDITOR) => {
    try {
      return sanitizeHtml(HTML, options)
    } catch (err) {
      console.warn(err)

      return ''
    }
  }
}
