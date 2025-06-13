<script setup lang="ts">
import { computed, ref, useTemplateRef, onMounted } from 'vue'
import { useExerciseLogsStore, type ExerciseLog } from '@/stores/exerciseLogs'
import { useExercisesStore } from '@/stores/exercises'

const logsContainer = useTemplateRef('logs-container')

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
const currentWeight = ref<number | null>(null)
const currentDuration = ref<number | null>(null)

const currentDurationInsteadWeight = ref<boolean>(false)

function scrollBottom() {
  if (logsContainer.value?.scrollTop !== undefined) {
    logsContainer.value.scrollTop = logsContainer.value?.scrollHeight
  }
}

function logCurrentExercise() {
  if (!currentExerciseName.value || !currentReps.value) return
  exercisesStore.addExercise({ name: currentExerciseName.value.trim() })
  exerciseLogsStore.addExerciseLog({
    timestamp: Date.now(),
    exerciseName: currentExerciseName.value,
    reps: currentReps.value,
    ...(!currentDurationInsteadWeight.value && currentWeight.value !== null
      ? { weight: currentWeight.value }
      : {}),
    ...(currentDurationInsteadWeight.value && currentDuration.value !== null
      ? { duration: currentDuration.value }
      : {}),
  })

  setTimeout(() => scrollBottom(), 200)
}

function deleteLog(log: ExerciseLog) {
  exerciseLogsStore.removeExerciseLog(log)
}

function toggleDurationInsteadWeight() {
  currentDurationInsteadWeight.value = !currentDurationInsteadWeight.value
}

onMounted(() => {
  setTimeout(() => scrollBottom(), 200)
})
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
                <b>{{ log.exerciseName }}</b> {{ log.reps }} x
                <span v-if="log.weight">{{ log.weight }} kg</span>
                <span v-if="log.duration">{{ log.duration }} mins</span>
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

    <!-- <div class="text-center">
      <v-btn variant="outlined" prepend-icon="mdi-creation" class="my-4">Get AI Feedback</v-btn>
    </div> -->

    <v-card elevation="16">
      <v-card-text>
        <v-combobox
          v-model="currentExerciseName"
          :items="exercisesStore.exercises.map(({ name }) => name)"
          label="Exercise"
        ></v-combobox>
        <v-text-field v-model="currentReps" type="number" label="Reps" suffix="x"></v-text-field>
        <v-text-field
          v-if="currentDurationInsteadWeight"
          v-model="currentDuration"
          type="number"
          label="Duration"
          suffix="mins"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-weight"
              variant="tonal"
              density="comfortable"
              @click="() => toggleDurationInsteadWeight()"
            ></v-btn>
          </template>
        </v-text-field>
        <v-text-field v-else v-model="currentWeight" type="number" label="Weight" suffix="kg">
          <template v-slot:append>
            <v-btn
              icon="mdi-timer"
              variant="tonal"
              density="comfortable"
              @click="() => toggleDurationInsteadWeight()"
            ></v-btn>
          </template>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="tonal"
          prepend-icon="mdi-plus"
          block
          :disabled="!currentExerciseName || !currentReps"
          @click="() => logCurrentExercise()"
          >log</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
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
