<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted, watchEffect } from 'vue'
import { useExerciseLogsStore, type ExerciseLog } from '@/stores/exerciseLogs'
import { useExercisesStore } from '@/stores/exercises'
import { useAiStore } from '@/stores/ai'
import router from '@/router'

const logsContainer = useTemplateRef('logs-container')
const dialog = ref(false)
const cacheAiFeedback = ref(false)

const aiStore = useAiStore()
const exercisesStore = useExercisesStore()
const exerciseLogsStore = useExerciseLogsStore()

const localeDateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
}
const groupedLogs = computed(() =>
  exerciseLogsStore.exerciseLogs.reduce(
    (a, o) => {
      const day = new Date(o.timestamp).toLocaleDateString(undefined, localeDateOptions)
      a[day] = a[day] ? [...a[day], o] : [o]
      return a
    },
    {} as Record<string, ExerciseLog[]>,
  ),
)

const currentExerciseName = ref<string | null>(null)
const currentReps = ref<number | null>(null)
const currentDistance = ref<number | null>(null)
const currentWeight = ref<number | null>(null)
const currentDuration = ref<number | null>(null)

function scrollBottom() {
  if (logsContainer.value?.scrollTop !== undefined) {
    logsContainer.value.scrollTop = logsContainer.value?.scrollHeight
  }
}

function logCurrentExercise() {
  if (!currentExerciseName.value) return
  exercisesStore.addExercise({ name: currentExerciseName.value.trim() })
  exerciseLogsStore.addExerciseLog({
    timestamp: Date.now(),
    exerciseName: currentExerciseName.value,
    reps: currentReps.value ?? undefined,
    weight: currentWeight.value ?? undefined,
    distance: currentDistance.value ?? undefined,
    duration: currentDuration.value ?? undefined,
  })
  cacheAiFeedback.value = false
  setTimeout(() => scrollBottom(), 200)
}

function deleteLog(log: ExerciseLog) {
  exerciseLogsStore.removeExerciseLog(log)
}

onMounted(() => {
  setTimeout(() => scrollBottom(), 200)
})

watchEffect(() => {
  if (!currentExerciseName.value) return
  const lastLog = exerciseLogsStore.lastLogForExercise(currentExerciseName.value)
  currentReps.value = lastLog?.reps ?? null
  currentDistance.value = lastLog?.distance ?? null
  currentWeight.value = lastLog?.weight ?? null
  currentDuration.value = lastLog?.duration ?? null
})

function openSetup() {
  router.push('/setup')
}

function askAi() {
  dialog.value = true
  if (cacheAiFeedback.value) return
  aiStore.askAi()
  cacheAiFeedback.value = true
}
</script>

<template>
  <div class="flex-container">
    <div ref="logs-container" class="logs-scrollable-container">
      <div v-for="[day, logs] in Object.entries(groupedLogs)" :key="day">
        <h3 class="mb-4 text-center">{{ day }}</h3>
        <div
          v-for="log in logs"
          :key="log.exerciseName + log.timestamp"
          color="rgba(255,255,255, 0.9)"
          class="mb-1 log-item"
        >
          <v-container fluid>
            <v-row no-gutters>
              <v-col>
                <span class="mr-2"
                  ><b>{{ log.exerciseName }}</b></span
                >
                <span v-if="log.reps" class="mr-1">{{ log.reps }} x</span>
                <span v-if="log.weight" class="mr-1">{{ log.weight }} kg</span>
                <span v-if="log.distance" class="mr-1">{{ log.distance }} m</span>
                <span v-if="log.duration" class="mr-1">{{ log.duration }} mins</span>
              </v-col>
              <v-col class="text-right">
                <v-btn
                  variant="tonal"
                  density="comfortable"
                  icon="mdi-delete-outline"
                  @click="() => deleteLog(log)"
                ></v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
        </div>
      </div>
    </div>

    <div class="text-center">
      <v-btn
        variant="outlined"
        density="comfortable"
        icon="mdi-cog-outline"
        class="mr-4"
        @click="() => openSetup()"
      ></v-btn>
      <v-btn
        variant="outlined"
        size="large"
        prepend-icon="mdi-creation"
        class="my-4"
        @click="() => askAi()"
        >Get AI Feedback</v-btn
      >
    </div>

    <v-card elevation="16">
      <v-card-text>
        <v-container fluid class="pa-0">
          <v-row dense class="mb-2">
            <v-col>
              <v-combobox
                v-model="currentExerciseName"
                :items="exercisesStore.exercises.map(({ name }) => name)"
                label="Exercise"
                hide-details
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                v-model="currentReps"
                type="number"
                label="Reps"
                suffix="x"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="currentWeight"
                type="number"
                label="Weight in kg"
                suffix="kg"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-text-field
                v-model="currentDistance"
                type="number"
                label="Distance in m"
                suffix="m"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="currentDuration"
                type="number"
                label="Duration in mins"
                suffix="mins"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="tonal"
          size="large"
          prepend-icon="mdi-plus"
          block
          :disabled="!currentExerciseName"
          @click="() => logCurrentExercise()"
          >log</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
  <v-dialog v-model="dialog" fullscreen eager>
    <v-card title="AI Feedback ✨" height="100%">
      <v-card-text id="markdown"></v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" size="large" block text="Close" @click="dialog = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.logs-scrollable-container {
  flex: 1 1 auto;
  overflow-y: auto;
  height: 0px;
  scroll-behavior: smooth;
}
</style>

<style lang="postcss">
#markdown {
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  ul,
  ol {
    margin: 1rem 0;
  }
  ul,
  ol {
    padding-left: 2rem;
  }
}
</style>
