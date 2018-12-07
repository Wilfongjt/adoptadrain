export const restTemplates = {
  data() {
    return {
      rest_templates: [
        {
          // dreamfactory guest session
          name: "guest",
          description: "abc",
          //type: "user-session",
          data_tmpl: {
            "email": "%e",
            "password": "%p"
          },
          source: {
            name: "dreamfactory",
            type: "user-session",
            connector: {
              url_tmpl: 'http://%h:%p/api/v2/user/session'
            }
          }
        },
        {
          // dreamfactory user
          name: "new-system-user",
          description: "",
          // type: "system-user",
          source: {
            name: "dreamfactory",
            type: "system-user",
            connector: {
              url_tmpl: 'http://%h:%p/api/v2/system/user'
            }
          }
        },
        {
          // name: "pg-add-user",
          name: "add-user",
          description: "",
          //type: "func",
          dependent: "system-user",
          source: {
            name: "dreamfactory",
            type: "func",
            connector: {
              url_tmpl: 'http://%h:%p/api/v2/adopt_a_drain/_func/add_user'
            }
          }
        },
        {
          name: "available",
          description: "all drains within the screen i.e. viewtangle",
          viewtangle: {},
          source: {
            name: "data.world",
            type: "service",
            connector: {
              //service_service: process.env.OPEN_SOURCE,//deprecated
              url_tmpl: "%o", //process.env.OPEN_SOURCE,
              query_tmpl: "select * from grb_drains where (dr_lon > %w and dr_lon < %e) and (dr_lat > %s and dr_lat < %n) %d",
              data_tmpl: '{ "query": "%q", "includeTableSchema": false }'
            }
          }
        },
        {
          name: "adopted",
          description: "all adopted and adopted by you drains within the viewtangle",
          viewtangle: {},
          source: {
            name: "dreamfactory",
            type: "func",
            connector: {
              service_url: process.env.DF_SOURCE + "/api/v2/adopt_a_drain/_func/", // deprecated
              // query_tmpl: "select * from things where (user_id isNot NULL and user_id > 0) and (lon > %w and lon < %e) and (lat > %s and lat < %n) %d"
              func_tmpl: "get_adopted(%w, %e, %n, %s, %v)", // deprecated
              url_tmpl: 'http://%h:%p/api/v2/adopt_a_drain/_func/get_adopted(%w, %e, %n, %s, %v)'
            }
          }
        }
      ]
    }
  },
  methods: {
    getRestTemplate(lyrName) {
      //console.log(JSON.stringify(this.rest_templates))
      let lyr = null
      let lyrIdx
      for(lyrIdx in this.rest_templates){
        if(this.rest_templates[lyrIdx].name === lyrName){
          lyr = this.rest_templates[lyrIdx]
          break
        }
      }
      return lyr
    },
    dataworldify(lyr) {
      //console.log('dataworldify 1')
      let url = lyr.source.connector.url_tmpl.replace('%o',process.env.OPEN_SOURCE)
      //console.log('dataworldify 2')
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.DW_AUTH_TOKEN
      }
      //console.log('dataworldify 3')
      let query_str = lyr.source.connector.query_tmpl
        .replace('%w',lyr.viewtangle.west)
        .replace('%e',lyr.viewtangle.east)
        .replace('%n',lyr.viewtangle.north)
        .replace('%s',lyr.viewtangle.south)
        .replace('%d',this.getDownloadedDrains())
      //console.log('dataworldify 4')
      let _data = lyr.source.connector.data_tmpl
          .replace('%q', query_str)
      //console.log('dataworldify 5')
      //console.log('dataworkdify 6: '+ _data)
      //console.log('dataworkdify 7: '+ JSON.parse(_data))
      let rest_request = {
        method: 'POST',
        url: url,
        headers: headers,
        data: JSON.parse(_data)
      }


      //
      //let url = lyr.source.connector.url_tmpl.replace('%o',process.env.OPEN_SOURCE)
      //

     //
      //let _data = lyr.source.connector.data_tmpl.replace('%q', query_str)
      //console.log('dataworldify 6')
      //rest_request.headers = headers
      //console.log('dataworldify 7')
      // rest_request.data = { query: lyr.query_str, includeTableSchema: false }

        //XXXXXXXXX
      //console.log('dataworldify ' + JSON.stringify(rest_request))
      //console.log('dataworldify out')
      return rest_request
    },
    dreamfactorify( lyr, lyrData) {
      //console.log('dreamfactorify 1')
      let rest_request = {
        rejectUnauthorized: false,
        dataType: 'json',
        port: 433,
        method: 'POST',
        url: null,
        headers: null,
        data: {},
      }
      // HEADERS
      let headers = {
        "Content-Type": 'application/json; charset=utf-8',
        "Accept": "application/json; charset=utf-8",
        "User-Agent": 'Mozilla/5.0',
        "X-DreamFactory-Api-Key": process.env.DF_API_KEY
      }
      //console.log('dreamfactorify 1.1 lyr.source.type: ' + lyr.source.type)
      //if(lyr.source.type === 'system-user'){}
      if(lyr.source.type === 'system-user'){
        //console.log('dreamfactorify 2.3.1')
        rest_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        //console.log('dreamfactorify  2.3.2')
        // Data
        if(lyrData.data){
          //console.log('dreamfactorify 2.2.3')
          rest_request.data = {resource: [ lyrData.data ] }
          //rest_equest.data['xxxresource']=lyrData.data
        }
        //console.log('dreamfactorify 2.2.6')
        rest_request.headers = headers
        rest_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken

      }
      //console.log('dreamfactorify 2.1')
      // ADD-User TO DB
      if(lyr.source.type === 'func'){
          //console.log('dreamfactorify 2.2.1')
          rest_request.url=lyr.source.connector.url_tmpl
            .replace('%h',process.env.DF_HOST)
            .replace('%p',process.env.DF_PORT)
            //console.log('dreamfactorify 2.2.2')
        // Data
        if(lyrData.data){
          //console.log('dreamfactorify 2.2.3')
          rest_request.data = {resource: [ lyrData.data ] }
          //rest_equest.data['xxxresource']=lyrData.data
        }
        // PARAMS
        if(lyrData.params){
          //console.log('dreamfactorify 2.2.4')
          rest_request.data['params']=lyrData.params
        }
        // CUSTOM Func stuff
        if(lyr.name === 'add-user'){
          //console.log('dreamfactorify 2.2.5')
          rest_request.data['returns']="string"
        }
        //console.log('dreamfactorify 2.2.6')
        rest_request.headers = headers
        rest_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken
        //console.log('dreamfactorify 2.2.7')
      }

      // GUEST SIGNIN
      if(lyr.source.type==='user-session'){
        //console.log('dreamfactorify 2.1.1')
        // HEADERS
        rest_request.headers=headers
        //console.log('dreamfactorify 2.1.2')
        // URL
        rest_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        //console.log('dreamfactorify 2.1.3')
        // DATA
        rest_request.data['email']= ' '
        rest_request.data['password']= ' '
        rest_request.data.email = lyr.data_tmpl.email.replace('%e',process.env.GUEST_USER)
        rest_request.data.password = lyr.data_tmpl.password.replace('%p',process.env.GUEST_PW)
        //console.log('dreamfactorify 2.1.4')
        //df_request['data']['password'] = lyr['password'].replace('%e',process.env.GUEST_PW)
      }

      //console.log('dreamfactorify out')
      return rest_request
    },
    requestify( lyr, lyrData  ) {

      /*
       * the guest login doesn't require a lyr = {}
      */
      //console.log('requestify 1')
      /*
      let rest_request = {
        rejectUnauthorized: false,
        dataType: 'json',
        port: 433,
        method: 'POST',
        url: null,
        headers: null,
        data: {},
      }
      */
      let rest_request = null
      //console.log('requestify 1.1')
      try {
        if(lyr.source.name === 'data.world') {
          //console.log('requestify 1.1.DW')
          rest_request = this.dataworldify(lyr, lyrData)
        }
        if(lyr.source.name==='dreamfactory') {
          //console.log('requestify 1.2.DF')
          rest_request = this.dreamfactorify(lyr, lyrData)
        }
        //console.log('requestify 2')
        /*
        if(lyr.source.name==='dreamfactory') {

          console.log('requestify 2.1 move to dreamfactorify')

        }
        */
        //console.log('requestify 3  ') // + JSON.stringify(rest_request))
        if(! rest_request.url ){
          throw new Error('requestify is missing url')
        }
        //console.log('requestify 4')
        if(! rest_request.headers ){
          throw new Error('requestify is missing headers')
        }
        //console.log('requestify 5')
        if(! rest_request.data ){
          throw new Error('requestify is missing data')
        }
        //console.log('requestify out')
      }catch(err){
        //console.log('-----')
        console.error('ERROR requestify lyr: ' + JSON.stringify(lyr))
        console.error('ERROR requestify:' + err)
      }
      return rest_request
    }
  }

}
