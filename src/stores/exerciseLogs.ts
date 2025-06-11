import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export type ExerciseLog = {
  exerciseName: string
  reps: number
  weight?: number
  duration?: number
  timestamp: number
}

export const useExerciseLogsStore = defineStore('exerciseLogs', () => {
  const exerciseLogs = useLocalStorage('exerciseLogs', [] as ExerciseLog[])

  function addExerciseLog(log: ExerciseLog) {
    exerciseLogs.value.push(log)
  }

  function removeExerciseLog(log: ExerciseLog) {
    exerciseLogs.value = exerciseLogs.value.filter(
      ({ exerciseName, timestamp }) =>
        !(exerciseName === log.exerciseName && timestamp === log.timestamp),
    )
  }
  return { exerciseLogs, addExerciseLog, removeExerciseLog }
})
