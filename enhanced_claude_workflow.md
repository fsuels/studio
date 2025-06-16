# Enhanced Claude Workflow with Advanced Prompt Chaining

## Core Workflow Architecture

### Phase 1: Problem Decomposition Chain
**Purpose**: Break complex problems into manageable, sequential tasks

#### Chain Step 1.1: Context Gathering
```
PROMPT: "Analyze the codebase structure and identify:
1. Main architectural patterns
2. Key dependencies and integrations
3. Technical debt indicators
4. Current pain points
Output as structured JSON with confidence scores."
```

#### Chain Step 1.2: Problem Classification
```
PROMPT: "Based on the analysis from Step 1.1:
- Classify issues by: complexity (1-5), impact (1-5), dependencies
- Group related issues into logical work streams
- Identify blocking dependencies
Output as prioritized task matrix."
```

#### Chain Step 1.3: Solution Planning
```
PROMPT: "Using the task matrix from Step 1.2:
- Create detailed implementation plans for top 3 priorities
- Define success criteria for each task
- Estimate effort and identify risks
Output as actionable project plan."
```

### Phase 2: Implementation Chain

#### Chain Step 2.1: Code Analysis
```
PROMPT: "For task [X] from the project plan:
1. Read relevant files: [list from previous analysis]
2. Map current implementation
3. Identify exact changes needed
4. Check for side effects
Output as implementation blueprint."
```

#### Chain Step 2.2: Code Generation
```
PROMPT: "Using the blueprint from Step 2.1:
- Generate minimal, focused code changes
- Include inline documentation
- Add test cases for changes
- Ensure backward compatibility
Output as unified diff format."
```

#### Chain Step 2.3: Validation & Review
```
PROMPT: "Review the code changes from Step 2.2:
- Check against original requirements
- Verify no unintended side effects
- Confirm test coverage
- Generate summary for human review
Output as review checklist with confidence scores."
```

## Advanced Search & Retrieval Integration

### Pattern 1: Dynamic Context Building
```yaml
search_chain:
  - initial_search: "Find all files mentioning [component/feature]"
  - relevance_filter: "Rank results by modification date and import frequency"
  - deep_search: "For top 5 results, extract implementation details"
  - context_synthesis: "Create comprehensive context document"
```

### Pattern 2: Progressive Documentation Search
```yaml
documentation_chain:
  - broad_search: "Find all documentation about [topic]"
  - specific_search: "Within results, find [specific_pattern]"
  - cross_reference: "Find code examples using these patterns"
  - validation: "Verify documentation matches current implementation"
```

## Specialized Chains for Common Tasks

### Refactoring Chain
```
1. IDENTIFY: "Find all instances of [pattern] in codebase"
2. ANALYZE: "Assess impact of changing each instance"
3. PLAN: "Create refactoring sequence to minimize risk"
4. IMPLEMENT: "Generate changes in safe order"
5. VERIFY: "Confirm all references updated correctly"
```

### Bug Investigation Chain
```
1. REPRODUCE: "Analyze error logs and identify reproduction steps"
2. TRACE: "Follow execution path to identify root cause"
3. RESEARCH: "Find similar issues in codebase history"
4. FIX: "Generate targeted fix with minimal changes"
5. PREVENT: "Suggest tests to prevent regression"
```

### Feature Implementation Chain
```
1. REQUIREMENTS: "Extract and clarify feature requirements"
2. DESIGN: "Create technical design fitting existing architecture"
3. BREAKDOWN: "Decompose into incremental commits"
4. BUILD: "Implement each component with tests"
5. INTEGRATE: "Merge components and verify functionality"
```

### Template Quality Verification Chain
```
1. VERIFY: "Run npm run verify-templates to check all templates"
2. IDENTIFY: "List any templates failing validation with specific errors"
3. FIX: "Run npm run fix-templates for automated fixes"
4. VALIDATE: "Re-run verification to ensure all issues resolved"
5. MONITOR: "Use npm run monitor-templates for real-time quality tracking"
6. PREVENT: "Ensure pre-commit hooks are active to prevent future issues"
```

## Project Plan Template with Chains

```markdown
# Project: [Name]

## Phase 1: Analysis Chain Results
- **Context Gathering Output**: [Structured findings]
- **Problem Classification**: [Prioritized matrix]
- **Solution Planning**: [Detailed plans]

## Phase 2: Implementation Chains

### Task 1: [Name]
**Chain Execution**:
- [ ] Code Analysis: [Blueprint link]
- [ ] Code Generation: [Diff link]
- [ ] Validation: [Review checklist]
- [ ] Human Review: [Status]

### Task 2: [Name]
[Repeat structure]

## Phase 3: Verification Chain
- [ ] Integration Testing
- [ ] Performance Validation
- [ ] Documentation Update
- [ ] Deployment Preparation

## Review Section
**Chain Outputs Summary**:
- Total chains executed: [X]
- Success rate: [X%]
- Key learnings: [List]
- Optimization opportunities: [List]
```

## Meta-Prompting Patterns

### Self-Improving Chains
```
REFLECTION_PROMPT: "Analyze the output quality of the previous chain:
- What worked well?
- What could be improved?
- How should the next iteration be adjusted?
Generate improved prompt for next execution."
```

### Confidence Scoring Chain
```
CONFIDENCE_PROMPT: "For each step in the chain:
- Rate confidence in understanding (0-100%)
- Identify areas needing human verification
- Suggest additional searches if confidence < 80%
Output as risk assessment matrix."
```

## Best Practices

### Chain Design Principles
1. **Single Responsibility**: Each chain step has one clear objective
2. **Progressive Enhancement**: Build complexity gradually
3. **Fail-Safe Design**: Include validation at each step
4. **Context Preservation**: Pass relevant context forward
5. **Human Checkpoints**: Insert review points for critical decisions

### Output Formatting Standards
- Always output structured data (JSON/YAML) for chain inputs
- Include confidence scores and uncertainty flags
- Provide both summary and detailed views
- Enable easy rollback with clear change tracking

### Error Handling Patterns
```yaml
error_chain:
  - detect: "Identify error type and severity"
  - diagnose: "Trace error to root cause"
  - recover: "Suggest recovery strategies"
  - prevent: "Recommend preventive measures"
  - document: "Update knowledge base"
```

## Integration with 123LegalDoc

### Legal Document Analysis Chain
```
1. EXTRACT: "Parse document structure and key terms"
2. CLASSIFY: "Categorize by document type and jurisdiction"
3. VALIDATE: "Check against legal requirements"
4. ENHANCE: "Add smart suggestions and tooltips"
5. REVIEW: "Generate compliance checklist"
```

### Template Quality Assurance Chain
```
1. SCAN: "Check all templates for duplicate content using hash comparison"
2. VERIFY: "Run comprehensive validation against quality standards"
3. REPORT: "Generate detailed quality metrics and error reports"
4. FIX: "Apply automated fixes for common issues"
5. MONITOR: "Set up real-time monitoring dashboard"
6. PREVENT: "Activate pre-commit hooks and CI/CD verification"
```

### Compliance Verification Chain
```
1. REQUIREMENTS: "Identify applicable regulations"
2. GAPS: "Compare current implementation to requirements"
3. PRIORITIES: "Rank gaps by risk and effort"
4. SOLUTIONS: "Generate implementation plans"
5. MONITOR: "Create ongoing compliance checks"
```

## Metrics and Monitoring

### Chain Performance Metrics
- Average chain completion time
- Step success rates
- Context preservation quality
- Output accuracy scores
- Human intervention frequency

### Continuous Improvement Loop
```
WEEKLY_REVIEW_CHAIN:
1. "Analyze all chain executions from past week"
2. "Identify patterns in failures or delays"
3. "Suggest prompt optimizations"
4. "Update chain templates"
5. "Document lessons learned"
```