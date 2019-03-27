## install

npm i vue-selectpicker

## Properties
|prop|type|default|||
|:---------|:---------|:---------|:---------|:---------|
|list|array or Object|[]||list of values {key: value, key2: value2} or [{id: 1, name: xxx}, {id: 2, name: yyy}]|
|multi|boolean|false||
|tagged|boolean|false||
|search|boolean|false|enable search|
|placeholder|string|Выбор значения||
|searchPlaceholder|string|Поиск||
  
  
## Example


```html
<selectpicker
    :list="valueList"
    :multi="true"
    :tagged="true"
    :search="true"
    v-model="selectedList"
    placeholder="Select value"
    searchPlaceholder="Search">
</selectpicker>
```

```js
import selectPicker from 'vue-selectpicker'
Vue.use(selectPicker)

export default {
  name: 'app', 
  data: function() {
    return {
      valueList: [
        {id: 1, name: 'val 1'},
        {id: 2, name: 'val 2'},
        {id: 3, name: 'val 3'},
      ]
    }
  }
}
```

https://domatskiy.github.io/vue-selectpicker/
