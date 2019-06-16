import Vue from 'vue'

export default new Vue({
  data () {
    return {
      body_click_handler: null
    }
  },
  created: function () {
    this.body_click_handler = () => {
      // console.log('body_click_handler')
      document.body.removeEventListener('click', this.body_click_handler)
      this.$emit('selectpickerClose', true)
    }
    this.$on('selectpickerOpen', () => {
      document.body.addEventListener('click', this.body_click_handler)
    })
    // this.$on('selectpickerClose', () => {})
  }
})

