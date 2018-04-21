## install

npm i vue-selectpicker

## use

```html
<selectpicker
    :value="[]"
    :list="list"
    :multy="true"
    :search="true"
    v-model="selectedList"
    placeholder="Выбор из тестового списка"
    searchPlaceholder="Поиск в тестовом списке"></selectpicker>
```

example app

```js

import selectPicker from 'plugin'
Vue.use(selectPicker)

export default {
  name: 'app',
  methods: {
    mapCreated: function ($map) {
      console.info('mapCreated, $map=', $map)
    }
  }
}
```

https://domatskiy.github.io/vue-selectpicker/