import Vue from 'vue'

const selectPickerBus = new Vue({
  data () {
    return {
      body_click_handler: null
    }
  },
  created: function () {
    this.body_click_handler = () => {
      document.body.removeEventListener('click', this.body_click_handler)
      this.$emit('selectpickerClose', true)
    }
    this.$on('selectpickerOpen', () => {
      document.body.addEventListener('click', this.body_click_handler)
    })
    // this.$on('selectpickerClose', () => {})
  }
})

export default selectPickerBus
