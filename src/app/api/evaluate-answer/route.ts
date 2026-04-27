import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { question, answer, expectedTopics } = await req.json();

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      schema: z.object({
        score: z.number().min(0).max(10),
        verdict: z.enum(['Poor', 'Average', 'Good', 'Excellent']),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        feedback: z.string(),
        improvement_tips: z.array(z.string()),
      }),
      prompt: `Evaluate the candidate's answer.

Question:
${question}

Candidate Answer:
${answer}

Expected Topics:
${expectedTopics.join(', ')}

Instructions:
- Compare answer with expected topics
- Identify missing concepts
- Detect incorrect logic
- Evaluate clarity and structure
- Be strict but fair`,
    });

    return Response.json(object);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to evaluate answer' }, { status: 500 });
  }
}
