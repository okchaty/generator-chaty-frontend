// CSS files
require('../scss/<%= mainJs %>.scss');

// Core
<% if(hasVue){ %>
import Vue from 'vue';
import router from 'js/router/<%= mainJs %>';
import App from 'vue/<%= mainJs %>';

Vue.config.productionTip = false;

var app = new Vue({
  el: '#app',
  components: { App },
  router
});
<% } else{ %>
// Insert your code
<% } %>