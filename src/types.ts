export type Tone = 'Poetic' | 'Casual' | 'Sincere' | 'Playful';
export type Intent = 'Safety Net' | 'The Move' | 'The Proposal';
export type LetterTemplate = 'Apology' | 'Gratitude' | 'Thinking of You' | 'None';

export interface LetterData {
  id: string;
  recipientName: string;
  intent: Intent;
  template?: LetterTemplate;
  specialSauce: string;
  tone: Tone;
  compliments: string[];
  letterContent: string;
  vulnerability: number;
  professionalism: number;
  nostalgia: number;
  status: 'Draft' | 'Sent' | 'Archived';
  createdAt: string;
}

export interface AppState {
  currentPhase: 'landing' | 'discovery' | 'generation' | 'review' | 'archive';
  currentLetter: Partial<LetterData>;
  history: LetterData[];
}
