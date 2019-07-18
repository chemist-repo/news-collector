import Vue from 'vue'
import Vuex from 'vuex'
import Parser from 'rss-parser'
import { Loading } from 'quasar'

import ls from '../plugins/ls'

Vue.use(Vuex)

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'
const parser = new Parser()

const getRssSources = (url, proxy) => {
  return new Promise((resolve, reject) => {
    parser.parseURL(CORS_PROXY + url, (err, feed) => {
      if (err) {
        console.warn(err)
        reject(err)
      } else {
        resolve(
          feed.items.map(item => {
            const source = {}
            Object.entries(feed)
              .filter(([ key, value ]) => key && value && key !== 'items')
              .map(([ key, value ]) => {
                console.log(key)
                source[key] = value
                return [ key, value ]
              })
            return {
              ...item,
              source
            }
          })
        )
      }
    })
  })
}

export default function () {
  const Store = new Vuex.Store({
    state: {
      sources: ls.get('sources') || [],
      feed: [],
      imageDisabled: ls.get('imageDisabled') || false
    },
    mutations: {
      SET_SOURCES (state, source) {
        state.sources.push(source)
        ls.set('sources', state.sources)
      },
      REMOVE_SOURCE (state, index) {
        state.sources.splice(index, 1)
        ls.set('sources', state.sources)
      },
      SET_FEED (state, feed) {
        state.feed = feed.reduce((a, b) => a.concat(b), [])
      },
      TOGGLE_IMAGE_ALLOWED (state, payload) {
        state.imageDisabled = payload
        ls.set('imageDisabled', state.imageDisabled)
      }
    },
    getters: {
      GET_SOURCES (state) {
        return state.sources
      },
      GET_FEED (state) {
        return state.feed
      }
    },
    actions: {
      getRssContents ({ state, commit }) {
        Loading.show()
        const promises = state.sources.map(item => getRssSources(item.url))
        return new Promise((resolve, reject) => {
          Promise.all(promises).then(feed => {
            commit('SET_FEED', feed)
            resolve(feed)
          }).catch(err => {
            reject(err)
          }).finally(() => {
            Loading.hide()
          })
        })
      }
    }
  })

  return Store
}
