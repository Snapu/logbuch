<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  useUserProfileStore,
  type UserProfile,
  type FitnessLevel,
  type WorkoutLocation,
  type FitnessGoal,
  type EquipmentOption,
} from '@/stores/userProfile'

const userProfileStore = useUserProfileStore()
const form = reactive<UserProfile>({ ...userProfileStore.userProfile })
const tabs = ref(1)

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
  ['Dumbbells/barbells', 'dumbbells_barbells'],
  ['Bands', 'bands'],
  ['Cardio machines', 'cardio_machines'],
  ['Bodyweight only', 'bodyweight_only'],
]

function save() {
  userProfileStore.saveUserProfile(form)
}
</script>

<template>
  <v-tabs-window v-model="tabs">
    <v-tabs-window-item :value="1">
      <v-card>
        <v-card-text>
          <p class="text-h4">👋 Hello!</p>
          <p>I'm your smart fitness logger 🤖</p>
          <p>
            Before we begin, tell me a bit about you and your goals 🎯 so I can give you
            personalized feedback 💡
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => tabs++">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="2">
      <v-card>
        <v-card-text>
          <p class="text-h4">What's your main fitness goal?</p>
          <p>(Pick one or two)</p>
          <v-checkbox
            v-for="[label, value] in fitnessGoalLabels"
            v-model="form.fitnessGoal"
            :label="label"
            :value="value"
            multiple
            hide-details
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => tabs++">Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="3">
      <v-card>
        <v-card-text>
          <p class="text-h4">What’s your current fitness level?</p>
          <v-checkbox
            v-for="[label, value] in fitnessLevelLabels"
            v-model="form.fitnessLevel"
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
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="4">
      <v-card>
        <v-card-text>
          <p class="text-h4">How many days per week do you want to train?</p>
          <v-checkbox
            v-for="[label, value] in workoutDaysPerWeekLabels"
            v-model="form.workoutDaysPerWeek"
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
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="5">
      <v-card>
        <v-card-text>
          <p class="text-h4">Where do you work out most?</p>
          <v-checkbox
            v-for="[label, value] in workoutLocationLabels"
            v-model="form.workoutLocation"
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
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="6">
      <v-card>
        <v-card-text>
          <p class="text-h4">What equipment do you have access to?</p>
          <p>(Select all that apply)</p>
          <v-checkbox
            v-for="[label, value] in equipmentOptionLabels"
            v-model="form.equipmentAccess"
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
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="7">
      <v-card>
        <v-card-text>
          <p class="text-h4">What’s your age, height, and weight?</p>
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
      </v-card>
    </v-tabs-window-item>

    <v-tabs-window-item :value="8">
      <v-card>
        <v-card-text>
          <p class="text-h4">Finally, I need your Google Gemini API Key.</p>
          <p>Get it from:</p>
          <p>https://aistudio.google.com/apikey</p>
          <v-text-field label="API Key" v-model="form.apiKey"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="tonal" size="large" block @click="() => save()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style scoped>
p {
  margin: 1rem 0;
}
.tab-nav-button {
  width: 100%;
}
</style>
