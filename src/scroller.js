import { throttle as throttleFn } from 'throttle-debounce'

export default {
  name: 'VScroller',
  props: {
    preloadTop: {
      type: Number,
      default: 50
    },
    preloadBottom: {
      type: Number,
      default: 50
    },
    throttle: {
      type: Number,
      default: 0
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  data() {
    return {
      lastScrollTop: 0,
      lastTouchY: 0
    }
  },
  render: function(h) {
    const events = {
      '&touchstart': this.handleStart,
      '&touchmove': this.handleMove
    }
    const { throttle } = this
    if (throttle >= 0) {
      if (throttle === 0) {
        events.scroll = this.handleScroll
      } else {
        events.scroll = throttleFn(throttle, this.handleScroll)
      }
    }
    return h(
      this.tag,
      {
        style: {
          height: '100%',
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        },
        class: 'v-scroller',
        on: events
      },
      this.$slots.default
    )
  },
  methods: {
    handleScroll(evt) {
      const scrollTop = evt.target.scrollTop
      const isUp = this.lastScrollTop > scrollTop
      const { $el, preloadTop, preloadBottom } = this
      if (isUp) {
        if (scrollTop > 0) {
          if (scrollTop < preloadTop) {
            this.$emit('top')
          }
          this.$emit('scroll-up')
        }
      } else {
        if (scrollTop > 0) {
          this.$emit('scroll-down')
        }
        if ($el.scrollHeight - $el.clientHeight - scrollTop < preloadBottom) {
          this.$emit('bottom')
        }
      }

      this.lastScrollTop = scrollTop
      this.$emit('scroll', {
        offsetTop: scrollTop,
        isUp
      })
    },
    handleStart(evt) {
      this.lastTouchY = evt.touches ? evt.touches[0].pageY : evt.pageY
      this.fixedIOS()
    },
    handleMove(evt) {
      const zoom =
        window.innerWidth / window.document.documentElement.clientWidth
      if (evt.touches.length > 1 || zoom !== 1) {
        return
      }

      let el = evt.target
      const curY = evt.touches ? evt.touches[0].pageY : evt.pageY
      const lastTouchY = this.lastTouchY
      while (el !== document.body && el !== document) {
        const style = window.getComputedStyle(el)
        if (!style) {
          break
        }

        if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
          return
        }

        const scrolling = style.getPropertyValue('-webkit-overflow-scrolling')
        const overflowY = style.getPropertyValue('overflow-y')
        const height = parseInt(style.getPropertyValue('height'), 10)

        if (
          scrolling === 'touch' &&
          (overflowY === 'auto' || overflowY === 'scroll') &&
          el.scrollHeight > el.offsetHeight
        ) {
          if (
            (lastTouchY <= curY && el.scrollTop === 0) ||
            (lastTouchY >= curY && el.scrollHeight - el.scrollTop === height)
          ) {
            evt.preventDefault()
          }
          return
        }
        el = el.parentNode
      }
      evt.preventDefault()
    },
    fixedIOS() {
      const el = this.$el
      let top = el.scrollTop
      let totalScroll = el.scrollHeight
      let currentScroll = top + el.offsetHeight

      if (top === 0) {
        el.scrollTop = 1
      } else if (currentScroll === totalScroll) {
        el.scrollTop = top - 1
      }
    }
  }
}
