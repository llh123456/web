<template>
  <div :class="{'tags-view-container': true, 'tags-view-container-scrolling': true}">
    <span unselectable="unselectable" v-if="isShow" class="tabs-tab-prev" @click.prevent="leftRoll"><span class="el-icon-arrow-left"></span></span>
    <span unselectable="unselectable" v-if="isShowClose" title="关闭全部" class="tabs-tab-close" @click.prevent="closeAllTags"><span class="el-icon-delete"></span></span>
    <span unselectable="unselectable" v-if="isShow" class="tabs-tab-next" @click.prevent="rightRoll"><span class="el-icon-arrow-right"></span></span>
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="(tag, index) in Array.from(visitedViews)"
        :to="{ name: tag.name, params: tag.params, query: tag.query }" :key="tag.fullPath" @contextmenu.prevent.native="openMenu(tag,$event)">
        <span class="el-icon-refresh" @click.prevent.stop='refreshSelectedTag(tag)'></span>
        {{tag.title}}
        <span class='el-icon-close' v-if="tag.name != 'dashboard'" @click.prevent.stop='closeSelectedTag(tag, index)'></span>
        <span class='el-icon-no' v-else></span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      isShow: false,
      isShowClose: false,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
      this.backToTop()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
  },
  created() {
    this.$store.dispatch('addFirstVisitedViews', { 'name': 'dashboard', 'fullPath': '/dashboard', 'path': 'dashboard', 'meta': { 'title': '首页' }})
  },
  methods: {
    go(path) {
      this.$router.push({ name: path.name, query: path.query })
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isIndex() {
      for (let i = 0; i < this.visitedViews.length; i++) {
        if (this.visitedViews[i].name === 'dashboard') {
          return false
        } else {
          return true
        }
      }
    },
    isActive(route) {
      return route.name === this.$route.name
      // return route.fullPath === this.$route.fullPath || route.name === this.$route.name
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route).then(res => {
        if (res) {
          this.refreshSelectedTag()
        }
      })
      this.$nextTick(() => (this.getWidth()))
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.name === this.$route.name) {
            this.$refs.scrollPane.moveToTarget(tag.$el)
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('setRouterAlive', false)
      this.$store.dispatch('delCachedViews', route).then((v) => {
        setTimeout(() => {
          this.$store.dispatch('addCachedViews', route)
          this.$store.dispatch('setRouterAlive', true)
        }, 120)
      })
      // this.$nextTick(() => (this.$store.dispatch('setRouterAlive', true)))
    },
    closeSelectedTag(view, index) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        const latestView = views.slice(-1)[0]
        const nextView = this.visitedViews[index]
        if (nextView) {
          // this.$router.push(nextView.fullPath)
          this.$router.push({ name: nextView.name, params: nextView.params, query: nextView.query })
        } else if (latestView) {
          // this.$router.push(latestView.fullPath)
          this.$router.push({ name: latestView.name, params: latestView.params, query: latestView.query })
        } else {
          this.$router.push('/')
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.fullPath)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$confirm('是否继续?', '关闭所有标签', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
        if (this.visitedViews.length === 0) {
          this.$store.dispatch('addFirstVisitedViews', { 'name': 'dashboard', 'fullPath': '/dashboard', 'path': '/dashboard', 'meta': { 'title': '首页' }})
        }
      }).catch(() => {
      })
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    },
    leftRoll() {
      this.$refs.scrollPane.moveLeft()
    },
    rightRoll() {
      this.$refs.scrollPane.moveRight()
    },
    getWidth() {
      this.isShow = this.$refs.scrollPane.getWrapper()
      this.isShowClose = this.visitedViews.length > 3
    },
    backToTop() {
      setTimeout(() => {
        const div = document.getElementsByClassName('main-container')[0]
        div.scrollTop = 0
        // document.getElementById('main-container').scrollTop = 0
      }, 500)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container-scrolling {
  padding-left: 48px;
  padding-right: 32px;
}
.tags-view-container {
  white-space: nowrap;
  position: relative;
  zoom: 1;
  &:before, &:after {
    content: " ";
    display: table;
  }
  .tabs-tab-prev, .tabs-tab-next, .tabs-tab-close {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    margin-top: 6px;
    cursor: pointer;
    background-color: transparent;
    position: absolute;
    color: rgba(0, 0, 0, 0.43);
    -o-transition: color 0.3s ease;
    transition: color 0.3s ease;
    color: #add1ef;
  }
  .tabs-tab-prev {
    left: 0;
  }
  .tabs-tab-close {
    left: 23px;
  }
  .tabs-tab-next {
    right: 2px;
  }
  .tags-view-wrapper {
    height: 30px;
    overflow: hidden;
    /*border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);*/
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 30px;
      line-height: 30px;
      /*border: 1px solid #d8dce5;*/
      color: #ffffff;
      background: #0078d3;
      padding: 0 20px;
      font-size: 14px;
      margin-left: 1px;
      margin-top: 0px;
      text-align: center;
      border-radius: 5px 5px 0 0;
      position: relative;
      &:first-of-type {
        /*margin-left: 15px;*/
      }
      &:hover .el-icon-close{
        display: block;
      }
      &.active {
        background-color: #edf2f8;
        color: #666666;
        /*border-color: #42b983;*/
        /*&::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }*/
      }
      &.active:hover .el-icon-refresh{
        display: block;
      }
      .el-icon-refresh{
        font-size: 12px;
        font-weight: 200;
        position: absolute;
        top: 10px;
        left: 6px;
        color: #899dc1;
        display: none;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-no {
    }
    .el-icon-close {
      width: 10px;
      height: 16px;
      vertical-align: 2px;
      /*border-radius: 50%;*/
      text-align: center;
      position: absolute;
      right: 7px;
      top: 7px;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      color: #899dc1;
      font-size: 12px;
      display: none;
      /*transform-origin: 100% 50%;*/
      &:before {
        transform: scale(.6);
        /*display: inline-block;*/
        vertical-align: -3px;
      }
      &:hover {
        /*background-color: #b4bccc;*/
        /*color: #0b8bef;*/
      }
    }
  }
}
</style>
