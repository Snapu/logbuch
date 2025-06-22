<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted, watchEffect } from 'vue'
import { useExerciseLogsStore, type ExerciseLog } from '@/stores/exerciseLogs'
import { useExercisesStore } from '@/stores/exercises'
import { useAiStore } from '@/stores/ai'
import router from '@/router'
import { localeDateString } from '@/services/dateUtils'

const logsContainer = useTemplateRef('logs-container')
const dialog = ref(false)
const cacheAiFeedback = ref(false)
const open = ref([localeDateString(new Date())])

const aiStore = useAiStore()
const exercisesStore = useExercisesStore()
const exerciseLogsStore = useExerciseLogsStore()

const groupedLogs = computed(() =>
  exerciseLogsStore.exerciseLogs.reduce(
    (a, o) => {
      const day = localeDateString(new Date(o.timestamp))
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
  cacheAiFeedback.value = true
  aiStore.askAi()
}
</script>

<template>
  <div class="flex-container">
    <div ref="logs-container" class="logs-scrollable-container">
      <v-list v-model:opened="open" bg-color="transparent">
        <v-list-group
          v-for="[day, logs] in Object.entries(groupedLogs)"
          :key="day"
          :value="day"
          fluid
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="day"></v-list-item>
          </template>
          <v-list-item v-for="log in logs" :key="log.exerciseName + log.timestamp">
            <template v-slot:prepend>
              <v-btn
                variant="tonal"
                density="comfortable"
                icon="mdi-delete-outline"
                @click="() => deleteLog(log)"
                class="my-2 mr-6"
              ></v-btn>
            </template>
            <span class="mr-2"
              ><b>{{ log.exerciseName }}</b></span
            >
            <span v-if="log.reps" class="mr-1">{{ log.reps }} x</span>
            <span v-if="log.weight" class="mr-1">{{ log.weight }} kg</span>
            <span v-if="log.distance" class="mr-1">{{ log.distance }} m</span>
            <span v-if="log.duration" class="mr-1">{{ log.duration }} mins</span>
          </v-list-item>
        </v-list-group>
      </v-list>
    </div>

    <v-list bg-color="transparent">
      <v-divider></v-divider>
      <v-list-item>
        <v-checkbox
          label="Workout finished"
          v-model="exerciseLogsStore.workoutFinished"
          hide-details
          @update:model-value="() => (cacheAiFeedback = false)"
        ></v-checkbox>
        <template v-slot:append>
          <v-btn
            variant="tonal"
            icon="mdi-cog-outline"
            class="ma-2"
            @click="() => openSetup()"
          ></v-btn>
          <v-btn variant="tonal" icon="mdi-brain" class="ma-2" @click="() => askAi()"></v-btn>
        </template>
      </v-list-item>
    </v-list>

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
      <v-card-text id="markdown" :key="`${cacheAiFeedback}`"></v-card-text>
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
