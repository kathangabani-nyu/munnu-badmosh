"use client";

interface NoteProps {
  text: string;
  className?: string;
}

export function Note({ text, className = "" }: NoteProps) {
  if (!text) return null;

  return (
    <p className={`font-hand text-[clamp(1.25rem,3vw,1.75rem)] text-[var(--map-ink)] mt-4 leading-snug max-w-xl ${className}`}>
      {text}
    </p>
  );
}
