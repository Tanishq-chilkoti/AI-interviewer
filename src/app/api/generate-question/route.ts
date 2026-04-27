import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from '@/lib/prompts';

export async function POST(req: Request) {
  try {
    const { role, level, topic, resumeText, askedQuestions } = await req.json();

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
- Topic: ${topic}

${resumeText ? `CRITICAL CONTEXT - CANDIDATE RESUME:
"""
${resumeText}
"""
` : `- Experience Level: ${level}`}

${askedQuestions?.length > 0 ? `PREVIOUSLY ASKED QUESTIONS (DO NOT REPEAT THESE):
${askedQuestions.map((q: string, i: number) => `${i+1}. ${q}`).join('\n')}` : ''}

Instructions:
- Ask ONE clear question
${resumeText ? '- You MUST tailor the question DIRECTLY to a specific project, skill, or job experience mentioned in the candidate resume context.' : '- Match difficulty with experience level'}
${resumeText ? '- Start the question naturally, e.g., "I noticed on your resume that you worked with X..." or "Could you walk me through your experience at Y..."' : '- Prefer real-world scenarios'}
- Do NOT generate overly theoretical questions.`,
    });

    return Response.json(object);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
