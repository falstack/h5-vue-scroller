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
  tag="ul"
  :preload="50"
  :throttle="0"
  @scroll-down="handleScrollDown"
  @scroll-up="handleScrollUp"
  @top="handleScrollTop"
  @bottom="handleLoadMore"
  @scroll="handleScroll({ offsetTop, isUp })"
>
</v-scroller>
```

### props
1. preload：触发 top, bottom 的距离（px），默认`50`
2. throttle: 事件派发的频率，默认`0`不限流，如果设置为 < 0，则不派发事件
3. tag：指定容器的元素，默认是`div`

### events
1. `void` @scroll-down：正在向下滚动
2. `void` @scroll-up：正在向上滚动
3. `void` @top：滚动到屏幕顶部
4. `void` @bottom：滚动到屏幕底部
5. `object<{ offsetTop, isUp }>` @scroll 正在滚动
