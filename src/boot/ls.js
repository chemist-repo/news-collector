import ls from '../plugins/ls'

export default async ({ Vue }) => {
  Vue.prototype.$ls = ls
}
