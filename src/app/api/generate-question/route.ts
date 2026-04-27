import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { role, level, topic } = await req.json();

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      schema: z.object({
        question: z.string(),
        difficulty: z.enum(['Easy', 'Medium', 'Hard']),
        expected_topics: z.array(z.string()),
      }),
      prompt: `Generate an interview question.
Inputs:
- Role: ${role}
- Experience Level: ${level}
- Topic: ${topic}

Instructions:
- Ask ONE clear question
- Match difficulty with experience level
- Prefer real-world scenarios
- Avoid overly theoretical questions`,
    });

    return Response.json(object);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
