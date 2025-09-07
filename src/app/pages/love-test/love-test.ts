import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { StorageService } from '../../services/storage.service';
import { gsap } from 'gsap';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TestQuestion, testQuestions } from './questions';

type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';
interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: LoveLanguage;
  }[];
}

export type LoveTestResults = {
  counts: Record<LoveLanguage, number>;
  percentages: Record<LoveLanguage, number>;
  topLanguages: LoveLanguage[];
};

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
  selector: 'app-love-test',
  imports: [ButtonModule, TagModule, ProgressBarModule, TranslatePipe],
  templateUrl: './love-test.html',
  styleUrl: './love-test.scss',
})
export class LoveTest {
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
    return Math.min(answered, this.questions().length);
  });

  private selectedAnswers: (LoveLanguage | null)[] = Array(testQuestions.length).fill(null);
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

  public handleAnswer(questionId: number, value: LoveLanguage, answerIndex: number): void {
    this.selectedAnswers[questionId - 1] = value;

    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    this.justSelected = true;
    if (this.currentQuestion() === this.questions().length - 1) return;
    this.animateSelection(this.currentQuestion() + 1);
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

    const result = calculateLoveLanguageResults(this.selectedAnswers);
    this.saveTestResult(result);
  }

  private async saveTestResult(result: LoveTestResults): Promise<void> {
    try {
      const userId = this.authService.authUser()!.uid;
      const resultRef = collection(db, `users/${userId}/loveResults`);

      const finalResult = {
        ...result,
        gender: this.profile()?.gender,
        age: this.profile()?.age,
        createdAt: serverTimestamp(),
      };
      await this.firebaseService.add(resultRef, finalResult);

      this.storageService.storeTimer('love');
      this.router.navigate(['/results']);
    } catch (err) {
      console.error('Failed to save test result', err);
      this.isLoading.set(false);
    }
  }

  private animateSelection(index: number): void {
    const question = this.questionEl.nativeElement;
    const container = this.optionsContainer.nativeElement;

    gsap.to(question, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
    });

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
}

function calculateLoveLanguageResults(answers: (LoveLanguage | null)[]): LoveTestResults {
  const counts: Record<LoveLanguage, number> = {
    words: 0,
    acts: 0,
    gifts: 0,
    quality: 0,
    touch: 0,
  };

  const totalAnswered = answers.filter((ans) => ans !== null).length;

  // Count how many times each language was selected
  answers.forEach((ans) => {
    if (ans) counts[ans]++;
  });

  // Calculate percentages
  const percentages: Record<LoveLanguage, number> = {
    words: Math.round((counts.words / totalAnswered) * 100),
    acts: Math.round((counts.acts / totalAnswered) * 100),
    gifts: Math.round((counts.gifts / totalAnswered) * 100),
    quality: Math.round((counts.quality / totalAnswered) * 100),
    touch: Math.round((counts.touch / totalAnswered) * 100),
  };

  // Find the highest count(s)
  const maxCount = Math.max(...Object.values(counts));
  const topLanguages = (Object.keys(counts) as LoveLanguage[]).filter(
    (lang) => counts[lang] === maxCount
  );

  return {
    counts,
    percentages,
    topLanguages, // could be multiple if tied
  };
}

// function shuffle<T>(array: T[]): T[] {
//   return array
//     .map((item) => ({ item, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ item }) => item);
// }

// const randomizedQuestions = questions.map((q) => ({
//   ...q,
//   options: shuffle([...q.options]),
// }));
