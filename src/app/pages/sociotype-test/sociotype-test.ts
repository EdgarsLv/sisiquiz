import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

type Questions = {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
};

@Component({
  selector: 'app-sociotype-test',
  imports: [ButtonModule, ProgressBarModule, TagModule],
  templateUrl: './sociotype-test.html',
  styleUrl: './sociotype-test.scss',
})
export class SociotypeTest {
  public questions = signal<Questions[]>(questions);
  public currentQuestion = signal<number>(0);
  public question = computed<Questions>(() => this.questions()[this.currentQuestion()]);
  public questionOptions = computed(() => this.question().options);
  public answers = signal<Record<number, number>>({ 0: 0 });
  public isLoading = signal<boolean>(false);
  public submitDisabled = computed(
    () => Object.keys(this.answers()).length - 1 < this.questions().length
  );
  public progressValue = computed(() => {
    const answered = Object.keys(this.answers()).length - 1;
    const total = this.questions().length;
    return total > 0 ? Math.round((answered / total) * 100) : 0;
  });

  public handleAnswer(questionId: number, answerIndex: number): void {
    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    this.nextQuestion();
  }

  public nextQuestion = () => {
    if (this.currentQuestion() < this.questions().length - 1) {
      this.currentQuestion.set(this.currentQuestion() + 1);
    }
  };

  public prevQuestion = () => {
    if (this.currentQuestion() > 0) {
      this.currentQuestion.set(this.currentQuestion() - 1);
    }
  };

  public handleSubmit(): void {
    this.isLoading.set(true);

    // this.saveTestResult(result);
  }
}

const questions = [
  {
    id: 1,
    type: 'pattern',
    question: 'What comes next in this sequence: 2, 4, 8, 16, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'easy',
  },
  {
    id: 2,
    type: 'logic',
    question:
      'If all roses are flowers and some flowers are red, which statement is definitely true?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 2,
    difficulty: 'medium',
  },
  {
    id: 3,
    type: 'math',
    question: 'What is 15% of 240?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 4,
    type: 'pattern',
    question: 'Complete the sequence: A1, C3, E5, G7, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 5,
    type: 'logic',
    question: 'Which word does not belong: Apple, Orange, Carrot, Banana',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 2,
    difficulty: 'easy',
  },
  {
    id: 6,
    type: 'math',
    question: 'If x + 5 = 12, what is x × 3?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 7,
    type: 'pattern',
    question: 'What number should replace the question mark: 3, 7, 15, 31, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'hard',
  },
  {
    id: 8,
    type: 'logic',
    question:
      'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 2,
    difficulty: 'hard',
  },
  {
    id: 9,
    type: 'math',
    question: 'What is the next prime number after 17?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 10,
    type: 'pattern',
    question: 'Complete: Monday is to Tuesday as January is to ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 11,
    type: 'logic',
    question:
      'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'hard',
  },
  {
    id: 12,
    type: 'math',
    question: 'What is 7² - 3² ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 13,
    type: 'pattern',
    question: 'Find the missing number: 1, 1, 2, 3, 5, 8, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 14,
    type: 'logic',
    question: 'Which comes next: Triangle, Square, Pentagon, Hexagon, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 2,
    difficulty: 'medium',
  },
  {
    id: 15,
    type: 'math',
    question: 'If 2x + 3 = 11, what is x?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 16,
    type: 'pattern',
    question: 'What comes next: Z, Y, X, W, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 17,
    type: 'logic',
    question: 'If some cats are dogs and all dogs are animals, then some cats are definitely:',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 18,
    type: 'math',
    question: 'What is 25% of 80?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'easy',
  },
  {
    id: 19,
    type: 'pattern',
    question: 'Complete the series: 100, 50, 25, 12.5, ?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 0,
    difficulty: 'hard',
  },
  {
    id: 20,
    type: 'logic',
    question:
      'A man lives on the 20th floor. Every morning he takes the elevator down. When he comes home, he takes the elevator to the 10th floor and walks the rest, except on rainy days when he takes it all the way. Why?',
    options: ['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
    correct: 1,
    difficulty: 'hard',
  },
];
