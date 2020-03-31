import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import vueCustomElement from 'vue-custom-element'
import 'vue-slider-component/theme/antd.css'
import VueSlider from 'vue-slider-component'
import 'document-register-element/build/document-register-element'

Vue.config.productionTip = false
Vue.component('VueSlider', VueSlider)
Vue.use(vueCustomElement)

App.vuetify = vuetify
Vue.customElement('map-widget', App)