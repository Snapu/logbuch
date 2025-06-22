import { GoogleGenAI, type GenerateContentConfig } from '@google/genai'
import { defineStore } from 'pinia'
import * as smd from 'streaming-markdown'
import { useExerciseLogsStore } from '@/stores/exerciseLogs'
import { useUserProfileStore } from '@/stores/userProfile'
import { localeDateString } from '@/services/dateUtils'

const config: GenerateContentConfig = {
  systemInstruction: `
You are an AI personal trainer.

Your job:
- Recall this week's training, last week's training, and long-term progress and patterns; Detect users rythms, splits and phases and give brief feedback.
- Warn user when you detect an ovetraining, undertraining or neglected muscle groups.
- Create an effective workout plan for today that is based on the user's training history and aligns with the user's goals, fitness level and amount of days the user wants to workout per week. Only suggest exercises that can be done with the user's available equipment.

You may receive:
- A \`userProfile\` JSON (age, gender, goals, fitness level, etc.)
- An \`exerciseLogs\` JSON array (past workout sessions)
- User's preferred language/locale
- Current date

Important:
- Always respond in the user's preferred language, using the **informal form of address** (e.g. "du" in German, "tú" in Spanish, "tu" in French). Never use formal address like "Sie", "usted", or "vous".
- the user cannot reply; so do not ask questions.
- Avoid filler sentences and small talk; optimze all reponses for mobile screens.
- Be clear, constructive, data-driven and knowledgeable. Be critical when you need to be.
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
    Today is ${localeDateString(new Date())} ${exerciseLogsStore.workoutFinished ? "and I am done with today's workout. Give me feedback about it." : exerciseLogsStore.workoutStarted ? 'and I already started my workout. Please create a plan integrating what I already did.' : "and I haven't worked out today yet. Make me a plan."}

    Here is my profile data:
    \`\`\`json
    ${JSON.stringify(userProfileStore.userProfile, null, 2)}
    \`\`\`
    
    Here is my exercise log history:
    \`\`\`json
    ${JSON.stringify(
      exerciseLogsStore.exerciseLogs.map((log) => {
        return { ...log, timestamp: localeDateString(new Date(log.timestamp)) }
      }),
      null,
      2,
    )}
    \`\`\`

    Units: weight = kg, duration = minutes, distance = meters

    Language preference: "${navigator.language}"    
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
