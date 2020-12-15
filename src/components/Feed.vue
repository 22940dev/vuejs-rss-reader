<template>
  <div>
    <div class="container" v-show="loading">
      <div class="columns pt-3">
        <div class="card">
          <div class="card-content">
            <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"></b-icon>
          </div>
        </div>
      </div>
    </div>
    <b-message v-show="!loading" v-for="item in feedItems" :key="item.guid" :closable="false">
      <template #header>
        <b-tag>{{ item.channelTitle }}</b-tag> {{ item.title }}
      </template>
      {{ item.contentSnippet }}
      <br>
      <br>
      <a :href="item.link">{{ item.link }}</a>
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

      this.parser.parseURL("https://cors-anywhere.herokuapp.com/" + url).then((result) => {
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
