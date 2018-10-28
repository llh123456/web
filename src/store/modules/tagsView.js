const tagsView = {
  state: {
    visitedViews: [],
    cachedViews: []
  },
  mutations: {
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.name === view.name)) return
      state.visitedViews.push({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        query: view.query,
        title: view.meta.title || 'no-name'
      })
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    ADD_FIRST_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.some(v => v.name === view.name)) return
      state.visitedViews.unshift({
        name: view.name,
        path: view.path,
        fullPath: view.fullPath,
        query: view.query,
        title: view.meta.title || 'no-name'
      })
      if (!view.meta.noCache) {
        state.cachedViews.unshift(view.name)
      }
    },
    DEL_VISITED_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === view.name) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews.splice(index, 1)
          break
        }
      }
    },
    DEL_OTHERS_VIEWS: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.name === view.name) {
          state.visitedViews = state.visitedViews.slice(i, i + 1)
          break
        }
      }
      for (const i of state.cachedViews) {
        if (i === view.name) {
          const index = state.cachedViews.indexOf(i)
          state.cachedViews = state.cachedViews.slice(index, i + 1)
          break
        }
      }
    },
    ADD_CACHED_VIEWS: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      if (index !== -1) {
        state.cachedViews.splice(index, 1)
      }
    },
    DEL_ALL_VIEWS: (state) => {
      state.visitedViews = []
      state.cachedViews = []
    }
  },
  actions: {
    addVisitedViews({ commit, state }, view) {
      return new Promise((resolve, reject) => {
        var item = {}
        var type = false
        for (const [i, v] of tagsView.state.visitedViews.entries()) {
          if (v.name === view.name) {
            item = tagsView.state.visitedViews[i]
            break
          }
        }
        if ((view.fullPath !== item.fullPath) && item.fullPath) {
          item.name = view.name
          item.path = view.path
          item.fullPath = view.fullPath
          item.query = view.query
          item.title = view.meta.title || 'no-name'
          type = true
        }
        commit('ADD_VISITED_VIEWS', view)
        resolve(type)
      })
    },
    addFirstVisitedViews({ commit }, view) {
      commit('ADD_FIRST_VISITED_VIEWS', view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_OTHERS_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit('DEL_ALL_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    addCachedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('ADD_CACHED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit('DEL_CACHED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    }
  }
}

export default tagsView
