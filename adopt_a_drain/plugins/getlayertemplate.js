import Vue from 'vue'

Vue.prototype.$getLayerTemplate = (lyrName ) => {
  let lyr = {}
  let layers = [
    {
      name: "guest",
      description: "abc",
      type: "user-session",
      data_tmpl: {
        "email": "%e",
        "password": "%p"
      },
      source: {
        type: "dreamfactory",
        connector: {
          url_tmpl: 'http://%h:%p/api/v2/user/session'
        }
      }
    },
    {
      //name: "df-new-user",
      name: "system-user",
      description: "",
      type: "new-user",
      source: {
        type: "dreamfactory",
        connector: {
          url_tmpl: 'http://%h:%p/api/v2/system/user'
        }
      }
    },
    {
      // name: "pg-add-user",
      name: "add-user",
      description: "",
      type: "func",
      dependent: "system-user",
      source: {
        type: "dreamfactory",
        connector: {
          url_tmpl: 'http://%h:%p/api/v2/adopt_a_drain/_func/add_user'
        }
      }
    }
  ]
  let lyrIdx
  for(lyrIdx in layers){
    if(layers[lyrIdx].name === lyrName){
      lyr = layers[lyrIdx]
      break
    }
  }
  return lyr
}
