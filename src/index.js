import Vue from 'vue'

const selectPickerPlugin = {
  install (VueInstance, options) {
    VueInstance.component('selectpicker', require('./selectPicker.vue'))
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(selectPickerPlugin)
}

export default selectPickerPlugin
