import { throttle as throttleFn } from 'throttle-debounce'

export default {
  name: 'VScroller',
  props: {
    preload: {
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
      touchstart: this.handleStart
    }
    const { throttle } = this
    if (throttle >= 0) {
      if (throttle === 0) {
        events.scroll = this.handleScroll
        events.touchmove = this.handleMove
      } else {
        events.scroll = throttleFn(throttle, this.handleScroll)
        events.touchmove = throttleFn(throttle, this.handleMove)
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
      const { $el, preload } = this
      if (isUp) {
        if (scrollTop > 0) {
          if (scrollTop < preload) {
            this.$emit('top')
          }
          this.$emit('scroll-up')
        }
      } else {
        if (scrollTop > 0) {
          this.$emit('scroll-down')
        }
        if ($el.scrollHeight - $el.clientHeight - scrollTop < preload) {
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
      this.lastTouchY = evt.touches[0].pageY
      this.fixedIOS()
    },
    handleMove(evt) {
      if (evt.touches[0].pageY > this.lastTouchY && this.lastScrollTop <= 0) {
        this.$emit('top')
      }
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
