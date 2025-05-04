// src/components/StepOneInput.tsx
'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { usStates } from '@/lib/document-library'; // Import states

interface Props {
  input: string
  setInput: (val: string) => void
  state: string | undefined // Changed to allow undefined
  setState: (val: string | undefined) => void // Changed to allow undefined
  onAnalyze: () => void
  isLoading: boolean // Added loading state from parent
  isRecording: boolean
  startMic: () => void
  stopMic: () => void
  mode: 'text' | 'microphone' // Matched parent component's mode values
  setMode: (val: 'text' | 'microphone') => void
  transcript: string
  recognition: any | null // Pass recognition status
}

export default function StepOneInput({
  input,
  setInput,
  state,
  setState,
  onAnalyze,
  isLoading,
  isRecording,
  startMic,
  stopMic,
  mode,
  setMode,
  transcript,
  recognition,
}: Props) {
  const { t } = useTranslation()

  return (
    <div className="p-0"> {/* Removed extra padding, assuming Card handles it */}
      {/* Toggle Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-150 ${mode === 'text' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
          onClick={() => {
             if (isRecording) stopMic(); // Stop mic if switching to text
             setMode('text');
          }}
          disabled={isLoading}
          aria-selected={mode === 'text'}
        >
          📝 {t('stepOne.text')}
        </button>
        <button
          className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-150 ${mode === 'microphone' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'} ${isRecording ? 'text-red-600 border-red-600' : ''}`}
          onClick={() => {
            // Toggle mic only when mic tab is activated or already active
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
          {isRecording ? '⏹ ' + t('stepOne.stopMic') : '🎤 ' + t('stepOne.startMic')}
        </button>
      </div>

      {/* Input or Mic Area */}
      <div className="space-y-4">
        {mode === 'text' && (
          <div className="space-y-2">
             <Label htmlFor="description-text" className="sr-only">{t('stepOne.textDescriptionLabel')}</Label>
              <Textarea
                id="description-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('stepOne.placeholder')}
                className="min-h-[120px] bg-card"
                disabled={isLoading}
                aria-describedby="text-helper-text"
              />
             <p id="text-helper-text" className="text-xs text-muted-foreground pl-1">
                 {t('documentInference.textHelper')}
             </p>
          </div>
        )}

        {mode === 'microphone' && (
          <div className="space-y-2">
            <Label htmlFor="description-mic" className="sr-only">{t('stepOne.micDescriptionLabel')}</Label>
            <div
              id="description-mic"
              className="min-h-[120px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-live="polite"
            >
              {transcript || (
                 <span className="text-muted-foreground italic">
                      {isRecording ? t('documentInference.micTranscriptPlaceholderListening') : (recognition ? t('documentInference.micTranscriptPlaceholderStart') : t('documentInference.micTranscriptPlaceholderUnavailable'))}
                 </span>
              )}
            </div>
            <p id="mic-helper-text" className="text-xs text-muted-foreground pl-1">
               {isRecording ? <span className="text-red-600 font-medium">{t('documentInference.micHelperRecording')}</span> : (recognition ? t('documentInference.micHelperStart') : t('documentInference.micHelperUnavailable'))}
           </p>
          </div>
        )}

        {/* State Select */}
        <div className="space-y-2">
          <Label htmlFor="state-select">📍 {t('stepOne.stateLabel')}</Label>
          <Select
             value={state}
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
               {/* Use the full list from document-library */}
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
             <> <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div> {t('documentInference.analyzingButton')} </>
           ) : (
             <> ⚖️ {t('stepOne.analyze')} </>
           )}
        </Button>
      </div>
    </div>
  )
}
