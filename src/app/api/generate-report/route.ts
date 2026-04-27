import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { scores, feedbackList } = await req.json();

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      schema: z.object({
        average_score: z.number().min(0).max(10),
        final_verdict: z.enum(['Reject', 'Borderline', 'Hire']),
        strengths_summary: z.array(z.string()),
        weaknesses_summary: z.array(z.string()),
        final_feedback: z.string(),
        next_steps: z.array(z.string()),
      }),
      prompt: `Generate a final interview report.

Inputs:
- All scores: ${scores.join(', ')}
- All feedback:
${feedbackList.map((f: string, i: number) => `Q${i + 1}: ${f}`).join('\n')}

Instructions:
- Calculate average score
- Identify consistent strengths
- Identify recurring weaknesses
- Give hiring recommendation`,
    });

    return Response.json(object);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
