<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" v-if="isRouterAlive" ref="routerview"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    isRouterAlive() {
      return this.$store.state.app.isRouterAlive
    },
    slide() {
      return this.$store.state.app.isRouterAlive ? 'slide' : 'fade'
    }
  }
}
</script>

<style scoped>
.app-main {
  position: absolute;
  top: 0px; /* navbar + tags-view = 50 +34 */
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>

