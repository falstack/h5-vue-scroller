# h5-vue-scroller

## usage
```sh
npm i h5-vue-scroller
or 
yarn add h5-vue-scroller
```

```javascript
import Vue from 'vue'
import VScroller from 'h5-vue-scroller'
Vue.component(VScroller.name, VScroller)
```

```vue
<v-scroller
  v-for="(item, index) in headers2"
  :preload="50"
  @scroll-down="handleScrollDown"
  @scroll-up="handleScrollUp"
  @top="handleScrollTop"
  @bottom="handleLoadMore"
  @scroll="handleScroll({ offsetTop, isUp })"
>
</v-scroller>
```
