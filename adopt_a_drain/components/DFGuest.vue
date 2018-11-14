<template>
  <div class="band">

    <div v-for="item in page.feedback">{{ item }}</div>
    <!-- div>{{ store.guest_session_token }}</div -->

  </div>
</template>

<script>
/*
The DFGuest establishes a connection to dreamfactory
* connect as guest to dreamfactory
* this connection can be leveraged to create an account or login

Objective: Provide least privileges access for a guest user
Strategy: set variable to manage login state
Requirement: setup a dreamfactory guest user i.e., guest@localhost.com 
Requirement: setup a GUEST_USER env variable
Requirement: setup a GUEST_PW env variable
Requirement:
*/
import axios from 'axios'

export default {

  data() {
    return {
      page: {
        title: 'Dreamfactory Guest',
        subtitle: 'Local Share.',
        feedback: []
      },
      payload: {
        email: process.env.GUEST_USER,
        password: process.env.GUEST_PW
      },
      headers: {
          "Content-Type": 'application/json; charset=utf-8',
          "Accept": "application/json; charset=utf-8",
          "User-Agent": 'Mozilla/5.0',
          "X-DreamFactory-Api-Key": process.env.DF_API_KEY
      },
      options: {
        rejectUnauthorized: false,
        host: process.env.DF_HOST,
        port: process.env.DF_PORT,
        ssl_port: 443,
        path: '/api/v2/user/session',
        method: 'POST',
        responseType: 'json'
      }
    }
  },
  computed: {
    store: function () {
      return this.$store.state
    },
    guestSessionOptions: function () {
      /*
      Objective: Authenticate a User
      Strategy: configure dreamfactory to accept CORS requests
        use OPTIONS to retrieve a session token
      */
      return {
        rejectUnauthorized: false,
        dataType: 'json',
        url: 'http://' + this.options.host + ':' + this.options.port + this.options.path,
        port: this.options.ssl_port,
        method: this.options.method,
        data: this.payload,
        headers: this.headers

      }
    }
  },
  mounted () {
    this.authenticateSession()
  },
  methods: {
    getGuestSessionUrl: function () {
      return 'http://localhost:8080' + this.options.path
    },
    authenticateSession: function () {
      // this.options.sessionToken = '<stub>'
      // this.options.method = 'POST'
      this.$store.commit('set_guest_session_token', null)
      this.page.feedback.push("Connecting...")

      this.$axios( this.guestSessionOptions )
        .then((response) => {
          let token = response.data.session_token
          this.$store.commit('set_guest_session_token', token)
          this.page.feedback.push("Connected.")
        })
        .catch((response) => {
          this.page.feedback.push("Error: " + JSON.stringify(response))
          // console.log("DFGuest error" + JSON.stringify(response))
        })
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;

}
</style>
