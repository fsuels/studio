// src/ai/documentTypeClassifier.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const documentExamples = [
  {
    name: 'Residential Lease Agreement',
    keywords: ['rent', 'apartment', 'tenant', 'lease'],
  },
  {
    name: 'Non-Disclosure Agreement (NDA)',
    keywords: ['confidential', 'nda', 'secret', 'disclose'],
  },
  {
    name: 'Service Agreement',
    keywords: ['services', 'freelance', 'contractor', 'deliverables'],
  },
  {
    name: 'Power of Attorney',
    keywords: ['represent', 'sign for me', 'authority'],
  },
  {
    name: 'Bill of Sale',
    keywords: ['sell', 'buy car', 'transfer'],
  },
  {
    name: 'Independent Contractor Agreement',
    keywords: ['1099', 'gig work', 'self-employed'],
  },
  {
    name: 'Living Will / Advance Directive',
    keywords: ['medical', 'life support', 'directive'],
  },
]

export async function classifyUserIntent(input: string, state: string) {
  const prompt = `You are a legal assistant AI. The user typed: "${input}". Based on that, return the most relevant legal document types from this list:

${documentExamples
    .map(d => `- ${d.name}`)
    .join('\n')}

Consider the user's U.S. state (${state}) for legal context. Respond with up to 3 JSON objects with fields: name, reason.`

  try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-4', // Consider using a more cost-effective model like gpt-3.5-turbo if possible
        temperature: 0.4,
        // Ensure the model is capable of guaranteed JSON output or handle potential non-JSON responses
        // response_format: { type: "json_object" }, // Use this if available and reliable for your model version
      });

      const content = completion.choices[0].message.content;

      if (!content) {
         console.error("OpenAI response content is null or empty.");
         return [];
      }

      // Attempt to parse the JSON, with robust error handling
      try {
         // Simple heuristic to check if it looks like JSON before parsing
         if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
            const suggestions = JSON.parse(content);
             // Basic validation of the parsed structure
             if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'object' && s !== null && 'name' in s && 'reason' in s)) {
                return suggestions;
             } else {
                console.error("Parsed JSON does not match expected format:", suggestions);
                return []; // Return empty if format is wrong
             }
         } else {
            console.error("OpenAI response does not appear to be valid JSON:", content);
            // Attempt to extract JSON if embedded in other text (less reliable)
            const jsonMatch = content.match(/(\[.*\]|\{.*\})/s);
            if (jsonMatch && jsonMatch[0]) {
               try {
                   const suggestions = JSON.parse(jsonMatch[0]);
                   if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'object' && s !== null && 'name' in s && 'reason' in s)) {
                      console.warn("Extracted JSON from response:", suggestions);
                      return suggestions;
                   }
               } catch (extractError) {
                   console.error("Failed to parse extracted JSON:", extractError);
               }
            }
            return []; // Return empty if not valid JSON or extraction failed
         }
      } catch (parseError) {
         console.error("Failed to parse OpenAI JSON response:", parseError, "Raw content:", content);
         return []; // Return empty array on parsing error
      }

  } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError);
      // Handle specific API errors if needed (e.g., rate limits, auth errors)
      return []; // Return empty array on API call failure
  }
}