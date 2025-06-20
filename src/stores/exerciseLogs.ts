import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

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
  return { exerciseLogs, addExerciseLog, removeExerciseLog, lastLogForExercise }
})
