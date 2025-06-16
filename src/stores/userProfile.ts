import router from '@/router'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export type FitnessGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'improve_endurance'
  | 'increase_mobility'
  | 'general_fitness'

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced'

export type WorkoutLocation = 'gym' | 'home' | 'both'

export type EquipmentOption = 'dumbbells_barbells' | 'bands' | 'cardio_machines' | 'bodyweight_only'

export type UserProfile = {
  age?: number
  heightCm?: number
  weightKg?: number
  fitnessGoal?: FitnessGoal[]
  fitnessLevel?: FitnessLevel
  workoutDaysPerWeek?: number
  workoutLocation?: WorkoutLocation
  equipmentAccess?: EquipmentOption[]
  apiKey?: string
}

export const useUserProfileStore = defineStore('userProfile', () => {
  const userProfile = useLocalStorage('userProfile', {} as UserProfile)
  const setupCompleted = useLocalStorage('setupCompleted', false)

  function saveUserProfile(value: UserProfile) {
    userProfile.value = value
    setupCompleted.value = true
    router.push('/')
  }

  return { userProfile, setupCompleted, saveUserProfile }
})
