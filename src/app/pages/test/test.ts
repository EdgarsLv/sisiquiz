import { Component, computed, inject, signal } from '@angular/core';
import { interval, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { TTestResult } from '../results/results';

type Questions = {
  id: number;
  type: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: string;
};

@Component({
  selector: 'app-test',
  imports: [ButtonModule, ProgressBarModule, TagModule],
  templateUrl: './test.html',
  styleUrl: './test.scss',
})
export class Test {
  private firebaseService = inject(FirebaseService);
  public authService = inject(AuthService);
  public router = inject(Router);

  public questions = signal<Questions[]>(questions);
  public currentQuestion = signal<number>(0);
  public question = computed<Questions>(
    () => this.questions()[this.currentQuestion()]
  );
  public questionOptions = computed(() => this.question().options);
  public answers = signal<Record<number, number>>({ 0: 0 });
  public timeLeft = signal<number>(1800);
  public startTime = signal<number>(Date.now());
  public formattedTime = signal<string>('30:00');
  public showResult = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public submitDisabled = computed(
    () => Object.keys(this.answers()).length - 1 < this.questions().length
  );
  public progressValue = computed(() => {
    const answered = Object.keys(this.answers()).length - 1;
    const total = this.questions().length;

    return total > 0 ? Math.round((answered / total) * 100) : 0;
  });

  private destroy$ = new Subject<void>();

  public user = this.authService.authUser;

  ngOnInit(): void {
    this.startCountdown();
  }

  private startCountdown(): void {
    interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        takeWhile(() => this.timeLeft() > 0 && !this.showResult()),
        tap(() => {
          this.timeLeft.update((val) => val - 1);
          this.formattedTime.set(this.formatTime(this.timeLeft()));

          if (this.timeLeft() === 0) {
            this.handleSubmit();
          }
        })
      )
      .subscribe();
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  public handleAnswer(questionId: number, answerIndex: number): void {
    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  }

  public calculateScore(): any {
    let correct = 0;
    let totalPoints = 0;

    this.questions().forEach((question) => {
      const userAnswer = this.answers()[question.id];
      if (userAnswer === question.correct) {
        correct++;
        // Weight questions by difficulty
        const points =
          question.difficulty === 'easy'
            ? 1
            : question.difficulty === 'medium'
            ? 2
            : 3;
        totalPoints += points;
      }
    });

    // Calculate IQ score (scaled to typical IQ range)
    const maxPoints = this.questions().reduce(
      (sum, q) =>
        sum + (q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3),
      0
    );

    const percentage = totalPoints / maxPoints;
    const iqScore = Math.round(70 + percentage * 60); // Scale to 70-130 range

    return {
      correct,
      total: this.questions().length,
      iqScore,
      totalPoints,
      maxPoints,
    };
  }

  public handleSubmit(): void {
    this.isLoading.set(true);
    const timeSpent = Math.round((Date.now() - this.startTime()) / 1000);
    const { iqScore } = this.calculateScore();
    this.showResult.set(true);

    const result = {
      score: iqScore,
      timeSpent,
      date: new Date().toISOString(),
    };

    this.saveTestResult(result);
  }

  private saveTestResult(result: TTestResult): void {
    const userId = this.authService.authUser()!.uid;
    const coleclectionRef = collection(db, `users/${userId}/testResults`);

    this.firebaseService
      .add(coleclectionRef, result)
      .then((resultId) => window.localStorage.setItem('testResultId', resultId))
      .then(() => this.router.navigate(['/results']))
      .catch(() => this.isLoading.set(false));
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

const questions = [
  {
    id: 1,
    type: 'pattern',
    question: 'What comes next in this sequence: 2, 4, 8, 16, ?',
    options: ['24', '32', '30', '28'],
    correct: 1,
    difficulty: 'easy',
  },
  {
    id: 2,
    type: 'logic',
    question:
      'If all roses are flowers and some flowers are red, which statement is definitely true?',
    options: [
      'All roses are red',
      'Some roses are red',
      'Some roses might be red',
      'No roses are red',
    ],
    correct: 2,
    difficulty: 'medium',
  },
  {
    id: 3,
    type: 'math',
    question: 'What is 15% of 240?',
    options: ['36', '32', '40', '38'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 4,
    type: 'pattern',
    question: 'Complete the sequence: A1, C3, E5, G7, ?',
    options: ['H8', 'I9', 'I8', 'H9'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 5,
    type: 'logic',
    question: 'Which word does not belong: Apple, Orange, Carrot, Banana',
    options: ['Apple', 'Orange', 'Carrot', 'Banana'],
    correct: 2,
    difficulty: 'easy',
  },
  {
    id: 6,
    type: 'math',
    question: 'If x + 5 = 12, what is x × 3?',
    options: ['21', '18', '24', '15'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 7,
    type: 'pattern',
    question: 'What number should replace the question mark: 3, 7, 15, 31, ?',
    options: ['63', '47', '55', '59'],
    correct: 0,
    difficulty: 'hard',
  },
  {
    id: 8,
    type: 'logic',
    question:
      'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['100 minutes', '20 minutes', '5 minutes', '1 minute'],
    correct: 2,
    difficulty: 'hard',
  },
  {
    id: 9,
    type: 'math',
    question: 'What is the next prime number after 17?',
    options: ['18', '19', '20', '21'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 10,
    type: 'pattern',
    question: 'Complete: Monday is to Tuesday as January is to ?',
    options: ['February', 'December', 'March', 'April'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 11,
    type: 'logic',
    question:
      'A bat and ball cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.20'],
    correct: 1,
    difficulty: 'hard',
  },
  {
    id: 12,
    type: 'math',
    question: 'What is 7² - 3² ?',
    options: ['40', '42', '38', '44'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 13,
    type: 'pattern',
    question: 'Find the missing number: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '13', '12', '10'],
    correct: 1,
    difficulty: 'medium',
  },
  {
    id: 14,
    type: 'logic',
    question: 'Which comes next: Triangle, Square, Pentagon, Hexagon, ?',
    options: ['Circle', 'Octagon', 'Heptagon', 'Rectangle'],
    correct: 2,
    difficulty: 'medium',
  },
  {
    id: 15,
    type: 'math',
    question: 'If 2x + 3 = 11, what is x?',
    options: ['4', '3', '5', '6'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 16,
    type: 'pattern',
    question: 'What comes next: Z, Y, X, W, ?',
    options: ['V', 'U', 'T', 'S'],
    correct: 0,
    difficulty: 'easy',
  },
  {
    id: 17,
    type: 'logic',
    question:
      'If some cats are dogs and all dogs are animals, then some cats are definitely:',
    options: ['Animals', 'Not animals', 'Wild', 'Domestic'],
    correct: 0,
    difficulty: 'medium',
  },
  {
    id: 18,
    type: 'math',
    question: 'What is 25% of 80?',
    options: ['15', '20', '25', '30'],
    correct: 1,
    difficulty: 'easy',
  },
  {
    id: 19,
    type: 'pattern',
    question: 'Complete the series: 100, 50, 25, 12.5, ?',
    options: ['6.25', '5', '7.5', '10'],
    correct: 0,
    difficulty: 'hard',
  },
  {
    id: 20,
    type: 'logic',
    question:
      'A man lives on the 20th floor. Every morning he takes the elevator down. When he comes home, he takes the elevator to the 10th floor and walks the rest, except on rainy days when he takes it all the way. Why?',
    options: [
      'He likes exercise',
      'He is short and cannot reach the 20th floor button',
      'The elevator is broken',
      'He meets friends on the 10th floor',
    ],
    correct: 1,
    difficulty: 'hard',
  },
];
