<template>
    <div id="app">

        Single:<br>
        <selectpicker
            :list="list"
            :multi="false"
            :search="true"
            v-model="selectedOne"
            placeholder="Выбор из тестового списка"
            searchPlaceholder="Поиск в тестовом списке"></selectpicker>
        <br><br>
        Multi:<br>
        <selectpicker
            :list="list"
            :multi="true"
            :search="true"
            v-model="selectedMulti"
            placeholder="Выбор из тестового списка"
            searchPlaceholder="Поиск в тестовом списке"></selectpicker>

        <br>
        <br>
        <br>
        Multi string key:<br>
        <selectpicker
                :list="listText"
                :multi="true"
                :search="true"
                v-model="selectedMultiText"
                placeholder="Выбор из тестового списка"
                searchPlaceholder="Поиск в тестовом списке"></selectpicker>

        <br>
        <br>
        <br>

        selected values: {{selectedOne}}<br>
        selected values: {{selectedMulti}}<br>
        selected values: {{selectedMultiText}}<br>
        <br>
        <br>
        <a @click="setVal">set</a>
        <br>
        <br>
    </div>
</template>

<script>
    import Vue from 'vue'
    import selectPicker from 'plugin'

    Vue.use(selectPicker)

    export default {
      name: 'app',
      components: {},
      data () {
        return {
          selectedOne: 2,
          selectedMulti: ['1', 2],
          selectedMultiText: [],
          list: {
            1: 'Test 1',
            2: 'Test 2',
            3: 'Test 3'
          },
          listText: {
            't1': 'Test 1',
            't2': 'Test 2',
            't3': 'Test 3'
          },
          dataList: [
            {
              id: 1,
              name: 'test 1'
            },
            {
              id: 2,
              name: 'test 2'
            }
          ]
        }
      },
      created () {
        // console.log('app created', this.$yandexmap)
      },
      mounted: function () {
        // console.log('app mounted', this.$yandexmap)
      },
      methods: {
        setVal: function () {
          console.log('set val')
          this.selectedOne = 3
          this.selectedMulti = ['2', 3]
          this.selectedMultiText = ['t2', 2]
        }
      }
    }
</script>