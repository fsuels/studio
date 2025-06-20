// src/components/help/ContextualLegalHelp.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  HelpCircle, 
  BookOpen, 
  Scale, 
  AlertTriangle, 
  Lightbulb,
  Search,
  ExternalLink,
  MessageCircle,
  Play,
  Clock,
  Star,
  User,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LegalConcept {
  id: string;
  term: string;
  definition: string;
  jurisdiction: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  examples: string[];
  relatedTerms: string[];
  warnings?: string[];
}

interface ContextualExample {
  id: string;
  title: string;
  scenario: string;
  explanation: string;
  tips: string[];
  commonMistakes: string[];
}

interface HelpResource {
  id: string;
  type: 'article' | 'video' | 'example' | 'template' | 'checklist';
  title: string;
  description: string;
  url?: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  viewCount: number;
}

interface ContextualLegalHelpProps {
  fieldId?: string;
  documentType: string;
  userJurisdiction?: string;
  userExperience?: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const ContextualLegalHelp: React.FC<ContextualLegalHelpProps> = ({
  fieldId,
  documentType,
  userJurisdiction = 'US-ALL',
  userExperience = 'beginner',
  className
}) => {
  const { t } = useTranslation('help');
  const [legalConcepts, setLegalConcepts] = React.useState<LegalConcept[]>([]);
  const [examples, setExamples] = React.useState<ContextualExample[]>([]);
  const [resources, setResources] = React.useState<HelpResource[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'concepts' | 'examples' | 'resources'>('concepts');
  const [isLoading, setIsLoading] = React.useState(false);

  // Load contextual help content
  React.useEffect(() => {
    loadContextualHelp();
  }, [fieldId, documentType, userJurisdiction]);

  const loadContextualHelp = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/help/contextual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          documentType,
          jurisdiction: userJurisdiction,
          experience: userExperience
        })
      });

      const data = await response.json();
      setLegalConcepts(data.concepts || []);
      setExamples(data.examples || []);
      setResources(data.resources || []);
    } catch (error) {
      console.error('Failed to load contextual help:', error);
      // Load fallback content
      loadFallbackContent();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFallbackContent = () => {
    // Provide basic help content as fallback
    setLegalConcepts([
      {
        id: 'consideration',
        term: 'Consideration',
        definition: 'Something of value exchanged between parties in a contract.',
        jurisdiction: ['US-ALL'],
        complexity: 'basic',
        examples: ['Money', 'Services', 'Goods', 'Promises'],
        relatedTerms: ['Contract', 'Agreement', 'Exchange'],
        warnings: ['Consideration must have legal value']
      }
    ]);
  };

  const searchHelp = async (query: string) => {
    if (!query.trim()) return;

    try {
      const response = await fetch('/api/help/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          documentType,
          jurisdiction: userJurisdiction,
          context: fieldId
        })
      });

      const results = await response.json();
      // Update relevant sections with search results
      setLegalConcepts(results.concepts || []);
      setExamples(results.examples || []);
      setResources(results.resources || []);
    } catch (error) {
      console.error('Help search failed:', error);
    }
  };

  const handleTermClick = (term: string) => {
    // Navigate to or highlight related content
    setSearchQuery(term);
    searchHelp(term);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'example': return <Lightbulb className="h-4 w-4" />;
      case 'template': return <User className="h-4 w-4" />;
      case 'checklist': return <Building className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const filteredConcepts = legalConcepts.filter(concept =>
    !searchQuery || 
    concept.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExamples = examples.filter(example =>
    !searchQuery ||
    example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    example.scenario.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(resource =>
    !searchQuery ||
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-2 h-8", className)}
        >
          <HelpCircle className="h-4 w-4" />
          Legal Help
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="h-5 w-5 text-primary" />
              Legal Assistant
            </CardTitle>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search legal terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchHelp(searchQuery)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Tabs */}
            <div className="flex border-b">
              {[
                { key: 'concepts', label: 'Terms', icon: BookOpen },
                { key: 'examples', label: 'Examples', icon: Lightbulb },
                { key: 'resources', label: 'Resources', icon: ExternalLink }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                    activeTab === tab.key 
                      ? "text-primary border-b-2 border-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  {/* Legal Concepts */}
                  {activeTab === 'concepts' && (
                    <div className="space-y-3">
                      {filteredConcepts.map(concept => (
                        <LegalConceptCard
                          key={concept.id}
                          concept={concept}
                          onTermClick={handleTermClick}
                        />
                      ))}
                      
                      {filteredConcepts.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No legal terms found</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Examples */}
                  {activeTab === 'examples' && (
                    <div className="space-y-3">
                      {filteredExamples.map(example => (
                        <ExampleCard key={example.id} example={example} />
                      ))}
                      
                      {filteredExamples.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No examples found</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resources */}
                  {activeTab === 'resources' && (
                    <div className="space-y-3">
                      {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                      
                      {filteredResources.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          <ExternalLink className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No resources found</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-3 bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Need more help?</span>
                <Button variant="ghost" size="sm" className="h-6 gap-1">
                  <MessageCircle className="h-3 w-3" />
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

// Legal concept card component
const LegalConceptCard: React.FC<{
  concept: LegalConcept;
  onTermClick: (term: string) => void;
}> = ({ concept, onTermClick }) => {
  return (
    <Card className="p-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{concept.term}</h4>
          <Badge variant="outline" className={getComplexityColor(concept.complexity)}>
            {concept.complexity}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">{concept.definition}</p>
        
        {concept.warnings && concept.warnings.length > 0 && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
            <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
            <span className="text-amber-800">{concept.warnings[0]}</span>
          </div>
        )}
        
        {concept.relatedTerms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {concept.relatedTerms.slice(0, 3).map(term => (
              <button
                key={term}
                onClick={() => onTermClick(term)}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

// Example card component
const ExampleCard: React.FC<{ example: ContextualExample }> = ({ example }) => {
  return (
    <Card className="p-3">
      <Accordion type="single" collapsible>
        <AccordionItem value="example" className="border-none">
          <AccordionTrigger className="text-sm font-medium py-0 hover:no-underline">
            {example.title}
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">{example.scenario}</p>
            <p className="text-sm">{example.explanation}</p>
            
            {example.tips.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-green-800 mb-1">💡 Tips:</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {example.tips.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {example.commonMistakes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-red-800 mb-1">⚠️ Common Mistakes:</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {example.commonMistakes.map((mistake, idx) => (
                    <li key={idx}>• {mistake}</li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

// Resource card component
const ResourceCard: React.FC<{ resource: HelpResource }> = ({ resource }) => {
  return (
    <Card className="p-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          {getResourceIcon(resource.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{resource.title}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {resource.rating.toFixed(1)}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {resource.type}
              </Badge>
              {resource.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {resource.duration}m
                </div>
              )}
            </div>
            
            {resource.url && (
              <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                Open
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

function getComplexityColor(complexity: string) {
  switch (complexity) {
    case 'basic': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getResourceIcon(type: string) {
  switch (type) {
    case 'article': return <BookOpen className="h-4 w-4" />;
    case 'video': return <Play className="h-4 w-4" />;
    case 'example': return <Lightbulb className="h-4 w-4" />;
    case 'template': return <User className="h-4 w-4" />;
    case 'checklist': return <Building className="h-4 w-4" />;
    default: return <HelpCircle className="h-4 w-4" />;
  }
}

export default ContextualLegalHelp;