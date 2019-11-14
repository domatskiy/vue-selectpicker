import selectpicker from './Components/selectPicker.vue'

const SelectPickerPlugin = {
  install (VueInstance, options) {
    VueInstance.component('selectpicker', selectpicker)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(SelectPickerPlugin)
}

export default SelectPickerPlugin
