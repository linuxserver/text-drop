import Vue from 'vue'
import Notifications from 'vue-notification'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone,faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faClone,faCloudUploadAlt,faGithub)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(Notifications)

new Vue({
  render: h => h(App),
}).$mount('#app')
