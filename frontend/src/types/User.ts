export interface User {
  name: string;
  age: number;
  avatar: string;
  badges: string[];
  level: number;
  points: number;
}

export interface GameProgress {
  robotPuzzle: number;
  techQuiz: number;
  circuitBuilder: number;
}
