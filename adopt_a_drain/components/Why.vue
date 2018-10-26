<template>
  <div class="band">

    <nav>
      <ul>
        <li>
          <div class="panel" >
            <h1 class="panel_title">
              {{ why.triptych.p1.title }}
            </h1>
            <h2 class="panel_description">
              {{ why.triptych.p1.description }}
            </h2>
            <ul class="panel_ul panel_description">
              <li v-for="item in why.triptych.p1.list">{{ item }}</li>
            </ul>
          </div>
        </li>
        <li>
          <div class="panel" >
            <h1 class="panel_title">
              {{ why.triptych.p2.title }}
            </h1>
            <h2 class="panel_description">
              {{ why.triptych.p2.description }}
            </h2>
            <ul class="panel_ul panel_description">
              <li v-for="item in why.triptych.p2.list">{{ item }}</li>
            </ul>
          </div>
        </li>
        <li>
          <div class="panel" >
            <h1 class="panel_title">
              {{ why.triptych.p3.title }}
            </h1>
            <h2 class="panel_description">
              {{ why.triptych.p3.description }}
            </h2>
            <ul class="panel_description">
              <li v-for="item in why.triptych.p3.list">{{ item }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>

</template>

<script>

export default {
  data() {
    return {
      why: {
        triptych: {
          p1: {
            title: 'Why Adopt?',
            description:' ',
            list: [
             'By pledging to keep your drain free of leaves and debris, you are joining your neighbors in helping to protect the environment, manage stormwater, and minimize flooding.'
            ]
          },
          p2: {
            title: 'How to Clean a Drain',
            description: ' ',
            list: [
              'Clean the drain before it rains',
              'Clear about 10 feet on both sides of drain'
            ]
          },
          p3: {
            title: 'Safety',
            description: ' ',
            list: [
              'Work from the curb side of street',
              'Never lift the grate',
              'Wear reflective clothing',
              'Wear gloves to avoid sharp objects',
              'Use a rake, broom or shovel - not your hands'
            ]
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.band {
  /*width: 100%;*/
  /*background-color: #cccccc;*/
  align-items: center;
  text-align: center;

}
.panel {
  width: 233px;
  text-align: left top;
  /*background-color: #aaaaaa;*/

}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  /* justify-content: center; */
  align-items: left;
}
li {
  margin: 0 10px;

}
.panel_title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 20px;
  color: #35495e;
  letter-spacing: 1px;
}
.panel_description {
  font-weight: 300;
  font-size: 16px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.panel_ul {
  align-items: left;
}

li {
  margin: 0 10px 10px;

}
</style>
