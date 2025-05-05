// src/components/StepOneInput.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { usStates } from '@/lib/document-library'; // Import full state list
import { Loader2 } from 'lucide-react'; // Import Loader2

interface Props {
  input: string
  setInput: (val: string) => void
  state: string | undefined // Allow undefined
  setState: (val: string | undefined) => void // Allow undefined
  onAnalyze: () => void
  isLoading: boolean // Added isLoading prop back
  isRecording: boolean
  startMic: () => void
  stopMic: () => void
  mode: 'text' | 'microphone' // Changed back to 'microphone'
  setMode: (val: 'text' | 'microphone') => void // Changed back to 'microphone'
  transcript: string
  recognition: any | null // Added recognition prop back
}

export default function StepOneInput({
  input,
  setInput,
  state,
  setState,
  onAnalyze,
  isLoading, // Ensure isLoading is received
  isRecording,
  startMic,
  stopMic,
  mode,
  setMode,
  transcript,
  recognition, // Ensure recognition is received
}: Props) {
  const { t } = useTranslation()

  // Derive labels outside JSX for clarity
  const textLabel = `📝 ${t('stepOne.text')}`;
  const micLabel = isRecording
    ? `⏹ ${t('stepOne.stopMic')}`
    : `🎤 ${t('stepOne.startMic')}`;

  return (
    // Use Card styles from the application, remove bg-white, shadow
    <div className="p-0"> {/* Adjusted padding to 0 as Card likely handles it */}
       <h2 className="text-2xl font-bold mb-2 sr-only">{t('stepOne.title')}</h2> {/* Title already in CardHeader, keep for screen readers */}
       <p className="mb-4 text-muted-foreground sr-only">{t('stepOne.description')}</p> {/* Description also in CardHeader */}

      {/* Toggle Tabs - Use App's theme colors */}
      <div className="flex mb-4 border-b border-border">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-150 ${mode === 'text' ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
          onClick={() => {
              if (isRecording) stopMic();
              setMode('text');
          }}
          disabled={isLoading}
          aria-selected={mode === 'text'}
        >
          {textLabel}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-150 ${mode === 'microphone' ? (isRecording ? 'border-destructive text-destructive font-semibold' : 'border-primary text-primary font-semibold') : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'} ${!recognition ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => {
             if (!recognition) return; // Prevent action if mic not supported
             setMode('microphone'); // Switch mode first
             if (isRecording) {
                 stopMic();
             } else {
                 startMic();
             }
          }}
          disabled={isLoading || !recognition} // Disable if loading or mic not supported
          aria-selected={mode === 'microphone'}
        >
          {micLabel}
        </button>
      </div>

      {/* Input or Mic Area */}
      <div className="space-y-4">
        {mode === 'text' && (
          <div className="space-y-2">
             <Label htmlFor="description-text" className="sr-only">{t('stepOne.textDescriptionLabel', { defaultValue: 'Description (Text)' })}</Label>
              <Textarea
                id="description-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('stepOne.placeholder')}
                className="min-h-[120px] bg-card" // Use theme background
                disabled={isLoading}
                aria-describedby="text-helper-text"
              />
             <p id="text-helper-text" className="text-xs text-muted-foreground pl-1">
                 {t('documentInference.textHelper', { defaultValue: 'Describe your situation clearly.' })}
             </p>
          </div>
        )}

        {mode === 'microphone' && (
          <div className="space-y-2">
            <Label htmlFor="description-mic" className="sr-only">{t('stepOne.micDescriptionLabel', { defaultValue: 'Description (Microphone Transcript)' })}</Label>
            <div
              id="description-mic"
              className="min-h-[120px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" // Theme styles
              aria-live="polite"
            >
              {/* Display live transcript including interim results */}
              {transcript || (
                 <span className="text-muted-foreground italic">
                      {isRecording ? t('stepOne.listening') : (recognition ? t('documentInference.micTranscriptPlaceholderStart', { defaultValue: 'Click "Start Mic" tab to begin.' }) : t('documentInference.micTranscriptPlaceholderUnavailable', { defaultValue: 'Microphone not available.' }))}
                 </span>
              )}
            </div>
             <p id="mic-helper-text" className="text-xs text-muted-foreground pl-1">
               {isRecording ? <span className="text-destructive font-medium">{t('documentInference.micHelperRecording', { defaultValue: 'Recording... Speak clearly. Click "Stop Recording" tab when done.' })}</span> : (recognition ? t('documentInference.micHelperStart', { defaultValue: 'Click tab above to start recording.' }) : t('documentInference.micHelperUnavailable', { defaultValue: 'Mic unavailable.' }))}
           </p>
          </div>
        )}

        {/* State Select */}
        <div className="space-y-2">
          <Label htmlFor="state-select">📍 {t('stepOne.stateLabel')}</Label>
           <Select
             value={state} // Use undefined for no selection
             onValueChange={(value) => {
                 const newState = value === 'none' ? undefined : value;
                 setState(newState);
             }}
             disabled={isLoading || isRecording}
           >
            <SelectTrigger id="state-select">
              <SelectValue placeholder={t('stepOne.statePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {/* Add a "None" option */}
              <SelectItem key="none-option" value="none">{t('stepOne.statePlaceholder', { defaultValue: 'Select State...' })}</SelectItem>
               {/* Use the full list */}
              {usStates.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label} ({s.value})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{t('stepOne.stateHelp')}</p>
        </div>

        {/* Analyze Button */}
        <Button onClick={onAnalyze} className="w-full" disabled={isLoading || isRecording || !input.trim()}>
           {isLoading ? (
             <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('documentInference.analyzingButton', { defaultValue: 'Analyzing...' })} </>
           ) : (
             <> ⚖️ {t('stepOne.analyze')} </>
           )}
        </Button>
      </div>
    </div>
  )
}
