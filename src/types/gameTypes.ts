export type LetterState = 'unknown' | 'absent' | 'present' | 'correct';

export interface GameState {
  currentRow: number;
  currentCol: number;
  guesses: string[][];
  gameOver: boolean;
  won: boolean;
  targetWord: string;
}
