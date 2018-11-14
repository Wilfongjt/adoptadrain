import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      counter: 0,
      page: null,
      authenticated: false,
      guest_session_token: null,
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
          state.user.name='guest'
          state.user.role=1
        }
      },
      set_guest_session_token(state ,guest_session_token ){
        //console.log('store set_guest_session_token')
        state.guest_session_token = guest_session_token
      }
    }
  })
}

export default createStore
