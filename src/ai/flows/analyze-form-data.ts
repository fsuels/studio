// src/ai/flows/analyze-form-data.ts
//--------------------------------------------------
// Very small, framework‑agnostic helper that calls
// OpenAI and returns field‑level suggestions or
// warnings you can surface in DynamicFormRenderer.
//--------------------------------------------------

import { OpenAI } from 'openai'                  // make sure you have this tiny SDK
import type { FormField } from '@/data/formSchemas'

// IMPORTANT – keep your key in NEXT_PUBLIC_OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export interface AnalyzeParams {
  documentType: string
  schema: FormField[]
  answers: Record<string, string | number | boolean | undefined>
}

export interface FieldSuggestion {
  fieldId: string
  importance: 'info' | 'warning' | 'error'
  message: string
}

export async function analyzeFormData(
  params: AnalyzeParams,
): Promise<FieldSuggestion[]> {
  const { documentType, schema, answers } = params

  // Compose a compact prompt.  You can of course make this smarter.
  const prompt = `
    You are a senior paralegal helping users spot mistakes in legal‑form answers.
    The document type is "${documentType}".
    Here is the JSON array of questions (schema):
    ${JSON.stringify(schema, null, 2)}

    Here are the user answers:
    ${JSON.stringify(answers, null, 2)}

    Check each answer.  If an answer:
      • is missing but required  ➜ importance "error"
      • looks suspicious (e.g., improbable VIN, future date) ➜ "warning"
      • could be improved stylistically                  ➜ "info"
    Return ONLY a JSON array of objects
      [{ fieldId, importance, message }, …]
  `.trim()

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [{ role: 'user', content: prompt }],
  })

  try {
    const raw = completion.choices[0].message.content ?? '[]'
    const suggestions = JSON.parse(raw) as FieldSuggestion[]
    // Shallow validation
    return Array.isArray(suggestions) ? suggestions : []
  } catch (err) {
    console.error('Failed to parse suggestions', err)
    return []
  }