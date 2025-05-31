'use server';

/**
 * @fileOverview An AI agent that provides brief explanations of chemical terms.
 *
 * - explainTerm - A function that provides explanations for a given chemical term.
 * - ExplainTermInput - The input type for the explainTerm function.
 * - ExplainTermOutput - The return type for the explainTerm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTermInputSchema = z.object({
  term: z.string().describe('The chemical term to explain.'),
});
export type ExplainTermInput = z.infer<typeof ExplainTermInputSchema>;

const ExplainTermOutputSchema = z.object({
  explanation: z.string().describe('A brief explanation of the chemical term.'),
});
export type ExplainTermOutput = z.infer<typeof ExplainTermOutputSchema>;

export async function explainTerm(input: ExplainTermInput): Promise<ExplainTermOutput> {
  return explainTermFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTermPrompt',
  input: {schema: ExplainTermInputSchema},
  output: {schema: ExplainTermOutputSchema},
  prompt: `You are a helpful chemistry tutor. Provide a concise explanation of the following term:

Term: {{{term}}}

Explanation:`,
});

const explainTermFlow = ai.defineFlow(
  {
    name: 'explainTermFlow',
    inputSchema: ExplainTermInputSchema,
    outputSchema: ExplainTermOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
