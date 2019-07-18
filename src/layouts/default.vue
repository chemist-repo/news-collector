<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-secondary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <q-icon name="view_list" />
        </q-btn>

        <q-toolbar-title class="text-center">
          NEWS COLLECTOR
        </q-toolbar-title>
        <q-btn
          flat
          dense
          round
          @click="rightDrawerOpen = !rightDrawerOpen"
        >
          <q-icon name="settings" />
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-input
                @keyup.enter="onAddRss()"
                v-model="source"
                color="teal"
                label="Adds rss source"
              >
                <template v-slot:append>
                  <q-icon name="rss_feed" />
                </template>
              </q-input>
            </q-item-section>
            <q-item-section avatar>
              <q-btn @click="onAddRss()" round dense flat icon="add" />
            </q-item-section>
          </q-item>
          <q-item
            v-for="(item, index) in GET_SOURCES"
            :key="item.key"
          >
            <q-item-section>
              <q-item-label>{{ item.key }}</q-item-label>
              <q-item-label caption>
                <a class="block text-secondary text-strike ellipsis text-decoration-none" :href="item.url" target="_blank">
                  {{ item.url }}
                </a>
              </q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-btn @click="onConfirm(item, index)" round dense flat icon="clear" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      bordered
      side="right"
      content-class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list separator>
          <q-item>
            <q-item-section>
              <span class="text-h5">Settings</span>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-toggle
                :value="imageDisabled"
                @input="TOGGLE_IMAGE_ALLOWED"
                color="secondary"
                label="Disabled pictures"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-pull-to-refresh @refresh="refresh">
        <router-view />
      </q-pull-to-refresh>
    </q-page-container>

    <q-dialog v-model="confirm">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="rss_feed" color="secondary" text-color="white" />
          <span class="q-ml-sm">
            <span>Are you sure you want to delete the </span>
            <a
              class="text-secondary text-strike text-decoration-none"
              :href="buffer.url"
              target="_blank"
            >
              {{ buffer.key }}
            </a>
            <span>?</span>
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn @click="REMOVE_SOURCE(buffer.index)" label="Remove" color="negative" v-close-popup />
          <q-btn label="Cancel" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'default-layout',
  data () {
    return {
      source: '',
      buffer: {},
      leftDrawerOpen: this.$q.platform.is.desktop,
      rightDrawerOpen: false,
      confirm: false
    }
  },
  computed: {
    ...mapGetters({
      GET_SOURCES: 'GET_SOURCES',
      GET_FEED: 'GET_FEED'
    }),
    ...mapState({
      imageDisabled: state => state.imageDisabled
    })
  },
  watch: {
    GET_SOURCES: {
      handler () {
        return this.refresh()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      SET_SOURCES: 'SET_SOURCES',
      REMOVE_SOURCE: 'REMOVE_SOURCE',
      TOGGLE_IMAGE_ALLOWED: 'TOGGLE_IMAGE_ALLOWED'
    }),
    openURL,
    onAddRss () {
      if (this.source) {
        this.SET_SOURCES({
          url: this.source,
          key: this.getHostName(this.source)
        })
        this.source = ''
      }
    },
    onConfirm (item, index) {
      this.buffer = {
        ...item,
        index
      }
      this.confirm = true
    },
    getHostName (item) {
      try {
        return new URL(item).hostname
      } catch (err) {
        console.warn(err)
        return item
      }
    },
    async refresh (done) {
      try {
        await this.$store.dispatch('getRssContents')
        done()
      } catch (err) {
        console.log(err)
      }
    }
  },
  async created () {
    await this.$store.dispatch('getRssContents')
  }
}
</script>

<style>
</style>
