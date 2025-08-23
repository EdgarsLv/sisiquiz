import { Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { FirebaseService } from '../../services/firebase.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';

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

@Component({
  selector: 'app-love-test',
  imports: [ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './love-test.html',
  styleUrl: './love-test.scss',
})
export class LoveTest {
  private firebaseService = inject(FirebaseService);
  public authService = inject(AuthService);
  public router = inject(Router);

  public questions = signal<Question[]>(questions);
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

  private selectedAnswers: (LoveLanguage | null)[] = Array(questions.length).fill(null);

  public justSelected = false;

  public handleAnswer(questionId: number, value: LoveLanguage, answerIndex: number): void {
    this.selectedAnswers[questionId - 1] = value;

    this.answers.update((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));

    this.justSelected = true;
  }

  public onAnswerAnimationEnd(): void {
    if (this.justSelected) {
      this.justSelected = false;
      this.nextQuestion();
    }
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

    if (this.selectedAnswers.includes(null)) {
      alert('Please answer all questions.');
      return;
    }

    const result = calculateLoveLanguageResults(this.selectedAnswers);
    this.saveTestResult(result);
    //     {
    //   counts: { words: 8, acts: 5, gifts: 6, quality: 7, touch: 4 },
    //   percentages: { words: 26.7, acts: 16.7, gifts: 20, quality: 23.3, touch: 13.3 },
    //   topLanguages: ['words']
    // }
  }

  private async saveTestResult(result: LoveTestResults): Promise<void> {
    try {
      const userId = this.authService.authUser()!.uid;
      const resultRef = collection(db, `users/${userId}/loveResults`);

      const finalResult = {
        ...result,
        createdAt: serverTimestamp(),
      };
      await this.firebaseService.add(resultRef, finalResult);

      this.router.navigate(['/results']);
    } catch (err) {
      console.error('Failed to save test result', err);
      this.isLoading.set(false);
    }
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

export const questions: Question[] = [
  {
    id: 1,
    text: 'You feel most loved when your partner:',
    options: [
      { label: 'Tells you how much they appreciate you', value: 'words' },
      { label: 'Helps you with tasks or chores', value: 'acts' },
      { label: 'Gives you a thoughtful gift', value: 'gifts' },
      { label: 'Spends quality time with you', value: 'quality' },
      { label: 'Hugs or holds your hand', value: 'touch' },
    ],
  },
  {
    id: 2,
    text: 'When you want to cheer up your partner, you:',
    options: [
      { label: 'Write them a heartfelt note', value: 'words' },
      { label: 'Do something helpful for them', value: 'acts' },
      { label: 'Bring them a small gift', value: 'gifts' },
      { label: 'Spend uninterrupted time together', value: 'quality' },
      { label: 'Give them a comforting hug', value: 'touch' },
    ],
  },
  {
    id: 3,
    text: 'Your ideal way to celebrate special moments is:',
    options: [
      { label: 'Exchanging loving words', value: 'words' },
      { label: 'Doing a meaningful activity together', value: 'acts' },
      { label: 'Giving or receiving gifts', value: 'gifts' },
      { label: 'Having quality one-on-one time', value: 'quality' },
      { label: 'Holding each other close', value: 'touch' },
    ],
  },
  {
    id: 4,
    text: 'You feel most appreciated when your partner:',
    options: [
      { label: 'Compliments or encourages you verbally', value: 'words' },
      { label: 'Performs acts of service for you', value: 'acts' },
      { label: 'Gives you something thoughtful', value: 'gifts' },
      { label: 'Focuses attention entirely on you', value: 'quality' },
      { label: 'Touches you affectionately', value: 'touch' },
    ],
  },
  {
    id: 5,
    text: 'When you’re in conflict, you value your partner:',
    options: [
      { label: 'Expressing their feelings clearly', value: 'words' },
      { label: 'Helping solve the problem practically', value: 'acts' },
      { label: 'Giving a peace offering gift', value: 'gifts' },
      { label: 'Spending time to talk it through', value: 'quality' },
      { label: 'Offering physical comfort', value: 'touch' },
    ],
  },
  {
    id: 6,
    text: 'You notice your partner’s love most when they:',
    options: [
      { label: 'Say kind things about you', value: 'words' },
      { label: 'Help with things you need', value: 'acts' },
      { label: 'Give you thoughtful presents', value: 'gifts' },
      { label: 'Plan time to be with you', value: 'quality' },
      { label: 'Touch or hug you spontaneously', value: 'touch' },
    ],
  },
  {
    id: 7,
    text: 'A perfect date for you is:',
    options: [
      { label: 'Sharing meaningful conversation', value: 'words' },
      { label: 'Doing something helpful together', value: 'acts' },
      { label: 'Exchanging gifts', value: 'gifts' },
      { label: 'Spending uninterrupted time alone together', value: 'quality' },
      { label: 'Holding hands or cuddling', value: 'touch' },
    ],
  },
  {
    id: 8,
    text: 'Your partner shows they care when they:',
    options: [
      { label: 'Give verbal praise', value: 'words' },
      { label: 'Perform helpful acts', value: 'acts' },
      { label: 'Give thoughtful gifts', value: 'gifts' },
      { label: 'Make time to be with you', value: 'quality' },
      { label: 'Offer physical affection', value: 'touch' },
    ],
  },
  {
    id: 9,
    text: 'You feel most secure in a relationship when your partner:',
    options: [
      { label: 'Expresses love verbally', value: 'words' },
      { label: 'Supports you through actions', value: 'acts' },
      { label: 'Gives meaningful gifts', value: 'gifts' },
      { label: 'Spends focused time with you', value: 'quality' },
      { label: 'Touches you affectionately', value: 'touch' },
    ],
  },
  {
    id: 10,
    text: 'The way you celebrate achievements is best with:',
    options: [
      { label: 'Words of recognition', value: 'words' },
      { label: 'Acts of service to make life easier', value: 'acts' },
      { label: 'A small reward or gift', value: 'gifts' },
      { label: 'Time spent together celebrating', value: 'quality' },
      { label: 'A congratulatory hug or touch', value: 'touch' },
    ],
  },
  {
    id: 11,
    text: 'You feel closest to your partner when they:',
    options: [
      { label: 'Tell you they love you', value: 'words' },
      { label: 'Help with something important', value: 'acts' },
      { label: 'Bring you a thoughtful present', value: 'gifts' },
      { label: 'Spend meaningful time together', value: 'quality' },
      { label: 'Hold or cuddle you', value: 'touch' },
    ],
  },
  {
    id: 12,
    text: 'When you are stressed, you feel comforted by:',
    options: [
      { label: 'Encouraging words', value: 'words' },
      { label: 'Practical help or support', value: 'acts' },
      { label: 'Receiving a small gift or token', value: 'gifts' },
      { label: 'Undivided attention and presence', value: 'quality' },
      { label: 'A warm hug or touch', value: 'touch' },
    ],
  },
  {
    id: 13,
    text: 'You know your partner loves you when they:',
    options: [
      { label: 'Say loving things regularly', value: 'words' },
      { label: 'Do kind things without being asked', value: 'acts' },
      { label: 'Give you gifts that show thoughtfulness', value: 'gifts' },
      { label: 'Spend time really listening to you', value: 'quality' },
      { label: 'Touch or hug you often', value: 'touch' },
    ],
  },
  {
    id: 14,
    text: 'You feel most appreciated when your partner:',
    options: [
      { label: 'Compliments your efforts', value: 'words' },
      { label: 'Helps make life easier', value: 'acts' },
      { label: 'Gives meaningful presents', value: 'gifts' },
      { label: 'Plans special time for you both', value: 'quality' },
      { label: 'Touches or cuddles you', value: 'touch' },
    ],
  },
  {
    id: 15,
    text: 'You would rather receive:',
    options: [
      { label: 'Words of affirmation', value: 'words' },
      { label: 'Acts of service', value: 'acts' },
      { label: 'A thoughtful gift', value: 'gifts' },
      { label: 'Quality time together', value: 'quality' },
      { label: 'Physical touch', value: 'touch' },
    ],
  },
  {
    id: 16,
    text: 'Your partner shows love most clearly when they:',
    options: [
      { label: 'Say kind things about you', value: 'words' },
      { label: 'Do helpful acts', value: 'acts' },
      { label: 'Give gifts from the heart', value: 'gifts' },
      { label: 'Spend quality time with you', value: 'quality' },
      { label: 'Touch or hug you', value: 'touch' },
    ],
  },
  {
    id: 17,
    text: 'During hard times, you feel supported when your partner:',
    options: [
      { label: 'Encourages you verbally', value: 'words' },
      { label: 'Takes action to help', value: 'acts' },
      { label: 'Gives a gift as a gesture', value: 'gifts' },
      { label: 'Spends time listening and being present', value: 'quality' },
      { label: 'Offers comforting touch', value: 'touch' },
    ],
  },
  {
    id: 18,
    text: 'The most memorable way your partner shows love is:',
    options: [
      { label: 'Through verbal affirmations', value: 'words' },
      { label: 'By helping you practically', value: 'acts' },
      { label: 'By giving meaningful gifts', value: 'gifts' },
      { label: 'By spending quality time together', value: 'quality' },
      { label: 'Through physical touch', value: 'touch' },
    ],
  },
  {
    id: 19,
    text: 'You feel valued when your partner:',
    options: [
      { label: 'Expresses appreciation in words', value: 'words' },
      { label: 'Helps with your tasks', value: 'acts' },
      { label: 'Gives thoughtful gifts', value: 'gifts' },
      { label: 'Makes time for you', value: 'quality' },
      { label: 'Touches or hugs you', value: 'touch' },
    ],
  },
  {
    id: 20,
    text: 'A romantic gesture that moves you most is:',
    options: [
      { label: 'Sweet words of love', value: 'words' },
      { label: 'Helpful acts of service', value: 'acts' },
      { label: 'Giving a meaningful gift', value: 'gifts' },
      { label: 'Spending quality time together', value: 'quality' },
      { label: 'A loving touch', value: 'touch' },
    ],
  },
  {
    id: 21,
    text: 'You feel most connected to your partner when:',
    options: [
      { label: 'They say something kind', value: 'words' },
      { label: 'They help you without being asked', value: 'acts' },
      { label: 'They give a gift with thought', value: 'gifts' },
      { label: 'They spend focused time with you', value: 'quality' },
      { label: 'They hold or touch you affectionately', value: 'touch' },
    ],
  },
  {
    id: 22,
    text: 'When you are feeling down, the best support comes from:',
    options: [
      { label: 'Words of encouragement', value: 'words' },
      { label: 'Practical help or assistance', value: 'acts' },
      { label: 'A thoughtful gift', value: 'gifts' },
      { label: 'Spending uninterrupted time together', value: 'quality' },
      { label: 'Physical comfort', value: 'touch' },
    ],
  },
  {
    id: 23,
    text: 'You feel love most strongly when your partner:',
    options: [
      { label: 'Verbalizes their affection', value: 'words' },
      { label: 'Acts to support you', value: 'acts' },
      { label: 'Gives you gifts that matter', value: 'gifts' },
      { label: 'Spends quality time', value: 'quality' },
      { label: 'Touches you affectionately', value: 'touch' },
    ],
  },
  {
    id: 24,
    text: 'Your partner’s actions that mean the most are:',
    options: [
      { label: 'Speaking loving words', value: 'words' },
      { label: 'Performing helpful deeds', value: 'acts' },
      { label: 'Gifting meaningful items', value: 'gifts' },
      { label: 'Being fully present with you', value: 'quality' },
      { label: 'Showing affection physically', value: 'touch' },
    ],
  },
  {
    id: 25,
    text: 'You feel love through your partner’s:',
    options: [
      { label: 'Compliments and encouragement', value: 'words' },
      { label: 'Helpful actions', value: 'acts' },
      { label: 'Thoughtful gifts', value: 'gifts' },
      { label: 'Time spent together', value: 'quality' },
      { label: 'Touch and physical closeness', value: 'touch' },
    ],
  },
  {
    id: 26,
    text: 'The way your partner shows they care most is:',
    options: [
      { label: 'With kind words', value: 'words' },
      { label: 'By doing helpful acts', value: 'acts' },
      { label: 'By giving gifts', value: 'gifts' },
      { label: 'By spending quality time', value: 'quality' },
      { label: 'Through affectionate touch', value: 'touch' },
    ],
  },
  {
    id: 27,
    text: 'You feel appreciated when your partner:',
    options: [
      { label: 'Praises you verbally', value: 'words' },
      { label: 'Acts kindly or helpfully', value: 'acts' },
      { label: 'Gives thoughtful gifts', value: 'gifts' },
      { label: 'Spends meaningful time with you', value: 'quality' },
      { label: 'Touches or hugs you', value: 'touch' },
    ],
  },
  {
    id: 28,
    text: 'Your partner’s love is clearest when they:',
    options: [
      { label: 'Say something affirming', value: 'words' },
      { label: 'Do something helpful', value: 'acts' },
      { label: 'Give a meaningful gift', value: 'gifts' },
      { label: 'Spend quality time', value: 'quality' },
      { label: 'Show affectionate touch', value: 'touch' },
    ],
  },
  {
    id: 29,
    text: 'You feel closest to your partner when they:',
    options: [
      { label: 'Speak words of love', value: 'words' },
      { label: 'Perform helpful actions', value: 'acts' },
      { label: 'Give a thoughtful gift', value: 'gifts' },
      { label: 'Share uninterrupted time', value: 'quality' },
      { label: 'Offer physical affection', value: 'touch' },
    ],
  },
  {
    id: 30,
    text: 'Overall, you feel most loved when your partner:',
    options: [
      { label: 'Says kind and affirming things', value: 'words' },
      { label: 'Helps and supports you', value: 'acts' },
      { label: 'Gives meaningful gifts', value: 'gifts' },
      { label: 'Spends quality time together', value: 'quality' },
      { label: 'Touches or hugs you affectionately', value: 'touch' },
    ],
  },
];
