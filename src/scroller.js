import { throttle as throttleFn } from 'throttle-debounce'
import { fixedIOS } from './fixed'

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
    },
    reg: {
      type: String,
      default: ''
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
    const { reg } = this
    fixedIOS(reg ? new RegExp(reg) : '')
  },
  render: function(h) {
    const events = {}
    const { throttle } = this
    if (throttle >= 0) {
      if (throttle > 0) {
        events.scroll = throttleFn(throttle, this.handleScroll)
      } else {
        events.scroll = this.handleScroll
      }
      events.touchstart = this.handleStart
      events.touchmove = this.handleMove
      events.touchend = this.handleEnd
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
    handleStart(event) {
      this.lastTouchY = event.touches[0].clientY
    },
    handleMove(event) {
      const currentY = event.touches[0].clientY
      const offset = currentY - this.lastTouchY
      if (offset > 0 && this.lastScrollTop <= 0) {
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
    }
  }
}
