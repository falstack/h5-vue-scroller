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
    }
  },
  data() {
    return {
      lastScrollTop: 0,
      lastTouchY: 0
    }
  },
  beforeMount() {
    fixedIOS()
  },
  render: function(h) {
    return h(
      this.tag,
      {
        style: {
          height: '100%',
          'overflow-y': 'auto',
          '-webkit-overflow-scrolling': 'touch'
        },
        class: 'v-scroller',
        on: {
          scroll:
            this.throttle > 0
              ? throttleFn(this.throttle, this.handleScroll)
              : this.handleScroll
        }
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
    }
  }
}
