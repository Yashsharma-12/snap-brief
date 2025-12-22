export const runtime = 'edge'; 

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    // 1. Parse the request and log it for visibility
    const json = await req.json();
    const prompt = json.prompt;
    const mode = json.mode || json.body?.mode || 'short';

    console.log("--- API Request Received ---");
    console.log("Mode:", mode);
    console.log("Prompt length:", prompt?.length);

    // 2. Basic validation
    if (!prompt || prompt.trim().length === 0) {
      console.error("Error: Empty prompt received.");
      return new Response('Prompt is required', { status: 400 });
    }

    const systemPrompts: Record<string, string> = {
      short: 'Summarize this text into one concise paragraph.',
      bullets: 'Summarize this text into 3–5 key bullet points.',
      formal: 'Provide a professional executive summary.',
    };

    // 3. Initialize the stream
    // IMPORTANT: If this line fails, it usually means GOOGLE_GENERATIVE_AI_API_KEY is missing
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompts[mode] || systemPrompts.short,
      prompt,
    });

    // 4. Return the response
    return result.toTextStreamResponse();

  } catch (error: any) {
    // This is the most important part: it prints the hidden error to your terminal
    console.error("--- BACKEND CRASH ---");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}