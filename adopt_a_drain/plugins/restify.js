import Vue from 'vue'

Vue.prototype.$restify = (lyr, lyrData ) => {
  // lyr is
  // lyrData is { session-token: , data: , params:  }
  //console.log('requestify sessionToken: ' + lyr.name+ '  ' + sessionToken)
  // guest is {}
  let df_request = {
    rejectUnauthorized: false,
    dataType: 'json',
    port: 433,
    method: 'POST',
    headers: {},
    data: {}
  }
  //console.log('restify 1')
  try {
    if(lyr.source.type==='dreamfactory'){
      //console.log('restify 2')
      // HEADERS
      let headers = {
        "Content-Type": 'application/json; charset=utf-8',
        "Accept": "application/json; charset=utf-8",
        "User-Agent": 'Mozilla/5.0',
        "X-DreamFactory-Api-Key": process.env.DF_API_KEY,
        "X-DreamFactory-Session-Token": null
      }
      //console.log('headers 1: ' + JSON.stringify(headers))
      //df_request.headers=lyrData.headers
      df_request.headers=headers
      df_request.url=lyr.source.connector.url_tmpl
        .replace('%h',process.env.DF_HOST)
        .replace('%p',process.env.DF_PORT)
      // add_user
      //console.log('restify 3')
      if(lyr.type==='func'){
          // Data
          df_request.data= {
              "resource": [ lyrData.data ],
              "params": lyr.params,
              "returns": "string"
          }
          df_request.headers["X-DreamFactory-Session-Token"]=lyrData.sessionToken
      }
      // USER SESSION
      //console.log('restify 4')
      if(lyr.type==='user-session'){
        // Data
        df_request.data= {
            "resource": [ lyrData.data ],
        }
        // have to have token befor calling
        // token passed with requestify(lyr, sesssionToken)
        df_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken
        // console.log('header 2: ' + JSON.stringify(headers))
        if(lyr.source.connector.method){
          df_request.method = lyr.source.connector.method
        } else {
          df_request.method = 'GET'
        }
        //console.log('df_request: ' + JSON.stringify(df_request))
      }
      //console.log('restify 5')
      // NEW USER
      if(lyr.type==='new-user'){
        //console.log('restify 5.1')
        // Data
        df_request.data= {
            "resource": [ lyrData.data ],
        }
        //console.log('restify 5.2')
        // have to have token befor calling
        // token passed with requestify(lyr, sesssionToken)
        //console.log('restify 5.2.1: ' + lyrData.sessionToken)
        df_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken
        // console.log('header 2: ' + JSON.stringify(headers))
        //console.log('restify 5.3')
      }
      //console.log('restify 6')
       // GUEST SIGNIN
      if(lyr.type==='user-session'){
        df_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        // Data
        df_request.data['email']= ' '
        df_request.data['password']= ' '
        df_request.data.email = lyr.data_tmpl.email.replace('%e',process.env.GUEST_USER)
        df_request.data.password = lyr.data_tmpl.password.replace('%p',process.env.GUEST_PW)

        //df_request['data']['password'] = lyr['password'].replace('%e',process.env.GUEST_PW)

      }
    }
  }catch(err){
    console.log('ERROR $restify A: ' + JSON.stringify(lyr))
    console.log('ERROR $restify B:' + JSON.stringify(lyrData))
    console.log('ERROR requestify C:')
    console.log('ERROR requestify D:' + err)
    //show_object(df_request)
  }
  //show_object(df_request)
  //console.log('resttify out: ' + JSON.stringify( df_request ))
  return df_request
}
