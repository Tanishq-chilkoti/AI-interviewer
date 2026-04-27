import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { question, answer, weaknesses } = await req.json();

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      schema: z.object({
        follow_up_question: z.string(),
        reason: z.string(),
      }),
      prompt: `Generate a follow-up question based on the candidate's answer.

Inputs:
- Original Question: ${question}
- Candidate Answer: ${answer}
- Weaknesses: ${weaknesses.join(', ')}

Instructions:
- If answer is weak -> ask easier clarification question
- If answer is good -> ask deeper or edge-case question
- Focus on gaps in knowledge`,
    });

    return Response.json(object);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate follow-up' }, { status: 500 });
  }
}
