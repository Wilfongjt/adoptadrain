/*export const hi = {
  mounted() {
      console.log('hi mixin')
  }
}*/

export const hello = {
  data() {
    return {
      msg: 'hello',
      smsg: 'hi'
    }
  },
  methods: {
    hi(){
      console.log(this.smsg)
    },
    hello() {
      console.log(this.msg)
    }
  },
  mounted(){
    this.hi()
    this.hello()
  }
}
