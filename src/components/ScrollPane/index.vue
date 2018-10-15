<template>
  <div class="scroll-container" ref="scrollContainer" @wheel.prevent="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const padding = 15 // tag's padding

export default {
  name: 'scrollPane',
  data() {
    return {
      left: 0
    }
  },
  props: {
    rolling: {
      type: Number,
      default: 0
    }
  },
  computed: {
    container() {
      return this.$refs.scrollContainer.offsetWidth
    },
    wrapper() {
      return this.$refs.scrollWrapper.offsetWidth
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(0, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding)
          }
        } else {
          this.left = 0
        }
      }
    },
    moveLeft() {
      this.left = 0
    },
    moveRight() {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if ($containerWidth - padding < $wrapperWidth) {
        this.left = $containerWidth - $wrapperWidth - padding
      }
    },
    getWrapper() {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if ($containerWidth - padding < $wrapperWidth) {
        return true
      }
      return false
    },
    moveToTarget($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
        if ($targetLeft + padding + -this.left > $containerWidth) {
          this.left = $containerWidth - $wrapperWidth - padding
        } else {
          this.left = 0
        }
      } else {
        // tag in the right
        if (($targetLeft + $targetWidth < $containerWidth + $targetWidth) && this.getWrapper()) {
          this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
        } else {
          this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  .scroll-wrapper {
    position: absolute;
    -webkit-transition: -webkit-transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: -webkit-transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    -o-transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), -webkit-transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
