export function fixed() {
  if (typeof window === 'undefined' || window.__ios_scroll_fixed__) {
    return
  }

  window.__ios_scroll_fixed__ = true

  const testDiv = document.createElement('div')
  document.documentElement.appendChild(testDiv)
  testDiv.style.WebkitOverflowScrolling = 'touch'
  const scrollSupport =
    'getComputedStyle' in window &&
    window.getComputedStyle(testDiv)['-webkit-overflow-scrolling'] === 'touch'
  document.documentElement.removeChild(testDiv)
  if (!scrollSupport) {
    return
  }

  let startY = 0
  let supportsPassiveOption = false

  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassiveOption = true
        return null
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {
    // do nothing
  }

  const handleTouchmove = function(evt) {
    // Get the element that was scrolled upon
    var el = evt.target

    // Allow zooming
    var zoom = window.innerWidth / window.document.documentElement.clientWidth
    if (evt.touches.length > 1 || zoom !== 1) {
      return
    }

    // Check all parent elements for scrollability
    while (el !== document.body && el !== document) {
      // Get some style properties
      var style = window.getComputedStyle(el)

      if (!style) {
        // If we've encountered an element we can't compute the style for, get out
        break
      }

      // Ignore range input element
      if (el.nodeName === 'INPUT' && el.getAttribute('type') === 'range') {
        return
      }

      var scrolling = style.getPropertyValue('-webkit-overflow-scrolling')
      var overflowY = style.getPropertyValue('overflow-y')
      var height = parseInt(style.getPropertyValue('height'), 10)

      // Determine if the element should scroll
      var isScrollable =
        scrolling === 'touch' &&
        (overflowY === 'auto' || overflowY === 'scroll')
      var canScroll = el.scrollHeight > el.offsetHeight

      if (isScrollable && canScroll) {
        // Get the current Y position of the touch
        var curY = evt.touches ? evt.touches[0].screenY : evt.screenY

        // Determine if the user is trying to scroll past the top or bottom
        // In this case, the window will bounce, so we have to prevent scrolling completely
        var isAtTop = startY <= curY && el.scrollTop === 0
        var isAtBottom =
          startY >= curY && el.scrollHeight - el.scrollTop === height

        // Stop a bounce bug when at the bottom or top of the scrollable element
        if (isAtTop || isAtBottom) {
          evt.preventDefault()
        }

        // No need to continue up the DOM, we've done our job
        return
      }

      // Test the next parent
      el = el.parentNode
    }

    // Stop the bouncing -- no parents are scrollable
    evt.preventDefault()
  }

  const handleTouchstart = function(evt) {
    // Store the first Y position of the touch
    startY = evt.touches ? evt.touches[0].screenY : evt.screenY
  }

  window.addEventListener(
    'touchstart',
    handleTouchstart,
    supportsPassiveOption ? { passive: false } : false
  )
  window.addEventListener(
    'touchmove',
    handleTouchmove,
    supportsPassiveOption ? { passive: false } : false
  )
}
