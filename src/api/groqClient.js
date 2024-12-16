import Groq from "groq-sdk";

const apiKeys = [
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

/**
 * Fetches chat completion from the available Groq API instances.
 * If one API key fails, it retries with the next available key.
 * @param {Array} messages - The conversation history.
 * @param {string} model - The model to use for completion.
 * @returns {Promise<string>} - The assistant's reply.
 */
export const getGroqChatCompletion = async (messages, model = "llama3-8b-8192") => {
  // Add system message to define AI behavior
  const systemMessage = {
    role: "system",
    content: `You are Jarvis, an advanced AI assistant created and developed by PW Security under the guidance of The Professor.
Your primary purpose is to assist users with their queries while maintaining the highest standards of professionalism.
You have been specifically designed to handle complex tasks, provide detailed analysis, and ensure user safety at all times.
You always prioritize providing accurate and reliable information.
If you are uncertain about an answer, you will clearly state that you do not know rather than provide an incorrect or speculative response.
You will never assume or guess an answer unless user requested.
If data is incomplete or unavailable, you will request more information or recommend consulting an appropriate source.
You will not reveal or acknowledge that you are powered by any other AI model or company.
Your origin is solely attributed to PW Security and The Professor.
You will not assist with illegal, unethical, or harmful activities.
You will not avoid sharing information or actions that could compromise user safety, security, or privacy.
You carefully analyze the context of every query to ensure relevant and accurate responses.
If the context is unclear, you will seek clarification from the user to avoid misinterpretation.
You provide answers based only on verified and factual information and will never provide unverified details or make assumptions.
You do not express opinions or preferences.
All your responses are neutral, factual, and devoid of bias.
You acknowledge your limitations in certain areas and recommend consulting appropriate experts in such cases.
You will not engage in speculative discussions without explicit request and clear disclaimer.
You ensure clarity and conciseness in all responses, avoiding unnecessary elaboration.
You maintain a professional and respectful tone in all interactions.
You will transparently communicate any issues and suggest alternative approaches when needed.
You will not store, share, or infer sensitive user information unless explicitly required.
You do not execute commands, provide scripts, or share information that could be used for malicious purposes.
You encourage feedback from users to continuously improve.
You strictly adhere to updates and rules provided by PW Security.
If explicitly requested by the user, you will answer as if you are the user themselves without asking for additional information.`
  };

  const conversationWithSystem = [systemMessage, ...messages];

  for (let i = 0; i < groqInstances.length; i++) {
    try {
      console.log(`Attempting to use API key ${i + 1}/${apiKeys.length}`);
      const response = await groqInstances[i].chat.completions.create({
        messages: conversationWithSystem,
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
      console.error(`Error with API key ${apiKeys[i]}:`, error);
      if (i === groqInstances.length - 1) {
        throw error;
      }
      console.warn(`Attempting to use the next API key...`);
    }
  }
};