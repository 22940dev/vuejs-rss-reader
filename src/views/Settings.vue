<template>
  <div class="card">
    <div class="card-content">
      <b-field label="Add Feed">
        <b-input placeholder="URL" type="url" v-model="addFeedURL"></b-input>
      </b-field>
      <b-button type="is-primary" @click="addFeed(addFeedURL)">Add</b-button>
      <hr>
      <h1>Feeds</h1>
      <b-field grouped group-multiline>
        <div class="control" v-for="feed in feeds" :key="feed.id">
          <b-tag type="is-primary" attached close-type='is-danger' aria-close-label="Close tag" closable @close="removeFeed(feed.url)">
            {{ feed.url }}
          </b-tag>
        </div>
      </b-field>
    </div>
  </div>
</template>
<script lang="ts">

import Vue from "vue";
import {SavedFeed} from "@/types/SavedFeed";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    addFeedURL: "",
    feeds: [] as SavedFeed[],
  }),
  created() {
    this.feeds = JSON.parse(localStorage.getItem('feeds') ?? '[]');
  },
  methods: {
    addFeed(url: string){
      if(this.feeds.findIndex((value => value.url === url)) > -1){
        return;
      }
      this.addFeedURL = "";
      this.feeds.push({
        id: this.feeds.length,
        url
      });
      localStorage.setItem('feeds', JSON.stringify(this.feeds));
    },
    removeFeed(url: string) {
      const index = this.feeds.findIndex((value: SavedFeed) => value.url === url);
      this.feeds.splice(index, 1);
      localStorage.setItem('feeds', JSON.stringify(this.feeds));
    }
  }
});
</script>