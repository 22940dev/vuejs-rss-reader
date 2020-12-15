<template>
  <div id="app">
    <div class="container">
      <div class="columns pt-5">
        <div class="column is-3">
          <div class="card">
            <div class="card-content">
              <b-menu>
                <b-menu-list label="Actions">
                  <b-menu-item label="Settings" icon-pack="fas" icon="cog" tag="router-link" to="/settings" :active="$route.name === 'Settings'"></b-menu-item>
                </b-menu-list>
                <b-menu-list label="Feeds">
                  <b-menu-item v-for="feed in savedFeeds" :key="feed.id" :label="feed.title" icon-pack="fas" icon="list" tag="router-link" :to="'/feed/' + feed.id" :active="Number($route.params.feedId) === feed.id"></b-menu-item>
                </b-menu-list>
              </b-menu>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script lang="ts">
import Vue from "vue";
import Parser from "rss-parser";
import {SavedFeed} from "@/types/SavedFeed";

export default Vue.extend({
  name: 'App',
  data: () => ({
    parser: new Parser() as Parser,
    savedFeeds: [] as SavedFeed[]
  }),
  async mounted(){
    this.savedFeeds = [];
    const _savedFeeds = JSON.parse(localStorage.getItem('feeds') ?? '[]');

    for (let i = 0; i < _savedFeeds.length; i++) {
      const feed: SavedFeed = _savedFeeds[i];
      await this.parser.parseURL("https://cors-anywhere.herokuapp.com/" + feed.url).then((result) => {
        feed.title = result.title;
      });
      this.savedFeeds.push(feed);
    }
  }
});
</script>
