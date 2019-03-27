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
        Single text:<br>
        <selectpicker
                :list="listText"
                :multi="false"
                :search="true"
                v-model="selectedOneText"
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

      <br><br>
      Multi tagged:<br>
      <selectpicker
        :list="list"
        :multi="true"
        :tagged="true"
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
        selected values: {{selectedOneText}}<br>
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
          selectedOneText: null,
          selectedMulti: ['1', 2],
          selectedMultiText: [],
          list: {
            1: 'Test 1',
            2: 'Test 2',
            3: 'Test 3',
            4: 'Test 4',
            5: 'Test 5',
            6: 'Test 6',
            7: 'Test 7',
            8: 'Test 8',
            9: 'Test 9',
            10: 'Test 10',
            11: 'Test 11',
            12: 'Test 12',
            13: 'Test 13',
            14: 'Test 14',
          },
          listText: {
            't1': 'Test 1',
            't2': 'Test 2',
            't3': 'Test 3',
            't4': 'Test 4',
            't5': 'Test 5',
            't6': 'Test 6',
            't7': 'Test 7',
            't8': 'Test 8',
            't9': 'Test 9',
            't10': 'Test 10',
            't11': 'Test 11',
            't12': 'Test 12',
            't13': 'Test 13',
            't14': 'Test 14',
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
          this.$set(this, 'selectedOneText', 't3')
          this.selectedMulti = ['2', 3]
          this.selectedMultiText = ['t2', 2]
        }
      }
    }
</script>
