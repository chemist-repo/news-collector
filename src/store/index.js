import Vue from 'vue'
import Vuex from 'vuex'
import Parser from 'rss-parser'
import { Loading } from 'quasar'

import ls from '../plugins/ls'
import { CORS_PROXY, POPULAR_FEEDS } from '../constants'

Vue.use(Vuex)

const parser = new Parser()

export default function () {
  const Store = new Vuex.Store({
    state: {
      proxy: ls.get('proxy') || CORS_PROXY,
      sources: ls.get('sources') || [],
      feed: ls.get('feed') || [],
      imageDisabled: ls.get('imageDisabled') || false,
      popular: ls.get('popular') || POPULAR_FEEDS,
      tags: ls.get('tags') || [],
      menu: false,
      settings: false
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
          .filter(item => {
            return !state.tags.length || !!state.tags.filter(tag => {
              return item.title.toLowerCase().includes(tag.toLowerCase()) || item.content.toLowerCase().includes(tag.toLowerCase())
            }).length
          })
        ls.set('feed', state.feed)
      },
      TOGGLE_IMAGE_ALLOWED (state, payload) {
        state.imageDisabled = payload
        ls.set('imageDisabled', state.imageDisabled)
      },
      CHANGE_TAGS (state, payload) {
        state.tags = payload
        ls.set('tags', state.tags)
      },
      OPEN_MENU (state) {
        state.menu = true
      },
      CLOSE_MENU (state) {
        state.menu = false
      },
      OPEN_SETTINGS (state) {
        state.settings = true
      },
      CLOSE_SETTINGS (state) {
        state.settings = false
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
      getRssContents ({ state, commit, dispatch }) {
        Loading.show()
        const promises = state.sources.map(item => dispatch('getRssSources', item.url))
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
      },
      getRssSources ({ state }, url) {
        return new Promise((resolve, reject) => {
          parser.parseURL(`${state.proxy}${url}`, (err, feed) => {
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
      },
      async changeTags ({ commit, dispatch }, tags) {
        commit('CHANGE_TAGS', tags)
        await dispatch('getRssContents')
      },
      toggleMenu ({ state, commit }) {
        if (state.menu) {
          commit('CLOSE_MENU')
        } else {
          commit('OPEN_MENU')
        }
      },
      toggleSettings ({ state, commit }) {
        if (state.settings) {
          commit('CLOSE_SETTINGS')
        } else {
          commit('OPEN_SETTINGS')
        }
      }
    }
  })

  return Store
}
