<script setup lang="ts">
import { computed, ref } from 'vue'

const totalMs = ref(0)
const startTimestamp = ref(Date.now())
const timer = ref<ReturnType<typeof setInterval> | null>(null)
const formatedTime = computed(() => {
  const totalSeconds = Math.floor(totalMs.value / 1000)
  const duration = {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
  // @ts-ignore
  return new Intl.DurationFormat(undefined, { style: 'digital' }).format(duration)
})

function toggleTimer() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  } else {
    startTimestamp.value = Date.now()
    timer.value = setInterval(() => {
      totalMs.value = Date.now() - startTimestamp.value
    }, 1000)
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
