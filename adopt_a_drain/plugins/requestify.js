import Vue from 'vue'
// DEPRECATE
Vue.prototype.$requestify = (lyr, lyrData ) => {
  /*
   * the guest login doesn't require a lyr = {}
  */
  console.log('requestify 1')
  let rest_request = {
    rejectUnauthorized: false,
    dataType: 'json',
    port: 433,
    method: 'POST',
    url: null,
    headers: null,
    data: {},
  }

  console.log('requestify 2')
  try {
    if(lyr.source.type==='dreamfactory') {
      console.log('requestify 2.1')
      // HEADERS
      let headers = {
        "Content-Type": 'application/json; charset=utf-8',
        "Accept": "application/json; charset=utf-8",
        "User-Agent": 'Mozilla/5.0',
        "X-DreamFactory-Api-Key": process.env.DF_API_KEY
      }
      console.log('lyr.type: ' + lyr.type)
      if(lyr.type === 'system-user'){
        console.log('2.3.1')
        rest_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        console.log('requestify 2.3.2')
        // Data
        if(lyrData.data){
          //console.log('requestify 2.2.3')
          rest_request.data = {resource: [ lyrData.data ] }
          //rest_equest.data['xxxresource']=lyrData.data
        }
        //console.log('requestify 2.2.6')
        rest_request.headers = headers
        rest_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken

      }
      //console.log('requestify 2.1')
      // ADD-User TO DB
      if(lyr.type === 'func'){
          //console.log('requestify 2.2.1')
          rest_request.url=lyr.source.connector.url_tmpl
            .replace('%h',process.env.DF_HOST)
            .replace('%p',process.env.DF_PORT)
            //console.log('requestify 2.2.2')
        // Data
        if(lyrData.data){
          //console.log('requestify 2.2.3')
          rest_request.data = {resource: [ lyrData.data ] }
          //rest_equest.data['xxxresource']=lyrData.data
        }
        // PARAMS
        if(lyrData.params){
          //console.log('requestify 2.2.4')
          rest_request.data['params']=lyrData.params
        }
        // CUSTOM Func stuff
        if(lyr.name === 'add-user'){
          //console.log('requestify 2.2.5')
          rest_request.data['returns']="string"
        }
        //console.log('requestify 2.2.6')
        rest_request.headers = headers
        rest_request.headers['X-DreamFactory-Session-Token']=lyrData.sessionToken
        //console.log('requestify 2.2.7')
      }

      // GUEST SIGNIN
      if(lyr.type==='user-session'){
        //console.log('requestify 2.1.1')
        // HEADERS
        rest_request.headers=headers
        //console.log('requestify 2.1.2')
        // URL
        rest_request.url=lyr.source.connector.url_tmpl
          .replace('%h',process.env.DF_HOST)
          .replace('%p',process.env.DF_PORT)
        //console.log('requestify 2.1.3')
        // DATA
        rest_request.data['email']= ' '
        rest_request.data['password']= ' '
        rest_request.data.email = lyr.data_tmpl.email.replace('%e',process.env.GUEST_USER)
        rest_request.data.password = lyr.data_tmpl.password.replace('%p',process.env.GUEST_PW)
        //console.log('requestify 2.1.4')
        //df_request['data']['password'] = lyr['password'].replace('%e',process.env.GUEST_PW)
      }
    }
    if(! rest_request.url ){
      throw new Error('requestify is missing url')
    }
    if(! rest_request.headers ){
      throw new Error('requestify is missing headers')
    }
    if(! rest_request.data ){
      throw new Error('requestify is missing data')
    }
  }catch(err){
    //console.log('-----')
    console.error('ERROR requestify:' + err)
  }
  return rest_request
}
