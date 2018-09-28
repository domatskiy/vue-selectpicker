<template>
    <div class="selecter">
        <div class="selecter__input" @click="toggleSelect">
            <span>{{value_text.length > 0 ? value_text : placeholder}}</span>
        </div>
        <div class="selecter__dropdown" :class="[multi ? 'selecter__dropdown--multi' : '']" v-show="open === true">
            <div class="search" v-if="search == true">
                <input :placeholder="searchPlaceholder" v-model="search_text" @click="searchFieldClick"/>
            </div>
            <div class="list" @wheel="stopScroll" v-if="list.length > 0 || Object.keys(list).length > 0">
                <div class="list__item" v-if="required === false && multi === false" @click="selListValue(null, $event)">Не выбрано</div>
                <div class="list__item"
                     v-for="(name, value) in list"
                     v-show="!search_text || name.toLowerCase().indexOf(search_text.toLowerCase().trim()) > -1"
                     @click="selListValue(value, $event)"
                     :class="valueSelected(value) ? 'list__item--checked' : ''">
                    <div>{{name}}</div>
                </div>
            </div>
            <div class="footer" v-show="multi === true && showActions === true">
                <button type="button" @click="resetSelect">Сбросить</button>
                <button type="button" @click="closeSelect($event)">Выбрать</button>
            </div>
        </div>
    </div>
</template>

<script>

import selectPickerBus from './../selectPickerBus'

export default {
  name: 'selectpicker',
  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'Выбор значения'
    },
    value:{},
    multi: {
      type: Boolean,
      required: false,
      default: function () {
        return false
      }
    },
    required: {
      type: Boolean,
      required: false,
      default: function () {
        return false
      }
    },
    showActions: {
      type: Boolean,
      required: false,
      default: function () {
        return true
      }
    },
    search: {
      type: Boolean,
      required: false,
      default: false
    },
    searchPlaceholder: {
      type: String,
      required: false,
      default: 'Поиск'
    },
    list: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    },
    data: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    },
    buttons: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: function () {
    return {
      open: false,
      search_text: '',
      value_text: '',
      values: null
    }
  },
  beforeMount: function () {},
  mounted: function () {
    this.setNewValue()
    selectPickerBus.$on('selectpickerClose', () => {
      this.close(false)
    })
  },
  methods: {
    searchFieldClick: function (e) {
      e.stopPropagation()
    },
    stopScroll: function (e) {
      e.stopPropagation()
    },
    openSelect: function (e) {
      selectPickerBus.$emit('selectpickerClose', true)
      this.open = true
      selectPickerBus.$emit('selectpickerOpen', true)
      e.stopPropagation()
      e.preventDefault()
    },
    resetSelect: function (e) {
      this.values = this.multi === true ? [] : null
      this.close(false)
      e.stopPropagation()
      e.preventDefault()
    },
    closeSelect: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.close(false)
    },
    toggleSelect: function (e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.open === false) {
        this.openSelect(e)
      } else {
        this.closeSelect(e)
      }
    },
    close: function (check) {
      if (typeof check !== 'boolean') {
        check = false
      }
      if (!check || (check && this.multi === false)) {
        this.open = false
        this.search_text = ''
        this.$emit('input', this.values)
      }
    },
    selListValue: function ($value, $event) {
      $event.stopPropagation()

      if ($value !== null && this.multi === true) {
        // this.values = Object.values(this.values)
        let $index = this.values.indexOf($value)
        // добавляем значение
        if ($index === -1) {
          this.values.push($value)
        } else {
          this.values.splice($index, 1)
        }
      } else {
        this.values = $value
      }
      this.close(true)
    },
    valueSelected: function ($val) {
      console.log('valueSelected', $val, this.values)

      if (this.values === null)
        return false;

      if (Array.isArray(this.values)) {

        if (this.values.length === 0)
          return false;

        let index = this.values.indexOf($val + '')
        if (index === -1) {
          index = this.values.indexOf(+$val)
        }
        return index > -1
      } else {
        return this.values === $val || this.values + '' === $val + ''
      }
    },
    setNewValue: function () {

      if(this.value === null) {
        // console.log('setNewValue for null')
        if(this.multi === true) {
          this.$set(this, 'values', [])
        } else {
          this.$set(this, 'values', null)
          return
        }
        return
      }

      if (this.multi === true && !Array.isArray(this.value)) {
        console.warn('selectPicker: need array for multi', this.value)
        this.$set(this, 'values', [])
      } else if (this.multi === false && Array.isArray(this.value)) {
        console.warn('selectPicker: need single value for select, ', this.value, '!!!')
        this.$set(this, 'values', null)
      } else {
        // console.log('setNewValue', this.value)
        this.$set(this, 'values', this.value)
      }
    }
  },
  watch: {
    value: function (newValue) {
      // console.log('value...')
      this.setNewValue()
      this.close(true)
    },
    values: function (newValues) {
      console.log('changed: values=', newValues, this.list)
      let text = []

      // заполняем текст
      Object.keys(this.list).map(($key) => {
        let name = this.list[$key]
        if (name && this.valueSelected($key)) {
          text.push(name)
        }
      })

      for (let $key in this.data) {
        let item = this.list.hasOwnProperty($key) ? this.list[$key] : null
        if (item && this.valueSelected(item.id)) {
          text.push(item.name)
        }
      }

      this.value_text = text.length < 3 ? text.join(', ') : 'выбрано ' + text.length
      console.log('value_text', text, this.value_text)
    }
  }
}
</script>

<style lang="less" scope>
@import "./selectPicker";
</style>