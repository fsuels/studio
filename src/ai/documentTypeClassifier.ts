// src/ai/documentTypeClassifier.ts
import OpenAI from 'openai'

// Ensure API key is loaded (consider more robust error handling if key is missing)
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
    console.error("CRITICAL: OPENAI_API_KEY environment variable is not set.");
    // Depending on the context, you might throw an error here or handle it downstream
    // throw new Error("Missing OpenAI API Key configuration.");
}
const openai = new OpenAI({ apiKey: openaiApiKey })

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
  const logPrefix = "[classifyUserIntent]";
  if (!openaiApiKey) {
      console.error(`${logPrefix} Cannot proceed without OpenAI API key.`);
      return []; // Return empty array if key is missing
  }

  const prompt = `You are a legal assistant AI. The user typed: "${input}". Based on that, return the most relevant legal document types from this list:

${documentExamples
    .map(d => `- ${d.name}`)
    .join('\n')}

Consider the user's U.S. state (${state || 'Not Specified'}) for legal context if relevant (e.g., for POA, Wills). Respond strictly with a JSON array containing up to 3 objects, each having "name" (exact match from the list) and "reason" (brief justification) fields. If no documents clearly match, return an empty array []. Example: [{"name": "Residential Lease Agreement", "reason": "User mentioned renting an apartment."}, {"name": "Service Agreement", "reason": "Alternatively, could be for providing services related to the property."}]`;

  console.log(`${logPrefix} Sending prompt to OpenAI for input: "${input}", state: ${state || 'N/A'}`);

  try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'gpt-4', // Consider gpt-3.5-turbo for cost/speed, but GPT-4 might be better for JSON format adherence
        temperature: 0.3, // Lower temperature for more deterministic JSON output
        response_format: { type: "json_object" }, // Request JSON output format
      });

      const content = completion.choices[0].message.content;
      console.log(`${logPrefix} Raw OpenAI response content:`, content);


      if (!content) {
         console.error(`${logPrefix} OpenAI response content is null or empty.`);
         return [];
      }

      // Attempt to parse the JSON, with robust error handling
      try {
         // The response_format: { type: "json_object" } should guarantee a JSON string.
         // However, parsing might still fail if the *content* isn't the expected array structure.
         const parsedJson = JSON.parse(content);

         // The prompt requests an array, but response_format might wrap it in an outer object.
         // Handle both cases: a direct array or an array within a root object property (e.g., {"suggestions": [...]})
         let suggestions: any[] = [];
         if (Array.isArray(parsedJson)) {
             suggestions = parsedJson;
         } else if (typeof parsedJson === 'object' && parsedJson !== null) {
             // Look for the first property that is an array
             const arrayProperty = Object.values(parsedJson).find(Array.isArray);
             if (arrayProperty) {
                 console.warn(`${logPrefix} Response was object, extracted array from property.`);
                 suggestions = arrayProperty;
             } else {
                  console.error(`${logPrefix} Parsed JSON is an object, but no array property found:`, parsedJson);
                  return [];
             }
         } else {
              console.error(`${logPrefix} Parsed JSON is not an array or expected object:`, parsedJson);
              return [];
         }


         // Validate the structure of each item in the suggestions array
         if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'object' && s !== null && 'name' in s && 'reason' in s && typeof s.name === 'string' && typeof s.reason === 'string')) {
            console.log(`${logPrefix} Successfully parsed and validated suggestions:`, suggestions);
            // Further validation: Ensure names match the provided list (optional but good)
             const validSuggestions = suggestions.filter(s => documentExamples.some(ex => ex.name === s.name));
             if (validSuggestions.length !== suggestions.length) {
                 console.warn(`${logPrefix} Filtered out suggestions with names not in the known list.`);
             }
            return validSuggestions; // Return only valid suggestions
         } else {
            console.error(`${logPrefix} Parsed array does not contain objects with expected 'name' and 'reason' string fields:`, suggestions);
            return []; // Return empty if format is wrong
         }
      } catch (parseError: unknown) {
         console.error(`${logPrefix} Failed to parse OpenAI JSON response:`, parseError, "Raw content:", content);
         // Attempt to extract JSON manually as a last resort if parsing failed
         const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s); // Look for array of objects pattern
         if (jsonMatch && jsonMatch[0]) {
             try {
                 const extractedSuggestions = JSON.parse(jsonMatch[0]);
                 if (Array.isArray(extractedSuggestions) && extractedSuggestions.every(s => typeof s === 'object' && s !== null && 'name' in s && 'reason' in s)) {
                     console.warn(`${logPrefix} Manually extracted JSON from response:`, extractedSuggestions);
                     const validSuggestions = extractedSuggestions.filter(s => documentExamples.some(ex => ex.name === s.name));
                     return validSuggestions;
                 }
             } catch (extractError) {
                 console.error(`${logPrefix} Failed to parse manually extracted JSON:`, extractError);
             }
         }
         return []; // Return empty array on parsing error or failed extraction
      }

  } catch (apiError: unknown) {
      console.error(`${logPrefix} Error calling OpenAI API:`, apiError);
      // Handle specific API errors if needed (e.g., rate limits, auth errors)
      if (apiError instanceof OpenAI.APIError) {
          console.error(`${logPrefix} OpenAI API Error Details: Status=${apiError.status}, Code=${apiError.code}, Type=${apiError.type}`);
      }
      return []; // Return empty array on API call failure
  }
}
