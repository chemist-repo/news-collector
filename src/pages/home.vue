<template>
  <q-page class="q-pa-lg">
    <div v-if="feed.length" class="row q-col-gutter-x-lg q-col-gutter-y-lg">
      <div
        v-for="(item, i) in feed"
        :key="`item-${i}`"
        class="col-md-3 col-sm-12"
      >
        <q-card>
          <q-img
            v-if="!imageDisabled"
            placeholder-src="assets/placeholder.png"
            :src="getImage(item)"
            :ratio="2/1"
          />

          <q-separator v-if="!imageDisabled" />

          <q-card-section>
            <div class="text-h6">{{ item.title }}</div>
          </q-card-section>

          <q-separator v-if="item.author" />

          <q-card-section v-if="item.author">
            <div class="text-subtitle2 text-weight-bold">{{ item.author }}</div>
          </q-card-section>

          <q-separator v-if="item.content" />

          <q-card-section v-if="item.content">
            <div class="text-body1" v-html="$sanitize(item.content)" />
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn
              type="a"
              :href="item.link"
              color="secondary"
              target="_blank"
            >View article</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-card v-else>
      <q-card-section>
        <div class="text-h4">Oops, no find items...</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6">To display the news, add at least one source or change filter settings.</div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          @click="OPEN_MENU"
          class="full-width"
          color="secondary"
          label="Add first source"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'home-page',
  computed: {
    ...mapState({
      imageDisabled: state => state.imageDisabled,
      feed: state => state.feed
    })
  },
  methods: {
    ...mapMutations({
      OPEN_MENU: 'OPEN_MENU'
    }),
    getImage (item) {
      if (item.enclosure) {
        return item.enclosure.url
      }
      return null
    }
  }
}
</script>
