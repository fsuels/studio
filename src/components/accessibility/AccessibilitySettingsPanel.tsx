'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccessibility } from '@/contexts/AccessibilityProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Eye,
  Brain,
  Keyboard,
  Volume2,
  RotateCcw,
  Settings,
  Type,
  Contrast,
  FileText,
  Lightbulb,
  Zap,
  Users,
} from 'lucide-react';

interface AccessibilitySettingsPanelProps {
  className?: string;
}

export function AccessibilitySettingsPanel({ className }: AccessibilitySettingsPanelProps) {
  const { preferences, updatePreferences, resetPreferences, isAccessibilityModeActive } = useAccessibility();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('reading');

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
    
    // Show confirmation toast
    toast({
      title: value ? 'Feature Enabled' : 'Feature Disabled',
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}.`,
      duration: 2000,
    });
  };

  const handleSelectChange = (key: keyof typeof preferences, value: string) => {
    updatePreferences({ [key]: value as any });
    toast({
      title: 'Setting Updated',
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been updated.`,
      duration: 2000,
    });
  };

  const handleReset = () => {
    resetPreferences();
    toast({
      title: 'Settings Reset',
      description: 'All accessibility settings have been reset to defaults.',
      duration: 3000,
    });
  };

  const QuickToggleButton = ({ 
    icon: Icon, 
    label, 
    isActive, 
    onClick 
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    isActive: boolean; 
    onClick: () => void;
  }) => (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Plain-Language & Accessibility</CardTitle>
            {isAccessibilityModeActive && (
              <Badge variant="secondary" className="ml-2">
                Active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        <CardDescription>
          Customize your reading and accessibility experience. These settings are saved to your device and sync across sessions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Quick Toggle Bar */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3 block">Quick Actions</Label>
          <div className="flex flex-wrap gap-2">
            <QuickToggleButton
              icon={FileText}
              label="Plain Language"
              isActive={preferences.plainLanguageMode}
              onClick={() => handleToggle('plainLanguageMode', !preferences.plainLanguageMode)}
            />
            <QuickToggleButton
              icon={Type}
              label="Dyslexia Font"
              isActive={preferences.dyslexiaFriendlyFont}
              onClick={() => handleToggle('dyslexiaFriendlyFont', !preferences.dyslexiaFriendlyFont)}
            />
            <QuickToggleButton
              icon={Contrast}
              label="High Contrast"
              isActive={preferences.highContrast}
              onClick={() => handleToggle('highContrast', !preferences.highContrast)}
            />
            <QuickToggleButton
              icon={Lightbulb}
              label="Auto Explain"
              isActive={preferences.autoExplainClauses}
              onClick={() => handleToggle('autoExplainClauses', !preferences.autoExplainClauses)}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Detailed Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reading" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Reading
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              Cognitive
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-1">
              <Keyboard className="h-4 w-4" />
              Navigation
            </TabsTrigger>
          </TabsList>

          {/* Reading & Language Tab */}
          <TabsContent value="reading" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Plain Language Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Simplify legal documents with AI-powered plain English summaries
                  </p>
                </div>
                <Switch
                  checked={preferences.plainLanguageMode}
                  onCheckedChange={(checked) => handleToggle('plainLanguageMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Document Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Display AI-generated summaries at the top of documents
                  </p>
                </div>
                <Switch
                  checked={preferences.showDocumentSummary}
                  onCheckedChange={(checked) => handleToggle('showDocumentSummary', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Simplify Legal Jargon</Label>
                  <p className="text-sm text-muted-foreground">
                    Replace complex legal terms with everyday language
                  </p>
                </div>
                <Switch
                  checked={preferences.simplifyLegalJargon}
                  onCheckedChange={(checked) => handleToggle('simplifyLegalJargon', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Reading Level</Label>
                <Select
                  value={preferences.readingLevel}
                  onValueChange={(value) => handleSelectChange('readingLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple (6th grade level)</SelectItem>
                    <SelectItem value="standard">Standard (high school level)</SelectItem>
                    <SelectItem value="advanced">Advanced (college level)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Visual Accessibility Tab */}
          <TabsContent value="visual" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">
                    Use OpenDyslexic font for improved readability
                  </p>
                </div>
                <Switch
                  checked={preferences.dyslexiaFriendlyFont}
                  onCheckedChange={(checked) => handleToggle('dyslexiaFriendlyFont', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select
                  value={preferences.fontSize}
                  onValueChange={(value) => handleSelectChange('fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (14px)</SelectItem>
                    <SelectItem value="medium">Medium (16px)</SelectItem>
                    <SelectItem value="large">Large (18px)</SelectItem>
                    <SelectItem value="extra-large">Extra Large (20px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Line Spacing</Label>
                <Select
                  value={preferences.lineHeight}
                  onValueChange={(value) => handleSelectChange('lineHeight', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable (1.5x)</SelectItem>
                    <SelectItem value="relaxed">Relaxed (1.6x)</SelectItem>
                    <SelectItem value="loose">Loose (1.8x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast</Label>
                  <p className="text-sm text-muted-foreground">
                    Increase contrast for better visibility
                  </p>
                </div>
                <Switch
                  checked={preferences.highContrast}
                  onCheckedChange={(checked) => handleToggle('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  checked={preferences.reduceMotion}
                  onCheckedChange={(checked) => handleToggle('reduceMotion', checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Cognitive Accessibility Tab */}
          <TabsContent value="cognitive" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Progress Indicators</Label>
                  <p className="text-sm text-muted-foreground">
                    Display progress bars and step indicators
                  </p>
                </div>
                <Switch
                  checked={preferences.showProgressIndicators}
                  onCheckedChange={(checked) => handleToggle('showProgressIndicators', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Break Down Complex Forms</Label>
                  <p className="text-sm text-muted-foreground">
                    Split long forms into manageable steps
                  </p>
                </div>
                <Switch
                  checked={preferences.breakDownComplexForms}
                  onCheckedChange={(checked) => handleToggle('breakDownComplexForms', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Highlight Important Sections</Label>
                  <p className="text-sm text-muted-foreground">
                    Visually emphasize critical information
                  </p>
                </div>
                <Switch
                  checked={preferences.highlightImportantSections}
                  onCheckedChange={(checked) => handleToggle('highlightImportantSections', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Explain Legal Clauses</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically show explanations for complex terms
                  </p>
                </div>
                <Switch
                  checked={preferences.autoExplainClauses}
                  onCheckedChange={(checked) => handleToggle('autoExplainClauses', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Contextual Help</Label>
                  <p className="text-sm text-muted-foreground">
                    Show helpful tips and guidance throughout the interface
                  </p>
                </div>
                <Switch
                  checked={preferences.contextualHelp}
                  onCheckedChange={(checked) => handleToggle('contextualHelp', checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Navigation & Controls Tab */}
          <TabsContent value="navigation" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Keyboard Shortcuts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable keyboard shortcuts for quick access (Alt + key)
                  </p>
                </div>
                <Switch
                  checked={preferences.keyboardShortcutsEnabled}
                  onCheckedChange={(checked) => handleToggle('keyboardShortcutsEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enhanced Focus Indicators</Label>
                  <p className="text-sm text-muted-foreground">
                    Show larger, more visible focus outlines
                  </p>
                </div>
                <Switch
                  checked={preferences.focusIndicatorEnhanced}
                  onCheckedChange={(checked) => handleToggle('focusIndicatorEnhanced', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skip Links Visible</Label>
                  <p className="text-sm text-muted-foreground">
                    Always show skip navigation links
                  </p>
                </div>
                <Switch
                  checked={preferences.skipLinksVisible}
                  onCheckedChange={(checked) => handleToggle('skipLinksVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Voice Guidance</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable audio cues and voice navigation assistance
                  </p>
                </div>
                <Switch
                  checked={preferences.voiceGuidance}
                  onCheckedChange={(checked) => handleToggle('voiceGuidance', checked)}
                />
              </div>

              {preferences.keyboardShortcutsEnabled && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Alt + P: Toggle Plain Language</div>
                    <div>Alt + C: Toggle High Contrast</div>
                    <div>Alt + D: Toggle Dyslexia Font</div>
                    <div>Alt + +: Increase Font Size</div>
                    <div>Alt + -: Decrease Font Size</div>
                    <div>⌘ + /: Keyboard Shortcuts</div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Status Summary */}
        {isAccessibilityModeActive && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Accessibility Mode Active
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Your customized accessibility settings are improving your experience. 
              These preferences are automatically saved and will apply across all sessions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AccessibilitySettingsPanel;