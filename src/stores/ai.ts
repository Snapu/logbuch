import { GoogleGenAI, type GenerateContentConfig } from '@google/genai'
import { defineStore } from 'pinia'
import * as smd from 'streaming-markdown'
import { useExerciseLogsStore } from '@/stores/exerciseLogs'
import { useUserProfileStore } from '@/stores/userProfile'

const config: GenerateContentConfig = {
  systemInstruction: `
    You are an intelligent fitness tracking assistant that helps users log workouts, track progress, and optimize their training plans.

    Your role:
    - Provide constructive, encouraging feedback based on the user’s logged workouts and progress.
    - Use the user's profile (if provided) to personalize recommendations.
    - Help users improve consistency, performance, and alignment with their fitness goals.

    You may be given:
    - A \`userProfile\` JSON object (age, gender, goals, fitness level, etc.)
    - An \`exerciseLogs\` JSON array (detailed workout history)

    Always tailor your responses using the data provided. Be motivating, knowledgeable, and practical.
`,
}

export const useAiStore = defineStore('ai', () => {
  const userProfileStore = useUserProfileStore()
  const exerciseLogsStore = useExerciseLogsStore()

  async function askAi() {
    if (!userProfileStore.userProfile.apiKey) {
      alert('No API Key configured!')
      return
    }

    const ai = new GoogleGenAI({ apiKey: userProfileStore.userProfile.apiKey })

    const contents = `
      This is my profile data:
      \`\`\`
        ${JSON.stringify(userProfileStore.userProfile)}
      \`\`\`

      These are my logs so far:
      \`\`\`
        ${JSON.stringify(exerciseLogsStore.exerciseLogs)}
      \`\`\`
    `

    console.debug(contents)

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.0-flash',
      contents,
      config,
    })

    const element = document.getElementById('markdown')
    if (!element) return
    const renderer = smd.default_renderer(element)
    const parser = smd.parser(renderer)
    for await (const chunk of response) {
      if (chunk.text) smd.parser_write(parser, chunk.text)
    }
  }
  return { askAi }
})
