import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

export const createApp = (context) => {
  const app = new Vue({
    router,
    context,
    store,
    render: h => h(App)
  }).$mount('#app')
  return { router, app }
}
