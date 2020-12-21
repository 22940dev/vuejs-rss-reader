<template>
  <div class="card">
    <div class="card-content">
      <b-field label="Theme">
        <b-select placeholder="Select a theme" v-model="newTheme">
          <option v-for="t in themes" :value="t" :key="t.themeName">
              {{ t.themeName }}
          </option>
        </b-select>
      </b-field>

      <b-field label="Add Feed">
        <b-input placeholder="URL" type="url" v-model="addFeedURL"></b-input>
      </b-field>
      <b-button type="is-primary" @click="addFeed(addFeedURL)">Add</b-button>
      <hr>
      <h1>Feeds</h1>
      <div class="columns">
        <div class="column">
          <b-button class="mt-2 mb-2" icon-left="times" type="is-danger" :disabled="checkedRows.length === 0" @click="removeSelectedRows">Delete selected</b-button>
          <b-table :data="newFeeds"
                   :columns="columns"
                   draggable
                   checkable
                   :checked-rows.sync="checkedRows"
                   @dragstart="dragstart"
                   @drop="drop"
                   @dragover="dragover"
                   @dragleave="dragleave"></b-table>
        </div>
      </div>


      <b-field grouped group-multiline>
        <div class="container mt-5">
          <div class="columns">
            <div class="column">
              <b-button type="is-primary" class="mr-2" icon-left="file-import" @click="openImportModal">Import Feeds</b-button>
              <b-button type="is-primary" icon-left="file-export" @click="openExportModal">Export Feeds</b-button>
            </div>
          </div>
          <div class="columns" v-show="unsavedChanges">
            <div class="column">
              <b-message type="is-warning" :closable="false">
                <b>Warning</b> You have unsaved changes.
              </b-message>
            </div>
          </div>
          <div class="columns" v-show="unsavedChanges">
            <div class="column">
              <b-button type="is-success" class="mr-2" icon-left="save" @click="saveFeed(newFeeds)">Save Changes</b-button>
              <b-button type="is-danger" class="mr-2" icon-left="times" @click="resetNewFeeds">Discard Changes</b-button>
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
import {cloneDeep} from 'lodash';
import {Themes} from "@/types/Themes";
import {Theme} from "@/types/Theme";

export default Vue.extend({
  name: "Settings",
  data: () => ({
    addFeedURL: "",
    feeds: [] as SavedFeed[],
    newFeeds: [] as SavedFeed[],
    exportModalActive: false,
    importModalActive: false,
    feedsJSON: "",
    processingImport: false,
    importMessage: "",
    importMessageType: "",
    unsavedChanges: false,
    columns: [
      {
        field: 'id',
        label: 'ID',
        width: '40',
        numeric: true
      },
      {
        field: 'url',
        label: 'URL',
      }
    ],
    checkedRows: [] as SavedFeed[],
    draggingRow: {} as SavedFeed,
    draggingRowIndex: 0,
    themes: Themes.themes as Theme[],
    usedTheme: Themes.themes[0],
    newTheme: {} as Theme
  }),
  created() {
    this.feeds = JSON.parse(localStorage.getItem('feeds') ?? '[]');
    this.usedTheme = JSON.parse(localStorage.getItem('rss_reader_theme') ?? '{}') ?? Themes.themes[0];
    this.newTheme = this.usedTheme;
    this.resetNewFeeds();
  },
  methods: {
    resetNewFeeds(){
      this.newFeeds = cloneDeep(this.feeds);
    },
    reorderFeed(feed: SavedFeed[]): SavedFeed[] {
      const clonedFeed = cloneDeep(feed);
      let i = 0;
      clonedFeed.forEach((f: SavedFeed) => {
        f.id = i;
        i++;
      });

      return clonedFeed;
    },
    addFeed(url: string){
      if(this.newFeeds.findIndex((value => value.url === url)) > -1){
        return;
      }
      this.addFeedURL = "";
      this.newFeeds.push({
        id: this.newFeeds[this.newFeeds.length - 1].id + 1,
        url
      });
    },
    removeFeed(id: number) {
      const index = this.newFeeds.findIndex((value: SavedFeed) => value.id === id);
      this.newFeeds.splice(index, 1);
      this.newFeeds = this.reorderFeed(this.newFeeds);
    },
    saveFeed(feed: SavedFeed[]){
      localStorage.setItem('feeds', JSON.stringify(feed));
      this.$router.go(0);
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
              this.newFeeds = parsedJson;
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
    },
    dragstart (payload: any) {
      this.draggingRow = payload.row
      this.draggingRowIndex = payload.index
      payload.event.dataTransfer.effectAllowed = 'copy'
    },
    dragover(payload: any) {
      payload.event.dataTransfer.dropEffect = 'copy'
      payload.event.target.closest('tr').classList.add('is-selected')
      payload.event.preventDefault()
    },
    dragleave(payload: any) {
      payload.event.target.closest('tr').classList.remove('is-selected')
      payload.event.preventDefault()
    },
    drop(payload: any) {
      this.checkedRows = [];
      payload.event.target.closest('tr').classList.remove('is-selected')
      const droppedOnRowIndex = payload.index

      const copyFeeds = this.newFeeds;
      this.newFeeds = [];

      const a = this.draggingRowIndex;
      const b = droppedOnRowIndex;

      const itemA = copyFeeds[a];
      const itemB = copyFeeds[b];
      itemA.id = b;
      itemB.id = a;

      copyFeeds.sort((a: SavedFeed, b: SavedFeed) => (a.id > b.id) ? 1 : -1);

      this.newFeeds = copyFeeds;
    },
    removeSelectedRows(){
      this.checkedRows.forEach((row: SavedFeed) => {
        this.removeFeed(row.id);
      });
      this.checkedRows = [];
    }
  },
  watch: {
    newFeeds: function(){
      this.unsavedChanges = JSON.stringify(this.feeds) !== JSON.stringify(this.newFeeds);
    },
    newTheme: function(value){
      if(value !== this.usedTheme) {
        localStorage.setItem('rss_reader_theme', JSON.stringify(value));

        (document.getElementById('custom-theme') as HTMLElementTagNameMap["link"]).href = value.themeURL;

        //this.$router.go(0);
      }
    }
  }
});
</script>