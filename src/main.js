// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible'
import Vant from 'vant';
import 'vant/lib/index.css';
import ViewUI from 'view-design';
import store from './store/store'
import './assets/iconfont/iconfont.js'
import 'view-design/dist/styles/iview.css';
import './assets/css/main.css'

Vue.use(Vant);
Vue.use(ViewUI);
Vue.config.productionTip = false;

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
