export interface StandardQuestion {
  prompt: string;
  correctAnswerID: number;
  choices: StandardAnswerCoice[];
}

export interface StandardAnswerCoice {
  answerID: number;
  text: string;
}