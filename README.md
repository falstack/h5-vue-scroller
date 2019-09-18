<h1 align="center">Welcome to h5-vue-scroller 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

### 🏠 [Homepage](https://github.com/falstack/h5-vue-scroller)

## Install
```sh
npm i h5-vue-scroller
or 
yarn add h5-vue-scroller
```

## Usage
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
  :event-step="1"
  @top="handleScrollTop"
  @bottom="handleLoadMore"
  @refresh="handleRefresh({ offset, event })"
  @refresh-end="handleRefreshEnd"
  @scroll="handleScroll({ offsetTop, isUp })"
>
  <slot/>
</v-scroller>
```

## Props
- preload-top：触发 top 的距离（px），默认`50`
- preload-bottom：触发 bottom 的距离（px），默认`50`
- throttle: 事件派发的频率，默认`0`不限流，如果设置为 < 0，则不派发事件
- tag：指定容器的元素，默认是`div`
- event-step：事件触发的步长（px），大于这个步长才会 emit`top`和**第一次**的`refresh` 事件

## Events
- `void` @top：滚动到屏幕顶部
- `void` @bottom：滚动到屏幕底部
- `object<{ offsetTop, isUp }>` @scroll 正在滚动
- `object<{ offset, event }>` @refresh 下拉刷新
- `void` @refresh-end：下拉刷新松手


## Author

👤 **falstack <icesilt@outlook.com>**


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/falstack/h5-vue-scroller/issues).

## Show your support

Give a ⭐️ if this project helped you!

## License
[MIT license](https://opensource.org/licenses/MIT).

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
