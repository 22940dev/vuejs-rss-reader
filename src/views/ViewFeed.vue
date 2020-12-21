<template>
  <div>
    <Feed :feed="feed" :loading="loading" :error="error" />
  </div>
</template>
<script lang="ts">
import Feed from "@/components/Feed.vue";
import Vue from "vue";
import {SavedFeed} from "@/types/SavedFeed";

export default Vue.extend({
  name: "Feeds",
  components: {
    Feed
  },
  props: {
    feeds: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    loading: true,
    feed: {} as SavedFeed,
    error: ""
  }),
  watch: {
    feeds: function(){
      this.refreshFeed();
    },
    "$route.params.feedId": function(){
      this.refreshFeed();
    }
  },
  methods: {
    refreshFeed(){
      const _feeds = (this.feeds as SavedFeed[]);
      const _feedId = _feeds.findIndex((feed) => feed.id === Number(this.$route.params.feedId));
      const feed = _feeds[_feedId];
      if(feed){
        this.error = feed.error ?? "";
        if(feed.items){
          this.loading = false;
          this.feed = feed;
        }
      }
    }
  }
});
</script>