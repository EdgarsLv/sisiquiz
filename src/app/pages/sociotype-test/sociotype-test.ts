import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { db } from '../../firebase.config';
import { collection, serverTimestamp } from 'firebase/firestore';
import { StorageService } from '../../services/storage.service';
import { gsap } from 'gsap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TestQuestion, testQuestions } from './questions';
import { map } from 'rxjs';

type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: Dichotomy;
  }[];
}

interface TestResult {
  type: string; // e.g., "INTP"
  percentages: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

function mapQuestionsToLanguage(questions: TestQuestion[], lang: 'en' | 'lv'): Question[] {
  return questions.map((q) => ({
    id: q.id,
    text: q.text[lang],
    options: q.options.map((opt) => ({
      label: opt.label[lang],
      value: opt.value,
    })),
  }));
}

@Component({
  selector: 'app-sociotype-test',
  imports: [ButtonModule, ProgressBarModule, TagModule, TranslatePipe],
  templateUrl: './sociotype-test.html',
  styleUrl: './sociotype-test.scss',
})
export class SociotypeTest {
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private translate = inject(TranslateService);

  public currentLanguage = signal<'en' | 'lv'>('lv');
  public questions = computed<Question[]>(() =>
    mapQuestionsToLanguage(testQuestions, this.currentLanguage())
  );
  public currentQuestion = signal<number>(0);
  public question = computed<Question>(() => this.questions()[this.currentQuestion()]);
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
  public answeredQuestions = computed(() => {
    const answered = Object.keys(this.answers()).length - 1;
    return Math.min(answered, this.questions().length - 1);
  });
  private selectedAnswers: (Dichotomy | null)[] = Array(testQuestions.length).fill(null);
  private profile = this.authService.profile;

  public justSelected = false;
  @ViewChild('questionEl') questionEl!: ElementRef;
  @ViewChild('optionsContainer') optionsContainer!: ElementRef;

  constructor() {
    const current = this.translate.getCurrentLang() as 'en' | 'lv';
    this.currentLanguage.set(current);

    this.translate.onLangChange.subscribe((event) => {
      this.currentLanguage.set(event.lang as 'en' | 'lv');
    });
  }

  public handleAnswer(questionId: number, value: Dichotomy, answerIndex: number): void {
    this.selectedAnswers[questionId - 1] = value;

    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    this.justSelected = true;
    if (this.currentQuestion() === this.questions().length - 1) return;
    this.animateSelection(this.currentQuestion() + 1);
  }

  private animateSelection(index: number): void {
    const question = this.questionEl.nativeElement;
    gsap.to(question, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
    });

    const container = this.optionsContainer.nativeElement;
    gsap.to(container, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.currentQuestion.set(index);

        gsap.fromTo(
          question,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );

        gsap.fromTo(
          container,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      },
    });
  }

  public onAnswerAnimationEnd(): void {
    if (this.justSelected) {
      this.justSelected = false;
      this.nextQuestion();
    }
  }

  public nextQuestion = () => {
    if (this.currentQuestion() < this.questions().length - 1) {
      this.animateSelection(this.currentQuestion() + 1);
    }
  };

  public prevQuestion = () => {
    if (this.currentQuestion() > 0) {
      this.animateSelection(this.currentQuestion() - 1);
    }
  };

  public setQuestion(index: number): void {
    this.animateSelection(index);
  }

  public handleSubmit(): void {
    this.isLoading.set(true);

    if (this.selectedAnswers.includes(null)) {
      alert('Please answer all questions.');
      return;
    }

    const result = calculateSociotype(this.selectedAnswers as Dichotomy[]);
    this.saveTestResult(result);
  }

  private async saveTestResult(result: TestResult): Promise<void> {
    try {
      const userId = this.authService.authUser()!.uid;
      const resultRef = collection(db, `users/${userId}/mbtiResults`);

      const finalResult = {
        ...result,
        gender: this.profile()?.gender,
        age: this.profile()?.age,
        createdAt: serverTimestamp(),
      };
      await this.firebaseService.add(resultRef, finalResult);

      this.storageService.storeTimer('mbti');
      this.router.navigate(['/results']);
    } catch (err) {
      console.error('Failed to save test result', err);
      this.isLoading.set(false);
    }
  }
}

export function calculateSociotype(answers: Dichotomy[]): TestResult {
  // Initialize counters
  const counts: Record<Dichotomy, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Count answers
  answers.forEach((ans) => {
    counts[ans] = (counts[ans] || 0) + 1;
  });

  // Calculate percentages for each dichotomy pair
  const calcPercent = (a: Dichotomy, b: Dichotomy) => {
    const total = counts[a] + counts[b];
    if (total === 0) return { [a]: 50, [b]: 50 }; // fallback if unanswered
    return {
      [a]: Math.round((counts[a] / total) * 100),
      [b]: Math.round((counts[b] / total) * 100),
    };
  };

  const ei = calcPercent('E', 'I');
  const sn = calcPercent('S', 'N');
  const tf = calcPercent('T', 'F');
  const jp = calcPercent('J', 'P');

  // Determine type by highest percentage in each dichotomy
  const type =
    (ei['E'] >= ei['I'] ? 'E' : 'I') +
    (sn['S'] >= sn['N'] ? 'S' : 'N') +
    (tf['T'] >= tf['F'] ? 'T' : 'F') +
    (jp['J'] >= jp['P'] ? 'J' : 'P');

  const percentages = {
    E: ei['E'],
    I: ei['I'],
    S: sn['S'],
    N: sn['N'],
    T: tf['T'],
    F: tf['F'],
    J: jp['J'],
    P: jp['P'],
  };

  return {
    type,
    percentages,
  };
}

export function shuffle<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

//  const randomizedQuestions = testQuestions.map((q) => ({
//   ...q,
//   options: shuffle([...q.options]),
// }));
