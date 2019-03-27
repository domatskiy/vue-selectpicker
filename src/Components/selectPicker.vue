<template>
    <div class="selecter" :class="[tagged ? 'selecter--tagged' : '']">
        <div class="selecter__input" @click.stop.prevent="toggleSelect">
            <span v-if="tagged === false">{{textValue.length > 0 ? textValue : placeholder}}</span>
            <div class="selecter__tagged" v-else>
              <div class="selecter__tagged-item" v-for="(item, index) in arValue">
                <span>{{item.name}}</span>
                <span class="selecter__tagged-item-close" @click.stop="selListValue(item.id, $event)"></span>
              </div>
            </div>
        </div>
        <div class="selecter__dropdown" :class="[multi ? 'selecter__dropdown--multi' : '']" v-show="open === true">
            <div class="search" v-if="search === true">
                <input :placeholder="searchPlaceholder" v-model="searchText" @click.stop/>
            </div>
            <div class="list"
                 @keyup.page-down="onPageDown"
                 v-on:scroll.stop
                 v-if="Object.keys(enumList).length > 0">
                <div class="list__item" v-if="required === false && multi === false" @click.stop="selListValue(null, $event)">{{noSelText}}</div>
                <div class="list__item"
                     v-for="(item, index) in enumList"
                     v-show="!searchText || item.name.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1"
                     @click.stop="selListValue(item.id, $event)"
                     :class="valueSelected(item.id) ? 'list__item--checked' : ''">
                    <div>{{item.name}}</div>
                </div>
            </div>
            <div class="footer" v-show="multi === true && showActions === true">
                <button type="button" @click.stop.defaut="resetSelect">Сбросить</button>
                <button type="button" @click.stop.defaut="closeSelect(true, false)">Выбрать</button>
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
      default: 'Не выбрано'
    },
    value:{},
    multi: {
      type: Boolean,
      required: false,
      default: function () {
        return false
      }
    },
    tagged: {
      type: Boolean,
      required: false,
      default: false
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
      required: false,
      default: function () {
        return {}
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
      searchText: '',
      textValue: '',
      arValue: [],
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
      console.log('selectpicker: closeSelect ... ', setValue, checkMulti)
      if (setValue && (!checkMulti || (checkMulti && this.multi === false))) {
        this.searchText = ''
        this.open = false
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
      console.log('selectPicker: selListValue', $val)

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
        console.log('selectPicker: selListValue', $val, index, this.values)
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
  computed: {
    enumList: function () {
      let tmp = []
      if (Array.isArray(this.list) && this.list.length > 0) {
        this.list.forEach((item) => {
          if (typeof item === 'object' && typeof item.id !== 'undefined') {
            tmp.push(item)
          } else {
            console.warn('not correct item ', item)
          }
        })
      } else if (typeof this.list === 'object') {
        Object.keys(this.list).map((id) => {
          let value = this.list[id]
          if (typeof value === 'string') {
            tmp.push({
              id: id,
              name: value
            })
          } else if (typeof value === 'object') {
            tmp.push(value)
          } else {
            console.warn('not correct object of value ', value)
          }
        })
      }
      return tmp
    }
  },
  watch: {

    values: function (newValues) {
      /**
       * формирование текста из выбранных значений
       */
      // console.log('selectpicker: changed values, new value=', newValues, 'list', this.list)
      let text = []
      let items = []

      // заполняем текст из list
      Object.keys(this.enumList).map(($key) => {
        let item = this.enumList[$key]
        if (item.name && this.valueSelected(item.id)) {
          text.push(item.name)
          items.push(item)
        }
      })

      this.textValue = text.length < 3 ? text.join(', ') : 'выбрано ' + text.length
      this.$set(this, 'arValue', items)
      // console.log('textValue', text, this.textValue)
    }
  }
}
</script>

<style lang="less" scope>
@import "./selectPicker";
</style>
