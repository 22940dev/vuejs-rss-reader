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
        <div class="container mt-5">
          <div class="columns">
            <div class="column">
              <b-button type="is-primary" class="mr-2" icon-left="file-import" @click="openImportModal">Import Feeds</b-button>
              <b-button type="is-primary" icon-left="file-export" @click="openExportModal">Export Feeds</b-button>
            </div>
          </div>
        </div>
        <b-modal v-model="exportModalActive" :width="640">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h1>Export</h1>
                <b-field>
                  <b-input placeholder="Feed JSON"
                           v-model="feedsJSON"
                           type="text"
                           icon="rss"
                           readonly>
                  </b-input>
                </b-field>
                <hr>
                <b-button type="is-primary" icon-left="copy" @click="copyFeed">Copy</b-button>
              </div>
            </div>
          </div>
        </b-modal>
        <b-modal v-model="importModalActive" :width="640">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h1>Import</h1>
                <b-field>
                  <b-input placeholder="Feed JSON"
                           v-model="feedsJSON"
                           type="text"
                           icon="rss">
                  </b-input>
                </b-field>
                <hr>
                <b-message v-show="importMessage.length > 0" :type="importMessageType" :closable="false">
                  {{ importMessage }}
                </b-message>
                <b-button :disabled="feedsJSON.length === 0" type="is-primary" icon-left="file-import" :loading="processingImport" @click="doImport">Import</b-button>
              </div>
            </div>
          </div>
        </b-modal>
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
    exportModalActive: false,
    importModalActive: false,
    feedsJSON: "",
    processingImport: false,
    importMessage: "",
    importMessageType: ""
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
    },
    openExportModal(){
      this.feedsJSON = JSON.stringify(this.feeds);
      this.exportModalActive = true;
    },
    copyFeed(){
      this.$copyText(this.feedsJSON);
    },
    openImportModal(){
      this.feedsJSON = "";
      this.importModalActive = true;
    },
    doImport(){
      this.processingImport = true;
      this.importMessage = "";
      try {
        const parsedJson = JSON.parse(this.feedsJSON);
        if(parsedJson instanceof Array){
          for(const item of parsedJson){
            // eslint-disable-next-line no-prototype-builtins
            if (item.hasOwnProperty('id') && item.hasOwnProperty('url')) {
              this.feeds = parsedJson;
              localStorage.setItem('feeds', JSON.stringify(this.feeds));
              this.importModalActive = false;
            }else{
              this.importMessageType = "is-danger";
              this.importMessage = "Error: Couldn't parse JSON.";
            }
          }
        }else{
          this.importMessageType = "is-danger";
          this.importMessage = "Error: Couldn't parse JSON.";
        }
      }catch(e){
        if(e instanceof SyntaxError ) {
          this.importMessageType = "is-danger";
          this.importMessage = "Error: " + e;
        }
      }
      this.processingImport = false;
    }
  }
});
</script>