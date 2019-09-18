import { throttle as throttleFn } from 'throttle-debounce'
import fixedIOS from './fixedIOS'

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
    eventStep: {
      type: Number,
      default: 1
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
      lastTouchY: 0,
      refreshing: false
    }
  },
  beforeMount() {
    fixedIOS.open()
  },
  beforeDestroy() {
    fixedIOS.close()
  },
  methods: {
    handleStart(event) {
      this.lastTouchY = event.touches[0].clientY
    },
    handleMove(event) {
      const currentY = event.touches[0].clientY
      const offset = currentY - this.lastTouchY
      if (offset > 0 && this.lastScrollTop <= 0) {
        if (!this.refreshing && offset < this.eventStep) {
          return
        }
        this.refreshing = true
        this.$emit('refresh', { event, offset })
      }
    },
    handleEnd() {
      if (this.refreshing) {
        this.$emit('refresh-end')
        this.refreshing = false
      }
    },
    handleScroll(event) {
      const scrollTop = event.target.scrollTop
      const delta = this.lastScrollTop - scrollTop
      const isUp = delta > 0
      if (isUp) {
        if (
          scrollTop >= 0 &&
          scrollTop <= this.preloadTop &&
          delta >= this.eventStep
        ) {
          this.$emit('top')
        }
      } else {
        const el = this.$el
        if (
          el.scrollHeight - el.clientHeight - scrollTop <=
          this.preloadBottom
        ) {
          this.$emit('bottom')
        }
      }

      this.lastScrollTop = scrollTop
      this.$emit('scroll', {
        offsetTop: scrollTop,
        isUp
      })
    }
  },
  render(h) {
    const events = {}
    const { throttle } = this
    if (throttle >= 0) {
      if (throttle > 0) {
        events['&scroll'] = throttleFn(throttle, this.handleScroll)
      } else {
        events['&scroll'] = this.handleScroll
      }
      events['&touchstart'] = this.handleStart
      events['&touchmove'] = this.handleMove
      events['&touchend'] = this.handleEnd
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
  }
}
