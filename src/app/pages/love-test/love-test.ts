import { Component, computed, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

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

@Component({
  selector: 'app-love-test',
  imports: [ButtonModule],
  templateUrl: './love-test.html',
  styleUrl: './love-test.scss',
})
export class LoveTest {
  public sociotypeQuestions = signal<Question[]>(sociotypeQuestions);

  public questions = signal<Question[]>(sociotypeQuestions);
  public currentQuestion = signal<number>(0);
  public question = computed<Question>(() => this.questions()[this.currentQuestion()]);
  public questionOptions = computed(() => this.question().options);
  public answers = signal<Record<number, number>>({ 0: 0 });

  selectedAnswers: (Dichotomy | null)[] = Array(sociotypeQuestions.length).fill(null);

  public handleAnswer(questionId: number, value: Dichotomy, answerIndex: number): void {
    this.selectedAnswers[answerIndex] = value;

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

  finishTest() {
    if (this.selectedAnswers.includes(null)) {
      alert('Please answer all questions.');
      return;
    }

    const result = calculateSociotype(this.selectedAnswers as Dichotomy[]);
    console.log(result);
    // e.g. { type: "INTP", percentages: { E: 40, I: 60, ... } }
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

  return {
    type,
    //@ts-ignore
    percentages: {
      ...ei,
      ...sn,
      ...tf,
      ...jp,
    },
  };
}

const sociotypeQuestions: Question[] = [
  // Extraversion (E) vs Introversion (I)
  {
    id: 1,
    text: 'At social events, do you usually...',
    options: [
      { label: 'Talk to many people, including strangers', value: 'E' },
      { label: 'Stick with close friends or leave early', value: 'I' },
    ],
  },
  {
    id: 2,
    text: 'When working on a project, do you prefer...',
    options: [
      { label: 'Group brainstorming sessions', value: 'E' },
      { label: 'Quiet, independent work', value: 'I' },
    ],
  },
  {
    id: 3,
    text: 'You gain energy from...',
    options: [
      { label: 'Being around people', value: 'E' },
      { label: 'Spending time alone', value: 'I' },
    ],
  },
  {
    id: 4,
    text: 'In conversations, you usually...',
    options: [
      { label: 'Jump in and share your thoughts quickly', value: 'E' },
      { label: 'Listen carefully before speaking', value: 'I' },
    ],
  },
  {
    id: 5,
    text: 'When meeting new people, you usually feel...',
    options: [
      { label: 'Excited and curious', value: 'E' },
      { label: 'Reserved or cautious', value: 'I' },
    ],
  },
  {
    id: 6,
    text: 'You’re more comfortable...',
    options: [
      { label: 'In a busy, active environment', value: 'E' },
      { label: 'In a calm, quiet environment', value: 'I' },
    ],
  },
  {
    id: 7,
    text: 'Do you usually...',
    options: [
      { label: 'Think out loud', value: 'E' },
      { label: 'Think things through silently', value: 'I' },
    ],
  },
  {
    id: 8,
    text: 'People would describe you as...',
    options: [
      { label: 'Outgoing and energetic', value: 'E' },
      { label: 'Thoughtful and reserved', value: 'I' },
    ],
  },
  {
    id: 9,
    text: 'When you’re bored, you prefer...',
    options: [
      { label: 'Finding someone to hang out with', value: 'E' },
      { label: 'Doing something solo you enjoy', value: 'I' },
    ],
  },
  {
    id: 10,
    text: 'Your focus tends to be...',
    options: [
      { label: 'On the outer world', value: 'E' },
      { label: 'On your inner world', value: 'I' },
    ],
  },
  {
    id: 11,
    text: 'In a group project, you usually...',
    options: [
      { label: 'Take the lead and coordinate', value: 'E' },
      { label: 'Support quietly and do your part', value: 'I' },
    ],
  },

  // Sensing (S) vs Intuition (N)
  {
    id: 12,
    text: 'When learning something new, do you prefer...',
    options: [
      { label: 'Concrete facts and practical examples', value: 'S' },
      { label: 'Patterns and abstract concepts', value: 'N' },
    ],
  },
  {
    id: 13,
    text: 'When describing something, you usually...',
    options: [
      { label: 'Stick to what you saw/heard', value: 'S' },
      { label: 'Add interpretations and possibilities', value: 'N' },
    ],
  },
  {
    id: 14,
    text: 'Do you trust more...',
    options: [
      { label: 'Your five senses', value: 'S' },
      { label: 'Your gut instincts', value: 'N' },
    ],
  },
  {
    id: 15,
    text: 'Your attention tends to go to...',
    options: [
      { label: 'Details and specifics', value: 'S' },
      { label: 'Big picture and future possibilities', value: 'N' },
    ],
  },
  {
    id: 16,
    text: 'You are more likely to be described as...',
    options: [
      { label: 'Realistic and practical', value: 'S' },
      { label: 'Imaginative and abstract', value: 'N' },
    ],
  },
  {
    id: 17,
    text: 'When remembering events, you recall...',
    options: [
      { label: 'Exact details and facts', value: 'S' },
      { label: 'Impressions and meanings', value: 'N' },
    ],
  },
  {
    id: 18,
    text: 'You value more...',
    options: [
      { label: 'What is proven and certain', value: 'S' },
      { label: 'What is possible and potential', value: 'N' },
    ],
  },
  {
    id: 19,
    text: 'When problem-solving, you tend to...',
    options: [
      { label: 'Rely on past experience', value: 'S' },
      { label: 'Look for new approaches', value: 'N' },
    ],
  },
  {
    id: 20,
    text: 'Your communication style is often...',
    options: [
      { label: 'Literal and precise', value: 'S' },
      { label: 'Figurative and symbolic', value: 'N' },
    ],
  },
  {
    id: 21,
    text: 'You are more attracted to...',
    options: [
      { label: 'Practical tools and objects', value: 'S' },
      { label: 'Innovative ideas and theories', value: 'N' },
    ],
  },
  {
    id: 22,
    text: 'In daily life, you prefer...',
    options: [
      { label: 'Clear, step-by-step instructions', value: 'S' },
      { label: 'Exploring your own methods', value: 'N' },
    ],
  },

  // Thinking (T) vs Feeling (F)
  {
    id: 23,
    text: 'When making decisions, you prioritize...',
    options: [
      { label: 'Logic and fairness', value: 'T' },
      { label: 'Values and harmony', value: 'F' },
    ],
  },
  {
    id: 24,
    text: 'When giving feedback, you are more likely to...',
    options: [
      { label: 'Be direct and objective', value: 'T' },
      { label: 'Be considerate of feelings', value: 'F' },
    ],
  },
  {
    id: 25,
    text: 'In conflicts, you focus on...',
    options: [
      { label: 'Solving the problem', value: 'T' },
      { label: 'Preserving relationships', value: 'F' },
    ],
  },
  {
    id: 26,
    text: 'People often describe you as...',
    options: [
      { label: 'Analytical and firm', value: 'T' },
      { label: 'Compassionate and warm', value: 'F' },
    ],
  },
  {
    id: 27,
    text: 'You prefer decisions to be...',
    options: [
      { label: 'Impersonal and fair', value: 'T' },
      { label: 'Personal and considerate', value: 'F' },
    ],
  },
  {
    id: 28,
    text: 'You are more satisfied when you...',
    options: [
      { label: 'Achieve a logical solution', value: 'T' },
      { label: 'Help someone feel better', value: 'F' },
    ],
  },
  {
    id: 29,
    text: 'When faced with a tough choice, you rely on...',
    options: [
      { label: 'Facts and analysis', value: 'T' },
      { label: 'Values and empathy', value: 'F' },
    ],
  },
  {
    id: 30,
    text: 'At work, you are more focused on...',
    options: [
      { label: 'Objectives and efficiency', value: 'T' },
      { label: 'Team harmony and support', value: 'F' },
    ],
  },
  {
    id: 31,
    text: 'Your communication style is usually...',
    options: [
      { label: 'Straightforward and brief', value: 'T' },
      { label: 'Gentle and diplomatic', value: 'F' },
    ],
  },
  {
    id: 32,
    text: 'You are more likely to trust...',
    options: [
      { label: 'Reason over feelings', value: 'T' },
      { label: 'Feelings over reason', value: 'F' },
    ],
  },
  {
    id: 33,
    text: 'You are motivated more by...',
    options: [
      { label: 'Accomplishments and results', value: 'T' },
      { label: 'Recognition and appreciation', value: 'F' },
    ],
  },

  // Judging (J) vs Perceiving (P)
  {
    id: 34,
    text: 'Do you prefer your plans to be...',
    options: [
      { label: 'Structured and decided in advance', value: 'J' },
      { label: 'Flexible and adaptable', value: 'P' },
    ],
  },
  {
    id: 35,
    text: 'When working on tasks, you usually...',
    options: [
      { label: 'Finish them well before the deadline', value: 'J' },
      { label: 'Work closer to the deadline', value: 'P' },
    ],
  },
  {
    id: 36,
    text: 'How do you approach daily life?',
    options: [
      { label: 'With clear routines', value: 'J' },
      { label: 'By adapting as things come', value: 'P' },
    ],
  },
  {
    id: 37,
    text: 'You feel more comfortable when...',
    options: [
      { label: 'Things are settled', value: 'J' },
      { label: 'Options are still open', value: 'P' },
    ],
  },
  {
    id: 38,
    text: 'Your workspace is usually...',
    options: [
      { label: 'Organized and tidy', value: 'J' },
      { label: 'Flexible and spontaneous', value: 'P' },
    ],
  },
  {
    id: 39,
    text: 'When approaching a project, you prefer...',
    options: [
      { label: 'A step-by-step plan', value: 'J' },
      { label: 'Figuring it out as you go', value: 'P' },
    ],
  },
  {
    id: 40,
    text: 'You are more likely to be described as...',
    options: [
      { label: 'Decisive and structured', value: 'J' },
      { label: 'Easygoing and flexible', value: 'P' },
    ],
  },
  {
    id: 41,
    text: 'You usually...',
    options: [
      { label: 'Stick to schedules', value: 'J' },
      { label: 'Prefer freedom from schedules', value: 'P' },
    ],
  },
  {
    id: 42,
    text: 'When starting something new, you...',
    options: [
      { label: 'Plan carefully before starting', value: 'J' },
      { label: 'Dive in and figure it out later', value: 'P' },
    ],
  },
  {
    id: 43,
    text: 'Deadlines are...',
    options: [
      { label: 'Motivators to stay organized', value: 'J' },
      { label: 'Flexible guidelines', value: 'P' },
    ],
  },
  {
    id: 44,
    text: 'You feel most satisfied when...',
    options: [
      { label: 'Tasks are completed and closed', value: 'J' },
      { label: 'You can keep exploring possibilities', value: 'P' },
    ],
  },
];
