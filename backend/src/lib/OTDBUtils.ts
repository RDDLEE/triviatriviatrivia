import he from "he";
import { StandardAnswerCoice, StandardQuestion } from "./QuestionUtils";

export interface OTDBResponse {
  response_code: OTDBResponseCodes;
  results: OTDBQuestion[];
}

export enum OTDBResponseCodes {
  // Code 0: Success Returned results successfully.
  SUCCESS = 0,
  // Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
  NO_RESULTS = 1,
  // Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
  INVALID_PARAMS = 2,
  // Code 3: Token Not Found Session Token does not exist.
  TOKEN_NOT_FOUND = 3,
  // Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
  TOKEN_EMPTY_SESSION = 4,
  // Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.
  RATE_LIMIT = 5,
}

export interface OTDBQuestion {
  type: "any" | "multiple" | boolean;
  difficulty: "any" | "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface StandardizeAnswersReturn {
  correctAnswerID: number;
  answerChoices: StandardAnswerCoice[];
}

export default class OTDBUtils {
  public static readonly standardizeQuestions = (otdbQuestions: OTDBQuestion[]): StandardQuestion[] => {
    const standardQuestions: StandardQuestion[] = [];
    for (const currQ of otdbQuestions) {
      const standardAnswers = OTDBUtils.standardizeAnswers(currQ);
      standardQuestions.push({
        prompt: he.decode(currQ.question),
        correctAnswerID: standardAnswers.correctAnswerID,
        choices: standardAnswers.answerChoices,
      });
    }
    return standardQuestions;
  }

  private static readonly standardizeAnswers = (question: OTDBQuestion): StandardizeAnswersReturn => {
    const correctAnswer = question.correct_answer;
    const incorrectAnswers = question.incorrect_answers;
    const shuffled = [correctAnswer, ...incorrectAnswers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    let correctAnswerID = -1;
    const standardAnswers: StandardAnswerCoice[] = [];
    for (let i = 0; i < shuffled.length; i++) {
      const currAnswer = shuffled[i];
      if (currAnswer === correctAnswer) {
        correctAnswerID = i;
      }
      standardAnswers.push({
        answerID: i,
        text: he.decode(currAnswer),
      });
    }
    // TODO: Can/should add "No Answer" for an answer choice.
    return {
      correctAnswerID: correctAnswerID,
      answerChoices: standardAnswers,
    };
  }
}
