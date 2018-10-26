<template>
  <div class="band">
    <h1 class="title">
      {{ how.title }}
    </h1>
    <h2 class="subtitle">
      {{ how.subtitle }}
    </h2>

    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      how: {
        title: 'How to Adopt?',
        subtitle: 'xxx',
        triptych: {
          one: { title: 'By pledging to keep your drain free of leaves and debris, you are joining your neighbors in helping to protect the environment, manage stormwater, and minimize flooding.' },
          two: { title: 'two' },
          three: { title: 'three' }
        }
      }
    }
  }
}
