import { AnswerID } from "trivia-shared";

export interface StandardQuestion {
  prompt: string;
  correctAnswerID: AnswerID;
  choices: StandardAnswerCoice[];
}

export interface StandardAnswerCoice {
  answerID: AnswerID;
  text: string;
}