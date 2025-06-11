import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export type Exercise = {
  name: string
}

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = useLocalStorage('exercises', [] as Exercise[])

  function addExercise(exercise: Exercise) {
    if (exercises.value.find(({ name }) => name === exercise.name)) {
      return
    }
    exercises.value.push(exercise)
  }

  function removeExercise(exercise: Exercise) {
    exercises.value = exercises.value.filter(({ name }) => name === exercise.name)
  }
  return { exercises, addExercise, removeExercise }
})
