import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export type Exercise = {
  name: string
}

const clean = (s: string) => s.trim().replace(/\s+/g, ' ')

export const useExercisesStore = defineStore('exercises', () => {
  const exercises = useLocalStorage('exercises', [] as Exercise[])

  function addExercise(exercise: Exercise) {
    const cleaned = { ...exercise, name: clean(exercise.name) }
    if (exercises.value.find(({ name }) => clean(name) === cleaned.name)) {
      return
    }
    exercises.value.push(cleaned)
  }

  function removeExercise(exercise: Exercise) {
    exercises.value = exercises.value.filter(({ name }) => name === exercise.name)
  }
  return { exercises, addExercise, removeExercise }
})
