<template>
  <nav>
    <ul>
      <li><nuxt-link to="/">Home</nuxt-link></li>
      <li><nuxt-link to="/adopt">Adopt</nuxt-link></li>
      <li><nuxt-link to="/signin">{{ getSignInLabel }}</nuxt-link></li>
      <li><nuxt-link to="/account">{{ getUserName }}</nuxt-link></li>
    </ul>
  </nav>
</template>

<script>
export default {

  data() {
    return {
      title: 'Sponsors',
      subtitle: 'We can\'t do this alone.'
    }
  },
  computed: {
    salutation: function () {
      if (this.$store.state.authenticated) {
        return this.$store.state.user.name
      }
      return ""
    },
    getUserName: function () {
      return this.$store.getters.getUserName
    },
    authorized: function () {
      if ( !this.$store.state.authenticated ){ return false }
      return true
    },
    getSignInLabel: function () {
    if ( this.$store.state.authenticated ){ return 'Sign Out' }
    return 'Sign In'
    }
  }
}
</script>

<style scoped>
/* header {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
} */

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ECF0F1;
  /* background-color: #5DADE2; */

}

li {
  margin: 0 10px 4px;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
  font-weight: bold;
}

</style>
