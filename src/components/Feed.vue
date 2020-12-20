<template>
  <div>
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
        <b-tag>{{ item.channelTitle }}</b-tag><b-tag v-show="item.pubDate">{{ item.pubDate | moment("L LTS") }}</b-tag>
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
import Parser, {Item} from "rss-parser";
import {SavedFeed} from "@/types/SavedFeed";

export default Vue.extend({
  name: 'Feed',
  props: {
    feedId: {
      type: Number,
      required: true
    },
  },
  data: () => ({
      loading: true,
      parser: new Parser() as Parser,
      feedItems: [] as Item[]
  }),
  created(){
    this.loadFeed();
  },
  methods: {
    loadFeed(){
      this.feedItems = [];
      this.loading = true;
      const feeds: SavedFeed[] = JSON.parse(localStorage.getItem('feeds') ?? '[]');

      const url = feeds[feeds.findIndex((v) => v.id === this.feedId)].url;

      this.parser.parseURL("https://dawn-mode-a8ed.irequire.workers.dev/?" + url).then((result) => {
        result.items.forEach((item) => {
          item.channelTitle = result.title;
          this.feedItems.push(item);
        })
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  watch: {
    feedId: function(newVal, oldVal){
      this.loadFeed();
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
