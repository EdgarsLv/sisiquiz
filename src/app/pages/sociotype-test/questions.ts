export type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export interface TestQuestion {
  id: number;
  text: { en: string; lv: string };
  options: { label: { en: string; lv: string }; value: Dichotomy }[];
}

export const testQuestions: TestQuestion[] = [
  // Extraversion (E) vs Introversion (I)
  {
    id: 1,
    text: {
      en: 'At social events, do you usually...',
      lv: 'Sabiedriskos pasākumos tu parasti...',
    },
    options: [
      {
        label: {
          en: 'Stick with close friends or leave early',
          lv: 'Paliec ar tuviem draugiem vai aizej ātri',
        },
        value: 'I',
      },
      {
        label: {
          en: 'Talk to many people, including strangers',
          lv: 'Runā ar daudziem cilvēkiem, arī svešiniekiem',
        },
        value: 'E',
      },
    ],
  },
  {
    id: 2,
    text: {
      en: 'When working on a project, do you prefer...',
      lv: 'Strādājot pie projekta, tu dod priekšroku...',
    },
    options: [
      { label: { en: 'Group brainstorming sessions', lv: 'Grupas ideju vētrām' }, value: 'E' },
      { label: { en: 'Quiet, independent work', lv: 'Klusam, neatkarīgam darbam' }, value: 'I' },
    ],
  },
  {
    id: 3,
    text: {
      en: 'You gain energy from...',
      lv: 'Tu gūsti enerģiju no...',
    },
    options: [
      { label: { en: 'Being around people', lv: 'Būšanas kopā ar cilvēkiem' }, value: 'E' },
      { label: { en: 'Spending time alone', lv: 'Laika pavadīšanas vienatnē' }, value: 'I' },
    ],
  },
  {
    id: 4,
    text: {
      en: 'In conversations, you usually...',
      lv: 'Sarunās tu parasti...',
    },
    options: [
      {
        label: {
          en: 'Jump in and share your thoughts quickly',
          lv: 'Pieslēdzies un ātri dalies ar savām domām',
        },
        value: 'E',
      },
      {
        label: { en: 'Listen carefully before speaking', lv: 'Noklausies uzmanīgi pirms runā' },
        value: 'I',
      },
    ],
  },
  {
    id: 5,
    text: {
      en: 'When meeting new people, you usually feel...',
      lv: 'Satiekot jaunus cilvēkus, tu parasti jūties...',
    },
    options: [
      { label: { en: 'Excited and curious', lv: 'Satraukts un ziņkārīgs' }, value: 'E' },
      { label: { en: 'Reserved or cautious', lv: 'Atturīgs vai piesardzīgs' }, value: 'I' },
    ],
  },
  {
    id: 6,
    text: {
      en: 'You’re more comfortable...',
      lv: 'Tev ērtāk ir...',
    },
    options: [
      { label: { en: 'In a busy, active environment', lv: 'Rosīgā, aktīvā vidē' }, value: 'E' },
      { label: { en: 'In a calm, quiet environment', lv: 'Mierīgā, klusā vidē' }, value: 'I' },
    ],
  },
  {
    id: 7,
    text: {
      en: 'Do you usually...',
      lv: 'Tu parasti...',
    },
    options: [
      { label: { en: 'Think out loud', lv: 'Domā skaļi' }, value: 'E' },
      { label: { en: 'Think things through silently', lv: 'Pārdomā klusumā' }, value: 'I' },
    ],
  },
  {
    id: 8,
    text: {
      en: 'People would describe you as...',
      lv: 'Cilvēki tevi raksturotu kā...',
    },
    options: [
      { label: { en: 'Outgoing and energetic', lv: 'Atvērts un enerģisks' }, value: 'E' },
      { label: { en: 'Thoughtful and reserved', lv: 'Pārdomāts un atturīgs' }, value: 'I' },
    ],
  },
  {
    id: 9,
    text: {
      en: 'When you’re bored, you prefer...',
      lv: 'Kad tev ir garlaicīgi, tu dod priekšroku...',
    },
    options: [
      {
        label: { en: 'Finding someone to hang out with', lv: 'Atrast kādu, ar ko pavadīt laiku' },
        value: 'E',
      },
      {
        label: { en: 'Doing something solo you enjoy', lv: 'Darīt kaut ko vienatnē, kas patīk' },
        value: 'I',
      },
    ],
  },
  {
    id: 10,
    text: {
      en: 'Your focus tends to be...',
      lv: 'Tava uzmanība parasti ir vērsta...',
    },
    options: [
      { label: { en: 'On the outer world', lv: 'Uz ārpasauli' }, value: 'E' },
      { label: { en: 'On your inner world', lv: 'Uz savu iekšējo pasauli' }, value: 'I' },
    ],
  },
  {
    id: 11,
    text: {
      en: 'In a group project, you usually...',
      lv: 'Grupas projektā tu parasti...',
    },
    options: [
      {
        label: { en: 'Take the lead and coordinate', lv: 'Uzņemies vadību un koordinē' },
        value: 'E',
      },
      {
        label: { en: 'Support quietly and do your part', lv: 'Klusām atbalsti un dari savu daļu' },
        value: 'I',
      },
    ],
  },

  // Sensing (S) vs Intuition (N)
  {
    id: 12,
    text: {
      en: 'When learning something new, do you prefer...',
      lv: 'Mācoties kaut ko jaunu, tu dod priekšroku...',
    },
    options: [
      {
        label: {
          en: 'Concrete facts and practical examples',
          lv: 'Konkrētiem faktiem un praktiskiem piemēriem',
        },
        value: 'S',
      },
      {
        label: { en: 'Patterns and abstract concepts', lv: 'Paraugiem un abstraktiem jēdzieniem' },
        value: 'N',
      },
    ],
  },
  {
    id: 13,
    text: {
      en: 'When describing something, you usually...',
      lv: 'Aprakstot kaut ko, tu parasti...',
    },
    options: [
      {
        label: { en: 'Stick to what you saw/heard', lv: 'Pieturies pie tā, ko redzēji/dzirdēji' },
        value: 'S',
      },
      {
        label: {
          en: 'Add interpretations and possibilities',
          lv: 'Pievieno interpretācijas un iespējas',
        },
        value: 'N',
      },
    ],
  },
  {
    id: 14,
    text: {
      en: 'Do you trust more...',
      lv: 'Tu vairāk uzticies...',
    },
    options: [
      { label: { en: 'Your five senses', lv: 'Savām piecām maņām' }, value: 'S' },
      { label: { en: 'Your gut instincts', lv: 'Savām sajūtām (intuīcijai)' }, value: 'N' },
    ],
  },
  {
    id: 15,
    text: {
      en: 'Your attention tends to go to...',
      lv: 'Tava uzmanība parasti vērsta uz...',
    },
    options: [
      { label: { en: 'Details and specifics', lv: 'Detaļām un konkrētām lietām' }, value: 'S' },
      {
        label: { en: 'Big picture and future possibilities', lv: 'Kopainu un nākotnes iespējām' },
        value: 'N',
      },
    ],
  },
  {
    id: 16,
    text: {
      en: 'You are more likely to be described as...',
      lv: 'Tevi biežāk raksturo kā...',
    },
    options: [
      { label: { en: 'Realistic and practical', lv: 'Reālistisku un praktisku' }, value: 'S' },
      { label: { en: 'Imaginative and abstract', lv: 'Izdomas bagātu un abstraktu' }, value: 'N' },
    ],
  },
  {
    id: 17,
    text: {
      en: 'When remembering events, you recall...',
      lv: 'Atceroties notikumus, tu atceries...',
    },
    options: [
      { label: { en: 'Exact details and facts', lv: 'Precīzas detaļas un faktus' }, value: 'S' },
      { label: { en: 'Impressions and meanings', lv: 'Iespaidus un nozīmes' }, value: 'N' },
    ],
  },
  {
    id: 18,
    text: {
      en: 'You value more...',
      lv: 'Tu vairāk novērtē...',
    },
    options: [
      {
        label: { en: 'What is proven and certain', lv: 'To, kas ir pierādīts un drošs' },
        value: 'S',
      },
      {
        label: { en: 'What is possible and potential', lv: 'To, kas ir iespējams un potenciāls' },
        value: 'N',
      },
    ],
  },
  {
    id: 19,
    text: {
      en: 'When problem-solving, you tend to...',
      lv: 'Risinot problēmas, tu mēdz...',
    },
    options: [
      {
        label: { en: 'Rely on past experience', lv: 'Paļauties uz iepriekšējo pieredzi' },
        value: 'S',
      },
      { label: { en: 'Look for new approaches', lv: 'Meklēt jaunus risinājumus' }, value: 'N' },
    ],
  },
  {
    id: 20,
    text: {
      en: 'Your communication style is often...',
      lv: 'Tavs komunikācijas stils bieži ir...',
    },
    options: [
      { label: { en: 'Literal and precise', lv: 'Tiešs un precīzs' }, value: 'S' },
      { label: { en: 'Figurative and symbolic', lv: 'Figuratīvs un simbolisks' }, value: 'N' },
    ],
  },
  {
    id: 21,
    text: {
      en: 'You are more attracted to...',
      lv: 'Tevi vairāk piesaista...',
    },
    options: [
      {
        label: { en: 'Practical tools and objects', lv: 'Praktiski rīki un priekšmeti' },
        value: 'S',
      },
      {
        label: { en: 'Innovative ideas and theories', lv: 'Inovatīvas idejas un teorijas' },
        value: 'N',
      },
    ],
  },
  {
    id: 22,
    text: {
      en: 'In daily life, you prefer...',
      lv: 'Ikdienas dzīvē tu dod priekšroku...',
    },
    options: [
      {
        label: {
          en: 'Clear, step-by-step instructions',
          lv: 'Skaidrām, soli pa solim instrukcijām',
        },
        value: 'S',
      },
      { label: { en: 'Exploring your own methods', lv: 'Savām metodēm un izpētei' }, value: 'N' },
    ],
  },
  {
    id: 23,
    text: {
      en: 'When making decisions, you prioritize...',
      lv: 'Pieņemot lēmumus, tu dod priekšroku...',
    },
    options: [
      { label: { en: 'Logic and fairness', lv: 'Loģikai un taisnīgumam' }, value: 'T' },
      { label: { en: 'Values and harmony', lv: 'Vērtībām un harmonijai' }, value: 'F' },
    ],
  },
  {
    id: 24,
    text: {
      en: 'When giving feedback, you are more likely to...',
      lv: 'Dodot atsauksmes, tu biežāk...',
    },
    options: [
      { label: { en: 'Be direct and objective', lv: 'Esi tiešs un objektīvs' }, value: 'T' },
      { label: { en: 'Be considerate of feelings', lv: 'Ņem vērā jūtas' }, value: 'F' },
    ],
  },
  {
    id: 25,
    text: {
      en: 'In conflicts, you focus on...',
      lv: 'Konfliktos tu koncentrējies uz...',
    },
    options: [
      { label: { en: 'Solving the problem', lv: 'Problēmas risināšanu' }, value: 'T' },
      { label: { en: 'Preserving relationships', lv: 'Attiecību saglabāšanu' }, value: 'F' },
    ],
  },
  {
    id: 26,
    text: {
      en: 'People often describe you as...',
      lv: 'Cilvēki bieži tevi raksturo kā...',
    },
    options: [
      { label: { en: 'Analytical and firm', lv: 'Analītisku un stingru' }, value: 'T' },
      { label: { en: 'Compassionate and warm', lv: 'Līdzjūtīgu un siltu' }, value: 'F' },
    ],
  },
  {
    id: 27,
    text: {
      en: 'You prefer decisions to be...',
      lv: 'Tu dod priekšroku, lai lēmumi būtu...',
    },
    options: [
      { label: { en: 'Impersonal and fair', lv: 'Neitrāli un taisnīgi' }, value: 'T' },
      { label: { en: 'Personal and considerate', lv: 'Personīgi un iejūtīgi' }, value: 'F' },
    ],
  },
  {
    id: 28,
    text: {
      en: 'You are more satisfied when you...',
      lv: 'Tu esi vairāk apmierināts, kad...',
    },
    options: [
      { label: { en: 'Achieve a logical solution', lv: 'Panāc loģisku risinājumu' }, value: 'T' },
      { label: { en: 'Help someone feel better', lv: 'Palīdzi kādam justies labāk' }, value: 'F' },
    ],
  },
  {
    id: 29,
    text: {
      en: 'When faced with a tough choice, you rely on...',
      lv: 'Saskaroties ar grūtu izvēli, tu paļaujies uz...',
    },
    options: [
      { label: { en: 'Facts and analysis', lv: 'Faktiem un analīzi' }, value: 'T' },
      { label: { en: 'Values and empathy', lv: 'Vērtībām un empātiju' }, value: 'F' },
    ],
  },
  {
    id: 30,
    text: {
      en: 'At work, you are more focused on...',
      lv: 'Darbā tu vairāk koncentrējies uz...',
    },
    options: [
      { label: { en: 'Objectives and efficiency', lv: 'Mērķiem un efektivitāti' }, value: 'T' },
      {
        label: { en: 'Team harmony and support', lv: 'Komandas harmoniju un atbalstu' },
        value: 'F',
      },
    ],
  },
  {
    id: 31,
    text: {
      en: 'Your communication style is usually...',
      lv: 'Tavs komunikācijas stils parasti ir...',
    },
    options: [
      { label: { en: 'Straightforward and brief', lv: 'Tiešs un īss' }, value: 'T' },
      { label: { en: 'Gentle and diplomatic', lv: 'Maigs un diplomātisks' }, value: 'F' },
    ],
  },
  {
    id: 32,
    text: {
      en: 'You are more likely to trust...',
      lv: 'Tu biežāk uzticies...',
    },
    options: [
      { label: { en: 'Reason over feelings', lv: 'Saprātam, nevis jūtām' }, value: 'T' },
      { label: { en: 'Feelings over reason', lv: 'Jūtām, nevis saprātam' }, value: 'F' },
    ],
  },
  {
    id: 33,
    text: {
      en: 'You are motivated more by...',
      lv: 'Tevi vairāk motivē...',
    },
    options: [
      { label: { en: 'Accomplishments and results', lv: 'Sasniegumi un rezultāti' }, value: 'T' },
      { label: { en: 'Recognition and appreciation', lv: 'Atzinība un novērtējums' }, value: 'F' },
    ],
  },

  // Judging (J) vs Perceiving (P)
  {
    id: 34,
    text: {
      en: 'Do you prefer your plans to be...',
      lv: 'Tu dod priekšroku, lai tavi plāni būtu...',
    },
    options: [
      {
        label: { en: 'Structured and decided in advance', lv: 'Strukturēti un iepriekš nolemti' },
        value: 'J',
      },
      { label: { en: 'Flexible and adaptable', lv: 'Elastīgi un pielāgojami' }, value: 'P' },
    ],
  },
  {
    id: 35,
    text: {
      en: 'When working on tasks, you usually...',
      lv: 'Strādājot pie uzdevumiem, tu parasti...',
    },
    options: [
      {
        label: {
          en: 'Finish them well before the deadline',
          lv: 'Pabeidz tos krietni pirms termiņa',
        },
        value: 'J',
      },
      { label: { en: 'Work closer to the deadline', lv: 'Strādā tuvu termiņam' }, value: 'P' },
    ],
  },
  {
    id: 36,
    text: {
      en: 'How do you approach daily life?',
      lv: 'Kā tu pieej ikdienas dzīvei?',
    },
    options: [
      { label: { en: 'With clear routines', lv: 'Ar skaidrām rutīnām' }, value: 'J' },
      { label: { en: 'By adapting as things come', lv: 'Pielāgojoties notikumiem' }, value: 'P' },
    ],
  },
  {
    id: 37,
    text: {
      en: 'You feel more comfortable when...',
      lv: 'Tu jūties ērtāk, kad...',
    },
    options: [
      { label: { en: 'Things are settled', lv: 'Lietas ir sakārtotas' }, value: 'J' },
      { label: { en: 'Options are still open', lv: 'Iespējas vēl ir atvērtas' }, value: 'P' },
    ],
  },
  {
    id: 38,
    text: {
      en: 'Your workspace is usually...',
      lv: 'Tava darba vide parasti ir...',
    },
    options: [
      { label: { en: 'Organized and tidy', lv: 'Organizēta un kārtīga' }, value: 'J' },
      { label: { en: 'Flexible and spontaneous', lv: 'Elastīga un spontāna' }, value: 'P' },
    ],
  },
  {
    id: 39,
    text: {
      en: 'When approaching a project, you prefer...',
      lv: 'Sākot projektu, tu dod priekšroku...',
    },
    options: [
      { label: { en: 'A step-by-step plan', lv: 'Soli pa solim plānam' }, value: 'J' },
      { label: { en: 'Figuring it out as you go', lv: 'Izdomāt pa ceļam' }, value: 'P' },
    ],
  },
  {
    id: 40,
    text: {
      en: 'You are more likely to be described as...',
      lv: 'Tevi biežāk raksturo kā...',
    },
    options: [
      { label: { en: 'Decisive and structured', lv: 'Izlēmīgu un strukturētu' }, value: 'J' },
      { label: { en: 'Easygoing and flexible', lv: 'Vieglprātīgu un elastīgu' }, value: 'P' },
    ],
  },
  {
    id: 41,
    text: {
      en: 'You usually...',
      lv: 'Tu parasti...',
    },
    options: [
      { label: { en: 'Stick to schedules', lv: 'Ievēro grafikus' }, value: 'J' },
      {
        label: { en: 'Prefer freedom from schedules', lv: 'Dod priekšroku brīvībai no grafikiem' },
        value: 'P',
      },
    ],
  },
  {
    id: 42,
    text: {
      en: 'When starting something new, you...',
      lv: 'Sākot kaut ko jaunu, tu...',
    },
    options: [
      { label: { en: 'Plan carefully before starting', lv: 'Rūpīgi plāno pirms sāc' }, value: 'J' },
      { label: { en: 'Dive in and figure it out later', lv: 'Ielec un izdomā vēlāk' }, value: 'P' },
    ],
  },
  {
    id: 43,
    text: {
      en: 'Deadlines are...',
      lv: 'Termiņi ir...',
    },
    options: [
      {
        label: { en: 'Motivators to stay organized', lv: 'Motivatori, lai paliktu organizēts' },
        value: 'J',
      },
      { label: { en: 'Flexible guidelines', lv: 'Elastīgas vadlīnijas' }, value: 'P' },
    ],
  },
  {
    id: 44,
    text: {
      en: 'You feel most satisfied when...',
      lv: 'Tu jūties visvairāk apmierināts, kad...',
    },
    options: [
      {
        label: { en: 'Tasks are completed and closed', lv: 'Uzdevumi ir pabeigti un noslēgti' },
        value: 'J',
      },
      {
        label: { en: 'You can keep exploring possibilities', lv: 'Vari turpināt izpētīt iespējas' },
        value: 'P',
      },
    ],
  },
];
