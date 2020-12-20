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
                  <b-menu-item label="Refresh" icon-pack="fas" icon="sync-alt" @click="$router.go()"></b-menu-item>
                </b-menu-list>
                <b-menu-list label="Feeds">
                  <b-menu-item v-for="feed in savedFeeds" :key="feed.id" :label="feed.title" v-show="feed.title" icon-pack="fas" icon="rss" tag="router-link" :to="'/feed/' + feed.id" :active="Number($route.params.feedId) === feed.id"></b-menu-item>
                  <div v-if="notLoaded > 0">
                    <b-skeleton width="100%" height="25px" :animated="true" v-for="i in notLoaded" :key="i"></b-skeleton>
                  </div>
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
    savedFeeds: [] as SavedFeed[],
    notLoaded: -1
  }),
  async mounted(){
    this.refreshFeed();
  },
  methods: {
    async refreshFeed(){
      this.savedFeeds = [];
      const _savedFeeds = JSON.parse(localStorage.getItem('feeds') ?? '[]');

      this.notLoaded = _savedFeeds.length;

      for (let i = 0; i < _savedFeeds.length; i++) {
        const feed: SavedFeed = _savedFeeds[i];
        this.parser.parseURL("https://dawn-mode-a8ed.irequire.workers.dev/?" + feed.url).then((result) => {
          feed.title = result.title;
          this.notLoaded--;
        });
        this.savedFeeds.push(feed);
      }
    }
  }
});
</script>
