import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      counter: 0,
      page: null,
      authenticated: false,
      guest_session_token: null,
      default_user: {name: undefined, role: 0},
      user: {name: undefined, role: 0}
    }),
    getters: {
      isAuthenticated: state => {
        return state.authenticated
      },
      getUserName: state => {
        if(state.user.name === undefined){
          return "Account"
        }
        return state.user.name
      }
    },
    mutations: {
      increment (state) {
        state.counter++
      },
      set_page (state, page_name) {
        state.page=page_name
      },
      set_user(state, authent){
        /*
           authent is {"id": int , "name": "somename"}
        */
        try {
          state.authenticated=(authent.id > 0)
          if (!state.authenticated) {
            state.user.name=state.default_user.name
            state.user.role=state.default_user.role
          } else {
            state.user.name=authent.name
            state.user.role=1
          }
        } catch(err){
          // this is bad authent format
          state.authenticated=false
          state.user.name=state.default_user.name
          state.user.role=state.default_user.role
        }
      },
      sign_out () {
        state.authenticated=false
        state.user.name=state.default_user.name
        state.user.role=state.default_user.role
      },

      set_guest_session_token(state ,guest_session_token ){
        //console.log('store set_guest_session_token')
        state.guest_session_token = guest_session_token
      }
    }
  })
}

export default createStore
