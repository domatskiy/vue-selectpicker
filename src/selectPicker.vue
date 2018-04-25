<template>
    <div class="selecter">
        <div class="selecter__input" @click="toggleSelect">
            <span>{{value_text.length > 0 ? value_text : placeholder}}</span>
        </div>
        <div class="selecter__dropdown" v-show="open === true">
            <div class="search" v-if="search == true">
                <input :placeholder="searchPlaceholder" v-model="search_text" @click="searchFieldClick"/>
            </div>
            <div class="list" @wheel="stopScroll" v-if="list.length > 0 || Object.keys(list).length > 0">
                <div class="list__item" v-for="(name, value) in list" v-show="!search_text || name.toLowerCase().indexOf(search_text.toLowerCase().trim()) > -1" @click="selListValue(+value, $event)" :class="values && ((typeof values === 'object' && values.length > 0 && values.indexOf(+value) > -1) || values == value) ? 'list__item--checked' : ''">
                    <div>{{name}}</div>
                </div>
            </div>
            <!-- <div class="list list--data" @wheel="stopScroll" v-if="data.length > 0">
                <div class="list__item" v-for="item in data" v-show="!search_text || item.name.toLowerCase().indexOf(search_text.toLowerCase().trim()) > -1" @click="selValue(item)" :class="(typeof values === 'object' && values.indexOf(item.id) > -1) || values == item.id ? 'list__item--checked' : ''">
                    <div>{{item.name}}</div>
                </div>
            </div> -->
            <div class="footer" v-show="multi === true">
                <button type="button" @click="resetSelect">Сбросить</button>
                <button type="button" @click="closeSelect($event)">Выбрать</button>
            </div>
        </div>
    </div>
</template>

<script>

import selectPickerBus from './selectPickerBus'

export default {
  name: 'selectpicker',
  props: {
    placeholder: {
      type: String,
      required: false,
      default: 'Выбор значения'
    },
    value: {
      required: false,
      default: ''
    },
    multi: {
      type: Boolean,
      required: false,
      default: function () {
        return false
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
  beforeMount: function () {
    this.setNewValue()
  },
  mounted: function () {
    let __this = this
    selectPickerBus.$on('selectpickerClose', function () {
      __this.close(false)
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
      if($value !== null) {
        if (this.multi === true) {
          this.values = Object.values(this.values)
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
      }
      this.close(true)
    },
    selValue: function ($item) {
      if (this.multi === true) {
        let values = Object.values(this.values)
        let index = values.indexOf($item.id)
        // добавляем значение
        if (index === -1) {
          this.values.push($item.id)
        } else {
          this.values.splice(index, 1)
        }
      } else {
        this.values = $item.id
      }
      this.close(true)
    },
    setNewValue: function () {
      if (this.multi === true && typeof this.value !== 'object') {
        console.warn('selectPicker: need array value for multi select', this.value, typeof this.value)
        this.values = []
      } else if (this.multi === false && typeof this.value === 'object') {
        console.warn('selectPicker: need single value for select')
        this.values = null // this.value.slice(0, 1)[0]
      } else {
        this.values = this.value
      }
    }
  },
  watch: {
    value: function (newValue) {
      // console.log('changed: value=', newValue)
      this.setNewValue()
      this.close(true)
    },
    values: function (newValues) {
      // console.log('changed: values=', newValues, Object.values(newValues), this.list)
      let text = []
      if (Array.isArray(newValues)) {
        let values = Object.values(newValues)
        console.log('!!! values', values, this.list)
        if (values.length > 0) {
          // заполняем текст
          for (let value in this.list) {
            let name = this.list.hasOwnProperty(value) ? this.list[value] : null
            // console.info(value, name, this.values, typeof values, Array.isArray(values))
            console.log('value: ', value, +value, values.indexOf(+value))
            if (value && (values.indexOf(+value) > -1 || +this.values === +value)) {
              text.push(name)
            }
          }
          for (let m in this.data) {
            let item = this.list.hasOwnProperty(m) ? this.list[m] : null
            if (item && ((typeof this.values === 'object' && this.values.indexOf(item.id) > -1) || this.values === item.id)) {
              text.push(item.name)
            }
          }
        }
      } else {
        let name = this.list.hasOwnProperty(+newValues) ? this.list[+newValues] : null
        if (name) {
          text.push(name)
        }
      }

      this.value_text = text.length < 3 ? text.join(', ') : 'выбрано ' + text.length
    }
  }
}
</script>

<style lang="less" scope>
@import "styles";
</style>