<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  useUserProfileStore,
  type UserProfile,
  type FitnessLevel,
  type WorkoutLocation,
  type FitnessGoal,
  type EquipmentOption,
} from '@/stores/userProfile'
import router from '@/router'

const userProfileStore = useUserProfileStore()
const form = reactive<UserProfile>({ ...userProfileStore.userProfile })
const tabs = ref(1)

onMounted(() => {
  tabs.value = userProfileStore.setupCompleted ? 2 : 1
})

const fitnessGoalLabels: [string, FitnessGoal][] = [
  ['🏋️ Build muscle', 'build_muscle'],
  ['🏃 Lose fat', 'lose_fat'],
  ['❤️ Improve endurance', 'improve_endurance'],
  ['🧘 Increase mobility', 'increase_mobility'],
  ['✅ General fitness', 'general_fitness'],
]
const fitnessLevelLabels: [string, FitnessLevel][] = [
  ['🟢 Beginner', 'beginner'],
  ['🟡 Intermediate', 'intermediate'],
  ['🔴 Advanced', 'advanced'],
]
const workoutDaysPerWeekLabels: [string, number][] = [
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5+', 5],
]
const workoutLocationLabels: [string, WorkoutLocation][] = [
  ['🏋️ Gym', 'gym'],
  ['🏠 Home', 'home'],
  ['🌍 Both', 'both'],
]
const equipmentOptionLabels: [string, EquipmentOption][] = [
  // 🔹 Minimal / No Equipment
  ['Bodyweight only', 'bodyweight'],

  // 🔸 Lightweight / Portable Equipment
  ['Resistance bands', 'resistance_bands'],
  ['Suspension trainer (e.g. TRX)', 'suspension_trainer'],
  ['Gymnastic rings', 'gymnastic_rings'],

  // 🔹 Calisthenics / Fixed Bars
  ['Pull-up bar', 'pull_up_bar'],
  ['Dip bar', 'dip_bar'],

  // 🔸 Free Weights
  ['Dumbbells', 'dumbbells'],
  ['Kettlebells', 'kettlebells'],
  ['Barbell & rack', 'barbell_rack'],
  ['Bench', 'bench'],

  // 🔹 Machines
  ['Cable machine', 'cable_machine'],
  ['Cardio machines', 'cardio_machine'],

  // 🔸 Functional Tools
  ['Medicine ball', 'medicine_ball'],
]

function save() {
  userProfileStore.saveUserProfile(form)
  router.push('/')
}
</script>

<template>
  <v-card>
    <div class="text-right">
      <v-btn variant="plain" icon="mdi-close" @click="() => save()"></v-btn>
    </div>
    <v-tabs-window v-model="tabs">
      <v-tabs-window-item :value="1">
        <v-card-text>
          <p class="text-h5">👋 Hello!</p>
          <p>I'm your AI personal fitness trainer! 🤖💪</p>
          <p>
            Before we begin, tell me a bit about you and your goals 🎯 so I can give you
            personalized feedback 💡
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => tabs++">Ok</v-btn>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="2">
        <v-card-text>
          <p class="text-h5">What's your main fitness goal?</p>
          <p>(Pick one or two)</p>
          <v-checkbox
            v-for="[label, value] in fitnessGoalLabels"
            v-model="form.fitnessGoal"
            :key="`fitnessGoalLabel-${value}`"
            :label="label"
            :value="value"
            multiple
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <v-card-text>
          <p class="text-h5">What’s your current fitness level?</p>
          <v-checkbox
            v-for="[label, value] in fitnessLevelLabels"
            v-model="form.fitnessLevel"
            :key="`fitnessLevelLabel-${value}`"
            :label="label"
            :value="value"
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="4">
        <v-card-text>
          <p class="text-h5">How many days per week do you want to train?</p>
          <v-checkbox
            v-for="[label, value] in workoutDaysPerWeekLabels"
            v-model="form.workoutDaysPerWeek"
            :key="`workoutDaysPerWeekLabel-${value}`"
            :label="label"
            :value="value"
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="5">
        <v-card-text>
          <p class="text-h5">Where do you work out most?</p>
          <v-checkbox
            v-for="[label, value] in workoutLocationLabels"
            v-model="form.workoutLocation"
            :key="`workoutLocationLabel-${value}`"
            :label="label"
            :value="value"
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="6">
        <v-card-text>
          <p class="text-h5">What equipment do you have access to?</p>
          <v-checkbox
            v-for="[label, value] in equipmentOptionLabels"
            v-model="form.equipmentAccess"
            :key="`equipmentOptionLabel-${value}`"
            :label="label"
            :value="value"
            hide-details
            multiple
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="7">
        <v-card-text>
          <p class="text-h5">What’s your age, height, and weight?</p>
          <v-text-field label="Age" type="number" v-model="form.age"></v-text-field>
          <v-text-field
            label="Height"
            type="number"
            v-model="form.heightCm"
            suffix="cm"
          ></v-text-field>
          <v-text-field
            label="Weight"
            type="number"
            v-model="form.weightKg"
            suffix="kg"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="8">
        <v-card-text>
          <p class="text-h5">Anything else that you want to tell me?</p>
          <v-textarea label="Free input" v-model="form.freeUserInput"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs--">Previous</v-btn>
          </div>
          <div class="tab-nav-button">
            <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
          </div>
        </v-card-actions>
      </v-tabs-window-item>

      <v-tabs-window-item :value="9">
        <v-card-text>
          <p class="text-h5">Finally, I need your Google Gemini API Key.</p>
          <p>(You can also do it later)</p>
          <p>
            Get it from:
            <a target="_blank" href="https://aistudio.google.com/apikey"
              >https://aistudio.google.com/apikey</a
            >
          </p>
          <v-text-field label="API Key" v-model="form.apiKey"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => save()">Save</v-btn>
        </v-card-actions>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<style scoped>
p {
  margin: 1rem 0;
}
.tab-nav-button {
  width: 100%;
}
</style>
