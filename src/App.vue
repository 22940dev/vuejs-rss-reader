<template>
  <div id="app">
    <div class="container">
      <div class="columns pt-5">
        <div class="column is-3">
          <div class="card">
            <div class="card-content">
              <b-menu>
                <b-menu-list label="Actions">
                  <b-menu-item :active="$route.name === 'Settings'" icon="cog" icon-pack="fas" label="Settings" tag="router-link"
                               to="/settings"></b-menu-item>
                  <b-menu-item icon="sync-alt" icon-pack="fas" label="Refresh" @click="$router.go()"></b-menu-item>
                </b-menu-list>
                <b-menu-list label="Feeds">
                  <b-menu-item v-for="feed in savedFeeds" v-show="feed.title" :key="feed.id" :active="Number($route.params.feedId) === feed.id"
                               :label="feed.title" :to="'/feed/' + feed.id" icon="rss" icon-pack="fas"
                               tag="router-link"></b-menu-item>
                  <div v-if="notLoaded > 0">
                    <b-skeleton v-for="i in notLoaded" :key="i" :animated="true" height="25px"
                                width="100%"></b-skeleton>
                  </div>
                </b-menu-list>
              </b-menu>
            </div>
          </div>
        </div>
        <div class="column is-9">
          <router-view :feeds="savedFeeds"/>
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
    savedFeeds: [] as SavedFeed[],
    notLoaded: -1,
    CORS_PROXY_PROD: "https://cors-proxy-prod.irequire.workers.dev/?",
    CORS_PROXY_DEV: "https://cors-proxy-dev.irequire.workers.dev/?"
  }),
  async mounted() {
    this.refreshFeed();
  },
  methods: {
    async refreshFeed() {
      this.savedFeeds = [];
      const _savedFeeds = JSON.parse(localStorage.getItem('feeds') ?? '[]');

      this.notLoaded = _savedFeeds.length;

      for (let i = 0; i < _savedFeeds.length; i++) {
        const feed: SavedFeed = _savedFeeds[i];

        const cors = process.env.NODE_ENV === 'development' ? this.CORS_PROXY_DEV : this.CORS_PROXY_PROD;
        this.parser.parseURL(cors + feed.url).then((result) => {
          feed.title = result.title;
          feed.items = result.items;
        }).catch((err: Error) => {
          feed.title = "Feed #" + feed.id + " (Error)";
          feed.items = [];
          feed.error = err.message;
        }).finally(() => {
          this.notLoaded--;
          this.savedFeeds.push(feed);

          this.savedFeeds.sort((a: SavedFeed, b: SavedFeed) => (a.id > b.id) ? 1 : -1);
        });
      }
    }
  }
});
</script>
