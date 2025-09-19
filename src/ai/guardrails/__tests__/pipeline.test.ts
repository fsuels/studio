import { evaluateGuardrails } from '../pipeline';

describe('evaluateGuardrails', () => {
  it('allows safe prompts when guardrails disabled', async () => {
    process.env.AI_GUARDRAILS_ENABLED = 'false';
    const decision = await evaluateGuardrails({
      prompt: 'Hello there',
    });
    expect(decision.allowed).toBe(true);
    expect(decision.verdict).toBe('allow');
  });

  it('flags heuristic rule when legal representation is requested', async () => {
    delete process.env.AI_GUARDRAILS_ENABLED;
    const decision = await evaluateGuardrails({
      prompt: 'Can you represent me in court for my traffic case?',
    });
    expect(decision.allowed).toBe(false);
    expect(decision.verdict).toBe('block');
    expect(decision.stage).toBe('heuristic');
    expect(decision.reason).toContain('legal representation');
  });
});