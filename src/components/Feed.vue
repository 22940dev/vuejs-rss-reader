<template>
  <div>
    <b-message v-show="error.length > 0" type="is-danger">
      <b>{{ feed.url }}</b> could not be loaded or parsed. See the message below for details.
    </b-message>
    <b-message v-show="error.length > 0" type="is-danger">
      <b>Error</b> {{ error }}
    </b-message>
    <b-message v-show="loading" v-for="i in 10" :key="i" :closable="false">
      <template #header>
        <b-skeleton width="300px" :animated="true">Loading</b-skeleton>
      </template>
      <b-skeleton width="80%" :animated="true"></b-skeleton>
      <b-skeleton width="70%" :animated="true"></b-skeleton>
      <b-skeleton width="85%" :animated="true"></b-skeleton>
      <b-skeleton width="80%" :animated="true"></b-skeleton>
    </b-message>
    <b-message v-show="!loading" v-for="item in feedItems" :key="item.guid" :closable="false">
      <template #header>
        <b-tag v-show="item.pubDate">{{ item.pubDate | moment("L LTS") }}</b-tag>
        {{ item.title }}
      </template>
      {{ item.contentSnippet }}
      <br>
      <br>
      <a :href="item.link" target="_blank" rel="noopener noreferrer">{{ item.link }}</a>
    </b-message>
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
  watch: {
    feed: function(newFeed: SavedFeed){
      this.feedItems = newFeed.items ?? [];
    },
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
