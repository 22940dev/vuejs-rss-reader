<template>
  <div>
    <p style="font-size: 32px; text-align: center">{{ feed.title }}</p>
    <p style="font-size: 16px; text-align: center" class="pb-5">{{ feed.url }}</p>
    <div v-show="error.length > 0">
      <b-message type="is-danger" class="custom-shadow">
        <b>Error:</b> Exception while loading or parsing Feed.<br><br>
        <b>Error Message:</b> {{ error }}
      </b-message>
    </div>
    <b-message v-show="loading" v-for="i in 10" :key="i" :closable="false" class="custom-shadow">
      <template #header>
        <b-skeleton width="300px" :animated="true">Loading</b-skeleton>
      </template>
      <b-skeleton width="80%" :animated="true"></b-skeleton>
      <b-skeleton width="70%" :animated="true"></b-skeleton>
      <b-skeleton width="85%" :animated="true"></b-skeleton>
      <b-skeleton width="80%" :animated="true"></b-skeleton>
    </b-message>
    <b-message v-show="!loading" v-for="item in feedItems" :key="item.guid" :closable="false" class="custom-shadow">
      <template #header>
        <b-tag v-show="item.pubDate">{{ item.pubDate | moment("L LTS") }}</b-tag>
        {{ item.title }}
      </template>
      {{ item.contentSnippet }}
      <br>
      <br>
      <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.link }}</a>
    </b-message>
    <p style="font-size: 32px; text-align: center" class="pb-6" v-show="error.length === 0">-- End of feed --</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Item} from "rss-parser";
import {SavedFeed} from "@/types/SavedFeed";

export default Vue.extend({
  name: 'Feed',
  props: {
    feed: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    error: {
      type: String,
      required: true
    }
  },
  data: () => ({
    feedItems: [] as Item[],
  }),
  created() {
    this.feedItems = this.feed.items ?? [];
  },
  watch: {
    feed: function(newFeed: SavedFeed){
      this.feedItems = newFeed.items ?? [];
      document.documentElement.scrollTop = 0;
    },
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
