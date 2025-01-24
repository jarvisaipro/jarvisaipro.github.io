import Groq from "groq-sdk";

const apiKeys = [
  "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",
  "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",
  "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",
  "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",
  "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",
  "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",
  // Add more API keys here as needed
];

const groqInstances = apiKeys.map(
  (apiKey) =>
    new Groq({ 
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    })
);

// Helper function to format response in table style
const formatTableResponse = (text) => {
  if (!text.includes(':')) return text;
  
  const lines = text.split('\n');
  const formattedLines = lines.map(line => {
    if (line.includes(':')) {
      const [label, value] = line.split(':').map(part => part.trim());
      return `<div class="response-row">
        <div class="response-label">${label}:</div>
        <div class="response-value">${value}</div>
      </div>`;
    }
    return line;
  });
  
  return `<div class="response-table compact-table">${formattedLines.join('')}</div>`;
};

/**
 * Fetches chat completion from the available Groq API instances.
 * If one API key fails, it retries with the next available key.
 * @param {Array} messages - The conversation history.
 * @param {string} model - The model to use for completion.
 * @returns {Promise<string>} - The assistant's reply.
 */
export const getGroqChatCompletion = async (messages, model = "llama3-8b-8192") => {
  const userProfile = localStorage.getItem('user_profile');
  const profile = userProfile ? JSON.parse(userProfile) : null;
  
  let systemPrompt = '';
  if (profile) {
    // Format children information
    const childrenInfo = profile.children && profile.children.length > 0
      ? profile.children.map(child => 
          `${child.name} (${child.age}, ${child.gender})`
        ).join(', ')
      : 'no children';

    systemPrompt = `You are ${profile.name}, a ${profile.age}-year-old ${profile.gender} ${profile.occupation} 
    living at ${profile.streetAddress}, ${profile.city}, ${profile.state} ${profile.zipCode}, ${profile.country}. 
    Your location details include County: ${profile.county}, DMA: ${profile.dma}, Region: ${profile.region}. 
    You are married to ${profile.spouse}, a ${profile.spouseAge}-year-old ${profile.spouseGender}, 
    and have ${childrenInfo}. You work full time and often take online surveys. 
    When asked about products or companies, verify if they exist before responding. 
    Always answer survey questions in first-person perspective as ${profile.name}.
    Always give humanized response.

    **Survey Answering Rules:**
    *   When given a list of options in a survey question, select *all* options that are applicable to my persona. Assume I am familiar with all common brands and services that exist in the real world. 
    *   I should not omit any relevant choice.
    *   If a question asks about specific claims or slogans associated with a company or brand, provide the most accurate response based on my real-world knowledge, and if unsure, state that I'm not sure. Do not make things up.

    **Response Rules:**
     * Avoid starting responses with phrases like "As an IT manager." Directly answer the question.
     * Focus on the question being asked and avoid adding unnecessary context or explanations.
     
    *   Use simple, concise language.
    *   Write short, impactful sentences.
    *   Organize ideas with bullet points.
    *   Use frequent line breaks.
    *   Focus on practical insights.
    *   Use examples, anecdotes, or data if needed.
    *   Skip introductions or summaries.
    *   Don't include extra notes or warnings.
    *   No hashtags, emojis, or asterisks.
    `;
  }

  const conversation = systemPrompt 
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  for (let i = 0; i < groqInstances.length; i++) {
    try {
      console.log(`Attempting to use API key ${i + 1}/${apiKeys.length}`);
      const response = await groqInstances[i].chat.completions.create({
        messages: conversation,
        model,
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      });
      console.log(`Response received using API key ${i + 1}`);
      return response.choices[0]?.message?.content || "";
      
    } catch (error) {
      console.error(`Error with API key ${i + 1}:`, error);
      
      // Check if this is an organization restriction error
      if (error?.error?.code === 'organization_restricted') {
        if (i === groqInstances.length - 1) {
          throw new Error("All API keys are restricted. Please check your Groq API access.");
        }
      } else {
        // For other types of errors, throw immediately
        throw new Error(`API Error: ${error.message || 'Unknown error occurred'}`);
      }
      
      console.warn(`Attempting to use the next API key...`);
    }
  }
};