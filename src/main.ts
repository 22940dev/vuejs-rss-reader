import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueMoment from 'vue-moment';
import moment from 'moment';

Vue.config.productionTip = false

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(Buefy, {
    defaultIconPack: 'fas'
})

const locale = window.navigator.language;
require('moment/locale/' + locale)

Vue.use(VueMoment, {
    moment
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
