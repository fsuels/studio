#!/usr/bin/env npx tsx

// Automated Test Generation System for 123LegalDoc
// Following the enhanced project plan's test generation chain

import fs from 'fs'
import path from 'path'

interface ComponentAnalysis {
  filePath: string
  componentName: string
  props: PropDefinition[]
  exports: string[]
  imports: string[]
  hasState: boolean
  hasEffects: boolean
  isInteractive: boolean
  isFormComponent: boolean
}

interface PropDefinition {
  name: string
  type: string
  required: boolean
  defaultValue?: string
}

interface TestScenario {
  name: string
  description: string
  setup: string
  assertions: string[]
  category: 'rendering' | 'interaction' | 'accessibility' | 'error' | 'edge-case'
}

class TestGenerator {
  private componentsDir: string = 'src/components'
  private testsDir: string = 'src/components'
  
  constructor() {
    console.log('🧪 Starting automated test generation...')
  }

  async generateAllTests(): Promise<void> {
    const componentFiles = await this.findComponents()
    
    for (const filePath of componentFiles) {
      if (!this.shouldGenerateTest(filePath)) continue
      
      try {
        const analysis = await this.analyzeComponent(filePath)
        const scenarios = this.generateTestScenarios(analysis)
        await this.writeTestFile(analysis, scenarios)
        
        console.log(`✅ Generated tests for ${analysis.componentName}`)
      } catch (error) {
        console.error(`❌ Failed to generate tests for ${filePath}:`, error)
      }
    }
  }

  private async findComponents(): Promise<string[]> {
    const components: string[] = []
    
    const walkDir = (dir: string) => {
      const files = fs.readdirSync(dir)
      
      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          walkDir(filePath)
        } else if (
          file.endsWith('.tsx') && 
          !file.includes('.test.') && 
          !file.includes('.spec.') &&
          !file.includes('index.')
        ) {
          components.push(filePath)
        }
      }
    }
    
    walkDir('src/components')
    return components
  }

  private shouldGenerateTest(filePath: string): boolean {
    // Skip if test already exists
    const testPath = this.getTestPath(filePath)
    if (fs.existsSync(testPath)) return false
    
    // Skip certain file types
    if (filePath.includes('.stories.') || 
        filePath.includes('.config.') ||
        filePath.includes('constants.ts') ||
        filePath.includes('types.ts')) {
      return false
    }
    
    return true
  }

  private async analyzeComponent(filePath: string): Promise<ComponentAnalysis> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const componentName = this.extractComponentName(filePath, content)
    
    return {
      filePath,
      componentName,
      props: this.extractProps(content),
      exports: this.extractExports(content),
      imports: this.extractImports(content),
      hasState: content.includes('useState') || content.includes('useReducer'),
      hasEffects: content.includes('useEffect') || content.includes('useLayoutEffect'),
      isInteractive: this.isInteractiveComponent(content),
      isFormComponent: this.isFormComponent(content, filePath)
    }
  }

  private extractComponentName(filePath: string, content: string): string {
    // Try to extract from export default or export const
    const exportDefaultMatch = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
    if (exportDefaultMatch) return exportDefaultMatch[1];
    
    const exportConstMatch = content.match(/export\s+const\s+(\w+)\s*=/);
    if (exportConstMatch) return exportConstMatch[1];
    
    // Fallback to filename
    return path.basename(filePath, '.tsx');
  }

  private extractProps(content: string): PropDefinition[] {
    const props: PropDefinition[] = []
    
    // Extract from interface definitions
    const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/s)
    if (interfaceMatch) {
      const propsContent = interfaceMatch[1]
      const propMatches = propsContent.match(/(\w+)(\?)?:\s*([^;]+);?/g)
      
      if (propMatches) {
        for (const propMatch of propMatches) {
          const [, name, optional, type] = propMatch.match(/(\w+)(\?)?:\s*([^;]+)/) || []
          if (name && type) {
            props.push({
              name,
              type: type.trim(),
              required: !optional,
              defaultValue: this.extractDefaultValue(content, name)
            })
          }
        }
      }
    }
    
    return props
  }

  private extractDefaultValue(content: string, propName: string): string | undefined {
    const defaultMatch = content.match(new RegExp(`${propName}\\s*=\\s*([^,}]+)`))
    return defaultMatch ? defaultMatch[1].trim() : undefined
  }

  private extractExports(content: string): string[] {
    const exports: string[] = []
    
    // Find all export statements
    const exportMatches = content.match(/export\s+(?:default\s+)?(?:const\s+|function\s+)?(\w+)/g)
    if (exportMatches) {
      exports.push(...exportMatches.map(match => 
        match.replace(/export\s+(?:default\s+)?(?:const\s+|function\s+)?/, '')
      ))
    }
    
    return exports
  }

  private extractImports(content: string): string[] {
    const imports: string[] = []
    const importMatches = content.match(/import\s+.*?from\s+['"`]([^'"`]+)['"`]/g)
    
    if (importMatches) {
      imports.push(...importMatches.map(match => 
        match.match(/from\s+['"`]([^'"`]+)['"`]/)?.[1] || ''
      ).filter(Boolean))
    }
    
    return imports
  }

  private isInteractiveComponent(content: string): boolean {
    return content.includes('onClick') ||
           content.includes('onChange') ||
           content.includes('onSubmit') ||
           content.includes('onFocus') ||
           content.includes('onBlur') ||
           content.includes('onKeyDown') ||
           content.includes('button') ||
           content.includes('input')
  }

  private isFormComponent(content: string, filePath: string): boolean {
    return filePath.includes('/forms/') ||
           content.includes('form') ||
           content.includes('input') ||
           content.includes('onChange') ||
           content.includes('onSubmit')
  }

  private generateTestScenarios(analysis: ComponentAnalysis): TestScenario[] {
    const scenarios: TestScenario[] = []
    
    // Basic rendering test
    scenarios.push({
      name: 'renders without crashing',
      description: 'Component renders successfully with required props',
      setup: this.generateBasicSetup(analysis),
      assertions: ['expect(screen.getByTestId(\'testId\')).toBeInTheDocument()'],
      category: 'rendering'
    })
    
    // Props testing
    if (analysis.props.length > 0) {
      scenarios.push({
        name: 'renders with all props',
        description: 'Component handles all prop variations correctly',
        setup: this.generatePropsSetup(analysis),
        assertions: this.generatePropsAssertions(analysis),
        category: 'rendering'
      })
    }
    
    // Interactive testing
    if (analysis.isInteractive) {
      scenarios.push({
        name: 'handles user interactions',
        description: 'Component responds to user events correctly',
        setup: this.generateInteractionSetup(analysis),
        assertions: this.generateInteractionAssertions(analysis),
        category: 'interaction'
      })
    }
    
    // Form testing
    if (analysis.isFormComponent) {
      scenarios.push({
        name: 'validates form inputs',
        description: 'Form validation works correctly',
        setup: this.generateFormSetup(analysis),
        assertions: this.generateFormAssertions(analysis),
        category: 'interaction'
      })
    }
    
    // Accessibility testing
    scenarios.push({
      name: 'meets accessibility requirements',
      description: 'Component is accessible to all users',
      setup: this.generateAccessibilitySetup(analysis),
      assertions: this.generateAccessibilityAssertions(analysis),
      category: 'accessibility'
    })
    
    // Error boundary testing
    if (analysis.hasState || analysis.hasEffects) {
      scenarios.push({
        name: 'handles errors gracefully',
        description: 'Component handles error states appropriately',
        setup: this.generateErrorSetup(analysis),
        assertions: this.generateErrorAssertions(analysis),
        category: 'error'
      })
    }
    
    return scenarios
  }

  private generateBasicSetup(analysis: ComponentAnalysis): string {
    const requiredProps = analysis.props
      .filter(prop => prop.required)
      .map(prop => this.generateMockProp(prop))
      .join(',\n      ')
    
    return `render(<${analysis.componentName} ${requiredProps} data-testid="testId" />)`
  }

  private generatePropsSetup(analysis: ComponentAnalysis): string {
    const allProps = analysis.props
      .map(prop => this.generateMockProp(prop))
      .join(',\n      ')
    
    return `render(<${analysis.componentName} ${allProps} data-testid="testId" />)`
  }

  private generateMockProp(prop: PropDefinition): string {
    const value = this.generateMockValue(prop.type, prop.defaultValue)
    return `${prop.name}=${value}`
  }

  private generateMockValue(type: string, defaultValue?: string): string {
    if (defaultValue) return defaultValue
    
    if (type.includes('string')) return '"test value"'
    if (type.includes('number')) return '42'
    if (type.includes('boolean')) return 'true'
    if (type.includes('function') || type.includes('=>')) return 'jest.fn()'
    if (type.includes('React.ReactNode') || type.includes('ReactNode')) return '<span>Test content</span>'
    if (type.includes('[]') || type.includes('Array')) return '[]'
    if (type.includes('{}') || type.includes('object')) return '{}'
    
    return '"mock value"'
  }

  private generatePropsAssertions(analysis: ComponentAnalysis): string[] {
    return [
      'expect(screen.getByTestId(\'testId\')).toBeInTheDocument()',
      '// Add specific prop testing assertions here'
    ]
  }

  private generateInteractionSetup(analysis: ComponentAnalysis): string {
    return `
    const mockHandler = jest.fn()
    render(<${analysis.componentName} onClick={mockHandler} data-testid="testId" />)
    `
  }

  private generateInteractionAssertions(analysis: ComponentAnalysis): string[] {
    return [
      'fireEvent.click(screen.getByTestId(\'testId\'))',
      'expect(mockHandler).toHaveBeenCalled()'
    ]
  }

  private generateFormSetup(analysis: ComponentAnalysis): string {
    return `
    const mockOnChange = jest.fn()
    render(<${analysis.componentName} onChange={mockOnChange} data-testid="testId" />)
    `
  }

  private generateFormAssertions(analysis: ComponentAnalysis): string[] {
    return [
      'const input = screen.getByTestId(\'testId\')',
      'fireEvent.change(input, { target: { value: \'test input\' } })',
      'expect(mockOnChange).toHaveBeenCalledWith(\'test input\')'
    ]
  }

  private generateAccessibilitySetup(analysis: ComponentAnalysis): string {
    return this.generateBasicSetup(analysis)
  }

  private generateAccessibilityAssertions(analysis: ComponentAnalysis): string[] {
    const assertions = [
      'expect(screen.getByTestId(\'testId\')).toBeInTheDocument()'
    ]
    
    if (analysis.isInteractive) {
      assertions.push('expect(screen.getByTestId(\'testId\')).toHaveAttribute(\'tabIndex\')')
    }
    
    return assertions
  }

  private generateErrorSetup(analysis: ComponentAnalysis): string {
    return `
    const mockError = jest.fn()
    console.error = mockError
    render(<${analysis.componentName} data-testid="testId" />)
    `
  }

  private generateErrorAssertions(analysis: ComponentAnalysis): string[] {
    return [
      '// Component should handle errors gracefully',
      'expect(screen.getByTestId(\'testId\')).toBeInTheDocument()'
    ]
  }

  private async writeTestFile(analysis: ComponentAnalysis, scenarios: TestScenario[]): Promise<void> {
    const testPath = this.getTestPath(analysis.filePath)
    const testDir = path.dirname(testPath)
    
    // Ensure test directory exists
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
    
    const testContent = this.generateTestFileContent(analysis, scenarios)
    fs.writeFileSync(testPath, testContent)
  }

  private getTestPath(componentPath: string): string {
    const dir = path.dirname(componentPath)
    const basename = path.basename(componentPath, '.tsx')
    return path.join(dir, '__tests__', `${basename}.test.tsx`)
  }

  private generateTestFileContent(analysis: ComponentAnalysis, scenarios: TestScenario[]): string {
    const imports = this.generateTestImports(analysis)
    const mockSetup = this.generateMockSetup(analysis)
    const testCases = scenarios.map(scenario => this.generateTestCase(scenario)).join('\n\n')
    
    return `${imports}

${mockSetup}

describe('${analysis.componentName}', () => {
${testCases}
})
`
  }

  private generateTestImports(analysis: ComponentAnalysis): string {
    const relativePath = path.relative(
      path.dirname(this.getTestPath(analysis.filePath)),
      analysis.filePath.replace('.tsx', '')
    ).replace(/\\/g, '/')
    
    let imports = `import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ${analysis.componentName} from '${relativePath}'`
    
    // Add additional imports based on component analysis
    if (analysis.isFormComponent) {
      imports += `\nimport userEvent from '@testing-library/user-event'`
    }
    
    return imports
  }

  private generateMockSetup(analysis: ComponentAnalysis): string {
    let setup = ''
    
    if (analysis.imports.some(imp => imp.includes('firebase'))) {
      setup += `
// Mock Firebase
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn()
}))
`
    }
    
    if (analysis.imports.some(imp => imp.includes('next/router'))) {
      setup += `
// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {}
  })
}))
`
    }
    
    return setup
  }

  private generateTestCase(scenario: TestScenario): string {
    const assertions = scenario.assertions.map(assertion => `    ${assertion}`).join('\n')
    
    return `  it('${scenario.name}', () => {
    ${scenario.setup}
    
${assertions}
  })`
  }
}

// Main execution
async function main() {
  const generator = new TestGenerator()
  await generator.generateAllTests()
  console.log('🎉 Test generation completed!')
}

if (require.main === module) {
  main().catch(console.error)
}

export { TestGenerator }