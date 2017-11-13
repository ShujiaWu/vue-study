<template>
  <div class="progress">
    <div class="progress-bar" :style="{'background-color': color, width: `${value}%`, height: `${barHeight}px`}"></div>
  </div>
</template>

<script>
export default {
  name: 'w-Progress',
  props: {
    value: {
      type: Number,
      default: 0
    },
    barHeight: {
      type: Number,
      default: 5
    },
    color: {
      type: String,
      default: '#26a2ff'
    }
  }
}
</script>

<style scoped>
  .progress-bar {
    transition: all 0.1s;
  }
</style>
