import selectpicker from './Components/selectPicker.vue'
import selectpickerBus from './selectPickerBus'

const SelectPickerPlugin = {
  install (VueInstance, options) {
    VueInstance.component('selectpicker', selectpicker)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(SelectPickerPlugin)
}

export { SelectPickerPlugin, selectPickerBus };
export default SelectPickerPlugin
