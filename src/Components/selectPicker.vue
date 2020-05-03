<template>
    <div class="selecter">
        <div class="selecter__input" @click.stop.prevent="toggleSelect">
            <span>{{value_text.length > 0 ? value_text : placeholder}}</span>
        </div>
        <div class="selecter__dropdown" :class="[multi ? 'selecter__dropdown--multi' : '']" v-show="open === true">
            <div class="search" v-if="search === true">
                <input :placeholder="searchPlaceholder" v-model="search_text" @click.stop/>
            </div>
            <div class="list"
                 @keyup.page-down="onPageDown"
                 v-on:scroll.stop
                 v-if="list.length > 0 || Object.keys(list).length > 0">
                <div class="list__item" v-if="required === false && multi === false" @click.stop="selListValue(null, $event)">{{noSelText}}</div>
                <div class="list__item"
                     v-for="(name, id) in list"
                     v-show="!search_text || name.toLowerCase().indexOf(search_text.toLowerCase().trim()) > -1"
                     @click.stop="selListValue(id, $event)"
                     :class="valueSelected(id) ? 'list__item--checked' : ''">
                    <div>{{name}}</div>
                </div>
            </div>
            <div class="footer" v-show="multi === true && showActions === true">
                <button type="button" @click.stop.defaut="resetSelect">Сбросить</button>
                <button type="button" @click.stop.defaut="closeSelect(false, $event)">Выбрать</button>
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
    noSelText: {
      type: String,
      required: false,
      default: 'No seleccionado'
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

    /**
     * событие шины, закрыть селекты
     */
    selectPickerBus.$on('selectpickerClose', () => {
      // console.log('selectpicker: event selectpickerClose ...')
      this.open = false
    })

    selectPickerBus.$on('selectpickerOpen', () => {
      // console.log('selectpicker: event selectpickerOpen ...')
    })

    /**
    * отслеживаем изменение значения
    * вызываем setNewValue
    */
    this.$watch('value', function ($value) {
      // console.log('selectpicker: changed value...', $value)
      this.setNewValue()
    }, {
      deep: true
    });

    this.$watch('list', function ($list) {
      console.log('selectpicker: list value...', $list)
      this.setNewValue()
    }, {
          deep: true
    });
  },
  methods: {
    resetSelect: function (e) {
      // console.log('selectpicker: resetSelect')
      this.values = this.multi === true ? [] : null
      this.closeSelect(true, false)
    },
    openSelect: function (e) {
      // console.log('selectpicker: openSelect')
      selectPickerBus.$emit('selectpickerClose', this)
      this.open = true
      selectPickerBus.$emit('selectpickerOpen', this)
    },
    closeSelect: function (setValue, checkMulti) {
      if (typeof setValue !== 'boolean') {
        setValue = true
      }
      if (typeof checkMulti !== 'boolean') {
        checkMulti = false
      }
      // console.log('selectpicker: closeSelect ... ', setValue, checkMulti)
      if (setValue && (!checkMulti || (checkMulti && this.multi === false))) {
        this.search_text = ''
        this.open = false
        // console.log('selectpicker: emit value', this.values)
        this.$emit('input', this.values)
      }
    },
    toggleSelect: function (e) {
      // console.log('selectpicker: toggleSelect', this.open)
      if (this.open === false) {
        this.openSelect()
      } else {
        this.closeSelect(true, false)
      }
    },
    onPageDown: function () {
      console.log('onPageDown')
    },
    selListValue: function ($val, $event) {
      // console.log('selectPicker: selListValue', $val)

      if (this.multi === true && !Array.isArray(this.values)) {
        this.values = []
      } else if (this.multi !== true && Array.isArray(this.values)){
        this.values = null
      }

      if (Array.isArray(this.values)) {
        // get index in array
        let index = this.values.indexOf($val + '')
        if (index === -1) {
            index = this.values.indexOf(+$val)
        }

        if (index === -1) {
          this.values.push($val)
        } else {
          this.values.splice(index, 1)
        }
      } else {
        this.values = $val
      }

      // console.log('selectPicker: selListValue', this.values)
      this.closeSelect(true, true)
    },
    valueSelected: function ($val) {
      // console.log('selectpicker: valueSelected', $val, this.values)
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
    /**
     * перерасчет values
     */
    setNewValue: function () {

      if(this.value === null) {
        // console.log('selectpicker: setNewValue for null')
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
        this.$set(this, 'values', [this.value])
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

    values: function (newValues) {
      /**
       * формирование текста из выбранных значений
       */
      // console.log('selectpicker: changed values, new value=', newValues, 'list', this.list)
      let text = []

      // заполняем текст из list
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
      // console.log('value_text', text, this.value_text)
    }
  }
}
</script>

<style lang="less" scope>
@import "./selectPicker";
</style>
