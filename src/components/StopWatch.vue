<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'

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
  playBeep()
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
    totalSeconds.value = 0
  } else {
    timer.value = setInterval(() => totalSeconds.value++, 1000)
  }
}

function playBeep() {
  // @ts-ignore
  const context = new (window.AudioContext || window.webkitAudioContext)();

  if (context.state === 'suspended') {
    context.resume(); // Resume if needed
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, context.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  gainNode.gain.setValueAtTime(1, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);

  oscillator.stop(context.currentTime + 0.2);
}

watchEffect(() => {
  if (totalSeconds.value !== 0 && totalSeconds.value % 30 === 0) playBeep()
})
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
