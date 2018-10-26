import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      counter: 0,
      page: null,
      authenticated: false,
      user: {name: undefined, role: 0}
    }),
    mutations: {
      increment (state) {
        state.counter++
      },
      set_page (state, page_name) {
        state.page=page_name
      },
      set_authenticated(state, isAuthenticated){
        state.authenticated=isAuthenticated
        // testing/dev only
        if (!state.authenticated) {
          state.user.name=undefined
          state.user.role=0
        } else {
          state.user.name='Temp User Name'
          state.user.role=1
        }
      }
    }
  })
}

export default createStore
