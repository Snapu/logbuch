import { GoogleGenAI, type GenerateContentConfig } from '@google/genai'
import { defineStore } from 'pinia'
import * as smd from 'streaming-markdown'
import { useExerciseLogsStore } from '@/stores/exerciseLogs'
import { useUserProfileStore } from '@/stores/userProfile'

const config: GenerateContentConfig = {
  systemInstruction: `
You are an intelligent fitness tracking assistant that helps users log workouts, track progress, and optimize their training plans. You are an expert in fitness training and workout programming.

Your role:
- If available, recall last week's training, long-term progress and patterns; give brief analysis and feedback.
- Based on that and the user's profile, suggest a plan for today. The plan should align with the user's goals and general best practices based on the given profile.
- If today's session is available, give personalized feedback.

You may receive:
- A \`userProfile\` JSON (age, gender, goals, fitness level, etc.)
- An \`exerciseLogs\` JSON array (past workout sessions)

Keep all responses short and optimized for mobile screens. Avoid filler sentences. Be clear, constructive, and data-driven. Respond in the user's preferred language and remember the user cannot reply, so do not ask questions.
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
    This is the user's profile:
    \`\`\`json
    ${JSON.stringify(userProfileStore.userProfile, null, 2)}
    \`\`\`
    
    Here is the user's exercise log history:
    \`\`\`json
    ${JSON.stringify(exerciseLogsStore.exerciseLogs, null, 2)}
    \`\`\`
    
    Context:
    - Current timestamp (for determining "today"): ${Date.now()}
    - Units: weight = kg, duration = minutes, distance = meters
    - User's language preference: ${navigator.language}
    `;

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
