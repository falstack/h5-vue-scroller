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
  :preload-top="50"
  :preload-bottom="50"
  :throttle="0"
  @scroll-down="handleScrollDown"
  @scroll-up="handleScrollUp"
  @top="handleScrollTop"
  @bottom="handleLoadMore"
  @refresh="handleRefresh"
  @refresh-end="handleRefreshEnd"
  @scroll="handleScroll({ offsetTop, isUp })"
>
</v-scroller>
```

### props
1. preload-top：触发 top 的距离（px），默认`50`
2. preload-bottom：触发 bottom 的距离（px），默认`50`
3. throttle: 事件派发的频率，默认`0`不限流，如果设置为 < 0，则不派发事件
4. tag：指定容器的元素，默认是`div`
5. reg：正则表达式字符串，用来避免被`fixedIOS`函数给阻止滚动事件

### events
1. `void` @scroll-down：正在向下滚动
2. `void` @scroll-up：正在向上滚动
3. `void` @top：滚动到屏幕顶部
4. `void` @bottom：滚动到屏幕底部
5. `object<{ offsetTop, isUp }>` @scroll 正在滚动
6. `object<{ offset, event }>` @refresh 下拉刷新
7. `void` @refresh-end：下拉刷新松手
