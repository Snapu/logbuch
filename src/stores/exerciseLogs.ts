import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import example1 from './examples/example1'

export type ExerciseLog = {
  exerciseName: string
  reps?: number
  distance?: number
  weight?: number
  duration?: number
  timestamp: number
}

export const useExerciseLogsStore = defineStore('exerciseLogs', () => {
  const exerciseLogs = useLocalStorage('exerciseLogs', [] as ExerciseLog[])
  const workoutFinished = useLocalStorage('workoutFinished', false)

  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const workoutStarted = computed(() =>
    exerciseLogs.value.find((log) => log.timestamp > startOfToday),
  )

  // reset on new day (i.e. workout not started yet)
  if (!workoutStarted) {
    workoutFinished.value = false
  }

  function addExerciseLog(log: ExerciseLog) {
    exerciseLogs.value.push({ ...log, exerciseName: log.exerciseName.trim().replace(/\s+/g, ' ') })
  }

  function removeExerciseLog(log: ExerciseLog) {
    exerciseLogs.value = exerciseLogs.value.filter(
      ({ exerciseName, timestamp }) =>
        !(exerciseName === log.exerciseName && timestamp === log.timestamp),
    )
  }

  function lastLogForExercise(exerciseName: string) {
    return exerciseLogs.value
      .filter((log) => exerciseName === log.exerciseName)
      .sort((a, b) => b.timestamp - a.timestamp)?.[0]
  }

  return {
    exerciseLogs,
    workoutFinished,
    workoutStarted,
    addExerciseLog,
    removeExerciseLog,
    lastLogForExercise,
  }
})
