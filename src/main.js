/* eslint-disable */

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueHighlightJS from 'vue-highlightjs';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueHighlightJS);

new Vue({
  render: h => h(App),
}).$mount('#app');
