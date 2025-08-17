import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { interval, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { db } from '../../firebase.config';

type Questions = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  value: number;
  difficulty: string;
};

type TestResult = {
  score: number;
  timeSpent: number;
  date: string;
};

@Component({
  selector: 'app-iq-test',
  imports: [ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './iq-test.html',
  styleUrl: './iq-test.scss',
})
export class IqTest implements OnInit {
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
  public progressValue = computed(() => {
    const answered = Object.keys(this.answers()).length - 1;
    const total = this.questions().length;

    return total > 0 ? Math.round((answered / total) * 100) : 0;
  });
  public timeLeft = signal<number>(1500);
  public startTime = signal<number>(Date.now());
  public formattedTime = signal<string>('25:00');
  public showResult = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public submitDisabled = computed(
    () => Object.keys(this.answers()).length - 1 < this.questions().length
  );

  private destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.startCountdown();
  }

  public handleSubmit(): void {
    this.isLoading.set(true);
    const timeSpent = Math.round((Date.now() - this.startTime()) / 1000);
    const score = this.calculateScore();
    this.showResult.set(true);

    const result = {
      score,
      timeSpent,
      date: new Date().toISOString(),
    };

    this.saveTestResult(result);
  }

  private saveTestResult(result: TestResult): void {
    const userId = this.authService.authUser()!.uid;
    const coleclectionRef = collection(db, `users/${userId}/testResults`);

    this.firebaseService
      .add(coleclectionRef, result)
      .then((resultId) => window.localStorage.setItem('testResultId', resultId))
      .then(() => this.router.navigate(['/results']))
      .catch(() => this.isLoading.set(false));
  }

  private calculateScore(): number {
    let total = 0;

    this.questions().forEach((question) => {
      const picked = this.answers()[question.id];

      if (picked + 1 === question.correct) {
        total += question.value;
      }
    });

    return total + 70;
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

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  public handleAnswer(questionId: number, answerIndex: number): void {
    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
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

const questionUrl = 'assets/images/questions/';
const answerUrl = 'assets/images/answers/';

const questions: Questions[] = [
  {
    id: 1,
    question: `${questionUrl}1.png`,
    options: [
      `${answerUrl}11.png`,
      `${answerUrl}12.png`,
      `${answerUrl}13.png`,
      `${answerUrl}14.png`,
      `${answerUrl}15.png`,
      `${answerUrl}16.png`,
    ],
    correct: 1,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 2,
    question: `${questionUrl}2.png`,
    options: [
      `${answerUrl}21.png`,
      `${answerUrl}22.png`,
      `${answerUrl}23.png`,
      `${answerUrl}24.png`,
      `${answerUrl}25.png`,
      `${answerUrl}26.png`,
    ],
    correct: 5,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 3,
    question: `${questionUrl}3.png`,
    options: [
      `${answerUrl}31.png`,
      `${answerUrl}32.png`,
      `${answerUrl}33.png`,
      `${answerUrl}34.png`,
      `${answerUrl}35.png`,
      `${answerUrl}36.png`,
    ],
    correct: 6,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 4,
    question: `${questionUrl}4.png`,
    options: [
      `${answerUrl}41.png`,
      `${answerUrl}42.png`,
      `${answerUrl}43.png`,
      `${answerUrl}44.png`,
      `${answerUrl}45.png`,
      `${answerUrl}46.png`,
    ],
    correct: 6,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 5,
    question: `${questionUrl}5.png`,
    options: [
      `${answerUrl}51.png`,
      `${answerUrl}52.png`,
      `${answerUrl}53.png`,
      `${answerUrl}54.png`,
      `${answerUrl}55.png`,
      `${answerUrl}56.png`,
    ],
    correct: 4,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 6,
    question: `${questionUrl}6.png`,
    options: [
      `${answerUrl}61.png`,
      `${answerUrl}62.png`,
      `${answerUrl}63.png`,
      `${answerUrl}64.png`,
      `${answerUrl}65.png`,
      `${answerUrl}66.png`,
    ],
    correct: 5,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 7,
    question: `${questionUrl}7.png`,
    options: [
      `${answerUrl}71.png`,
      `${answerUrl}72.png`,
      `${answerUrl}73.png`,
      `${answerUrl}74.png`,
      `${answerUrl}75.png`,
      `${answerUrl}76.png`,
    ],
    correct: 5,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 8,
    question: `${questionUrl}8.png`,
    options: [
      `${answerUrl}81.png`,
      `${answerUrl}82.png`,
      `${answerUrl}83.png`,
      `${answerUrl}84.png`,
      `${answerUrl}85.png`,
      `${answerUrl}86.png`,
    ],
    correct: 3,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 9,
    question: `${questionUrl}9.png`,
    options: [
      `${answerUrl}91.png`,
      `${answerUrl}92.png`,
      `${answerUrl}93.png`,
      `${answerUrl}94.png`,
      `${answerUrl}95.png`,
      `${answerUrl}96.png`,
    ],
    correct: 4,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 10,
    question: `${questionUrl}10.png`,
    options: [
      `${answerUrl}101.png`,
      `${answerUrl}102.png`,
      `${answerUrl}103.png`,
      `${answerUrl}104.png`,
      `${answerUrl}105.png`,
      `${answerUrl}106.png`,
    ],
    correct: 4,
    value: 1,
    difficulty: 'easy',
  },
  {
    id: 11,
    question: `${questionUrl}11.png`,
    options: [
      `${answerUrl}111.png`,
      `${answerUrl}112.png`,
      `${answerUrl}113.png`,
      `${answerUrl}114.png`,
      `${answerUrl}115.png`,
      `${answerUrl}116.png`,
    ],
    correct: 1,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 12,
    question: `${questionUrl}12.png`,
    options: [
      `${answerUrl}121.png`,
      `${answerUrl}122.png`,
      `${answerUrl}123.png`,
      `${answerUrl}124.png`,
      `${answerUrl}125.png`,
      `${answerUrl}126.png`,
    ],
    correct: 1,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 13,
    question: `${questionUrl}13.png`,
    options: [
      `${answerUrl}131.png`,
      `${answerUrl}132.png`,
      `${answerUrl}133.png`,
      `${answerUrl}134.png`,
      `${answerUrl}135.png`,
      `${answerUrl}136.png`,
    ],
    correct: 2,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 14,
    question: `${questionUrl}14.png`,
    options: [
      `${answerUrl}141.png`,
      `${answerUrl}142.png`,
      `${answerUrl}143.png`,
      `${answerUrl}144.png`,
      `${answerUrl}145.png`,
      `${answerUrl}146.png`,
    ],
    correct: 1,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 15,
    question: `${questionUrl}15.png`,
    options: [
      `${answerUrl}151.png`,
      `${answerUrl}152.png`,
      `${answerUrl}153.png`,
      `${answerUrl}154.png`,
      `${answerUrl}155.png`,
      `${answerUrl}156.png`,
    ],
    correct: 6,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 16,
    question: `${questionUrl}16.png`,
    options: [
      `${answerUrl}161.png`,
      `${answerUrl}162.png`,
      `${answerUrl}163.png`,
      `${answerUrl}164.png`,
      `${answerUrl}165.png`,
      `${answerUrl}166.png`,
    ],
    correct: 2,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 17,
    question: `${questionUrl}17.png`,
    options: [
      `${answerUrl}171.png`,
      `${answerUrl}172.png`,
      `${answerUrl}173.png`,
      `${answerUrl}174.png`,
      `${answerUrl}175.png`,
      `${answerUrl}176.png`,
    ],
    correct: 4,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 18,
    question: `${questionUrl}18.png`,
    options: [
      `${answerUrl}181.png`,
      `${answerUrl}182.png`,
      `${answerUrl}183.png`,
      `${answerUrl}184.png`,
      `${answerUrl}185.png`,
      `${answerUrl}186.png`,
    ],
    correct: 3,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 19,
    question: `${questionUrl}19.png`,
    options: [
      `${answerUrl}191.png`,
      `${answerUrl}192.png`,
      `${answerUrl}193.png`,
      `${answerUrl}194.png`,
      `${answerUrl}195.png`,
      `${answerUrl}196.png`,
    ],
    correct: 1,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 20,
    question: `${questionUrl}20.png`,
    options: [
      `${answerUrl}201.png`,
      `${answerUrl}202.png`,
      `${answerUrl}203.png`,
      `${answerUrl}204.png`,
      `${answerUrl}205.png`,
      `${answerUrl}206.png`,
    ],
    correct: 1,
    value: 2,
    difficulty: 'easy',
  },
  {
    id: 21,
    question: `${questionUrl}21.png`,
    options: [
      `${answerUrl}211.png`,
      `${answerUrl}212.png`,
      `${answerUrl}213.png`,
      `${answerUrl}214.png`,
      `${answerUrl}215.png`,
      `${answerUrl}216.png`,
    ],
    correct: 2,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 22,
    question: `${questionUrl}22.png`,
    options: [
      `${answerUrl}221.png`,
      `${answerUrl}222.png`,
      `${answerUrl}223.png`,
      `${answerUrl}224.png`,
      `${answerUrl}225.png`,
      `${answerUrl}226.png`,
    ],
    correct: 5,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 23,
    question: `${questionUrl}23.png`,
    options: [
      `${answerUrl}231.png`,
      `${answerUrl}232.png`,
      `${answerUrl}233.png`,
      `${answerUrl}234.png`,
      `${answerUrl}235.png`,
      `${answerUrl}236.png`,
    ],
    correct: 6,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 24,
    question: `${questionUrl}24.png`,
    options: [
      `${answerUrl}241.png`,
      `${answerUrl}242.png`,
      `${answerUrl}243.png`,
      `${answerUrl}244.png`,
      `${answerUrl}245.png`,
      `${answerUrl}246.png`,
    ],
    correct: 6,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 25,
    question: `${questionUrl}25.png`,
    options: [
      `${answerUrl}251.png`,
      `${answerUrl}252.png`,
      `${answerUrl}253.png`,
      `${answerUrl}254.png`,
      `${answerUrl}255.png`,
      `${answerUrl}256.png`,
    ],
    correct: 5,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 26,
    question: `${questionUrl}26.png`,
    options: [
      `${answerUrl}261.png`,
      `${answerUrl}262.png`,
      `${answerUrl}263.png`,
      `${answerUrl}264.png`,
      `${answerUrl}265.png`,
      `${answerUrl}266.png`,
    ],
    correct: 6,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 27,
    question: `${questionUrl}27.png`,
    options: [
      `${answerUrl}271.png`,
      `${answerUrl}272.png`,
      `${answerUrl}273.png`,
      `${answerUrl}274.png`,
      `${answerUrl}275.png`,
      `${answerUrl}276.png`,
    ],
    correct: 1,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 28,
    question: `${questionUrl}28.png`,
    options: [
      `${answerUrl}281.png`,
      `${answerUrl}282.png`,
      `${answerUrl}283.png`,
      `${answerUrl}284.png`,
      `${answerUrl}285.png`,
      `${answerUrl}286.png`,
    ],
    correct: 1,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 29,
    question: `${questionUrl}29.png`,
    options: [
      `${answerUrl}291.png`,
      `${answerUrl}292.png`,
      `${answerUrl}293.png`,
      `${answerUrl}294.png`,
      `${answerUrl}295.png`,
      `${answerUrl}296.png`,
    ],
    correct: 5,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 30,
    question: `${questionUrl}30.png`,
    options: [
      `${answerUrl}301.png`,
      `${answerUrl}302.png`,
      `${answerUrl}303.png`,
      `${answerUrl}304.png`,
      `${answerUrl}305.png`,
      `${answerUrl}306.png`,
    ],
    correct: 5,
    value: 3,
    difficulty: 'easy',
  },
  {
    id: 31,
    question: `${questionUrl}31.png`,
    options: [
      `${answerUrl}311.png`,
      `${answerUrl}312.png`,
      `${answerUrl}313.png`,
      `${answerUrl}314.png`,
      `${answerUrl}315.png`,
      `${answerUrl}316.png`,
    ],
    correct: 5,
    value: 4,
    difficulty: 'easy',
  },
  {
    id: 32,
    question: `${questionUrl}32.png`,
    options: [
      `${answerUrl}321.png`,
      `${answerUrl}322.png`,
      `${answerUrl}323.png`,
      `${answerUrl}324.png`,
      `${answerUrl}325.png`,
      `${answerUrl}326.png`,
    ],
    correct: 1,
    value: 4,
    difficulty: 'easy',
  },
  {
    id: 33,
    question: `${questionUrl}33.png`,
    options: [
      `${answerUrl}331.png`,
      `${answerUrl}332.png`,
      `${answerUrl}333.png`,
      `${answerUrl}334.png`,
      `${answerUrl}335.png`,
      `${answerUrl}336.png`,
    ],
    correct: 6,
    value: 4,
    difficulty: 'easy',
  },
  {
    id: 34,
    question: `${questionUrl}34.png`,
    options: [
      `${answerUrl}341.png`,
      `${answerUrl}342.png`,
      `${answerUrl}343.png`,
      `${answerUrl}344.png`,
      `${answerUrl}345.png`,
      `${answerUrl}346.png`,
    ],
    correct: 6,
    value: 4,
    difficulty: 'easy',
  },
  {
    id: 35,
    question: `${questionUrl}35.png`,
    options: [
      `${answerUrl}351.png`,
      `${answerUrl}352.png`,
      `${answerUrl}353.png`,
      `${answerUrl}354.png`,
      `${answerUrl}355.png`,
      `${answerUrl}356.png`,
    ],
    correct: 4,
    value: 4,
    difficulty: 'easy',
  },
];
