import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'
import './config/msgs'
import './config/axios'
import './config/bootstrap'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// TEMPORÁRIO
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MiwibmFtZSI6IkZlbGlwZSBBbGJ1cXVlcnF1ZSIsImVtYWlsIjoiZmVsaXBlQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE2NTQzMDcyMDEsImV4cCI6MTY1NDU2NjQwMX0.q9Ph0BYyjKMc7lHmtiZdymmaDXIODJDY7T5xY7iJxWc'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')