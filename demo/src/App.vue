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
        selected values: {{selectedMulti}}
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
          selectedOne: null,
          selectedMulti: [],
          list: {
            1: 'Test 1',
            2: 'Test 2',
            3: 'Test 3'
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
      methods: {}
    }
</script>