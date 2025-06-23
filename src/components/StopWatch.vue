<script setup lang="ts">
import { computed, ref } from 'vue'

const totalSeconds = ref(0)
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const formatedTime = computed(() => {
  const duration = {
    hours: Math.floor(totalSeconds.value / 3600),
    minutes: Math.floor((totalSeconds.value % 3600) / 60),
    seconds: totalSeconds.value % 60,
  }
  // @ts-ignore
  return new Intl.DurationFormat(undefined, { style: 'digital' }).format(duration)
})

function toggleTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
    totalSeconds.value = 0
  } else {
    timer.value = setInterval(() => totalSeconds.value++, 1000)
  }
}
</script>

<template>
  <v-btn
    :prepend-icon="timer ? 'mdi-pause' : 'mdi-play'"
    variant="tonal"
    size="large"
    class="my-2 text-mono"
    @click="toggleTimer"
    >{{ formatedTime }}</v-btn
  >
</template>
