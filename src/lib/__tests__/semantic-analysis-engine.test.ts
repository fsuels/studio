import { SemanticAnalysisEngine } from '../semantic-analysis-engine';

describe('SemanticAnalysisEngine', () => {
  const engine = new SemanticAnalysisEngine();

  it('finds divorce settlement agreement for "divorce" query', () => {
    const results = engine.analyze('divorce', { locale: 'en', maxResults: 5 });
    const ids = results.map(r => r.doc.id);
    expect(ids).toContain('divorce-settlement-agreement');
  });

  it('finds vehicle bill of sale for "buy a car" query', () => {
    const results = engine.analyze('buy a car', { locale: 'en', maxResults: 5 });
    const ids = results.map(r => r.doc.id);
    expect(ids).toContain('vehicle-bill-of-sale');
  });
});
