
import { Message } from "@/hooks/use-chat";

const API_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

// Rate limiting variables
const MAX_REQUESTS_PER_MINUTE = 10;
const requestTimestamps: number[] = [];

export const sendMessage = async (
  messages: Message[],
  apiKey: string
): Promise<string> => {
  // Implement rate limiting
  const now = Date.now();
  requestTimestamps.push(now);
  requestTimestamps.splice(
    0,
    requestTimestamps.filter((timestamp) => now - timestamp > 60000).length
  );
  
  if (requestTimestamps.length > MAX_REQUESTS_PER_MINUTE) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error communicating with DeepSeek API");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
