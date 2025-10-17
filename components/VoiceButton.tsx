'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceButtonProps {
  voiceUrl?: string;
  fallbackText?: string;
}

export function VoiceButton({ voiceUrl, fallbackText }: VoiceButtonProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (voiceUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(voiceUrl);
        audioRef.current.onended = () => setPlaying(false);
      }

      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  };

  const handleTTS = () => {
    if (!fallbackText) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(fallbackText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleClick = () => {
    if (voiceUrl) {
      handlePlayAudio();
    } else if (fallbackText) {
      handleTTS();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-2"
      disabled={!voiceUrl && !fallbackText}
    >
      {playing ? (
        <Pause className="h-3 w-3" />
      ) : voiceUrl ? (
        <Play className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}

      {playing ? 'Playing...' : voiceUrl ? 'Play Voice' : 'Read Aloud'}

      {playing && (
        <div className="flex gap-0.5">
          <div className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: '0ms' }} />
          <div className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: '150ms' }} />
          <div className="h-3 w-0.5 animate-pulse bg-primary" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </Button>
  );
}
