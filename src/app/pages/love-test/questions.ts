export type LoveLanguage = 'words' | 'acts' | 'gifts' | 'quality' | 'touch';
export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: LoveLanguage;
  }[];
}

export interface TestQuestion {
  id: number;
  text: { en: string; lv: string };
  options: { label: { en: string; lv: string }; value: LoveLanguage }[];
}

export const testQuestions: TestQuestion[] = [
  {
    id: 1,
    text: {
      en: 'You feel most loved when your partner:',
      lv: 'Tu jūtaties vismīlētāk, kad partneris:',
    },
    options: [
      {
        label: { en: 'Tells you how much they appreciate you', lv: 'Paziņo, cik ļoti jūs novērtē' },
        value: 'words',
      },
      {
        label: {
          en: 'Helps you with tasks or chores',
          lv: 'Palīdz ar uzdevumiem vai mājas darbiem',
        },
        value: 'acts',
      },
      {
        label: { en: 'Gives you a thoughtful gift', lv: 'Dāvina pārdomātu dāvanu' },
        value: 'gifts',
      },
      {
        label: { en: 'Spends quality time with you', lv: 'Pavada kvalitatīvu laiku kopā ar jums' },
        value: 'quality',
      },
      { label: { en: 'Hugs or holds your hand', lv: 'Apskauj vai tur jūsu roku' }, value: 'touch' },
    ],
  },
  {
    id: 2,
    text: {
      en: 'When you want to cheer up your partner, you:',
      lv: 'Kad vēlaties uzmundrināt partneri, jūs:',
    },
    options: [
      {
        label: { en: 'Write them a heartfelt note', lv: 'Uzrakstīt viņiem sirsnīgu ziņu' },
        value: 'words',
      },
      {
        label: { en: 'Do something helpful for them', lv: 'Darīt kaut ko noderīgu viņiem' },
        value: 'acts',
      },
      { label: { en: 'Bring them a small gift', lv: 'Atnest nelielu dāvanu' }, value: 'gifts' },
      {
        label: {
          en: 'Spend uninterrupted time together',
          lv: 'Pavadīt laiku kopā bez pārtraukumiem',
        },
        value: 'quality',
      },
      {
        label: { en: 'Give them a comforting hug', lv: 'Dot viņiem mierinošu apskāvienu' },
        value: 'touch',
      },
    ],
  },
  {
    id: 3,
    text: {
      en: 'Your ideal way to celebrate special moments is:',
      lv: 'Jūsu ideālais veids, kā svinēt īpašus mirkļus, ir:',
    },
    options: [
      {
        label: { en: 'Exchanging loving words', lv: 'Apmainīties ar mīļiem vārdiem' },
        value: 'words',
      },
      {
        label: { en: 'Doing a meaningful activity together', lv: 'Veikt nozīmīgu aktivitāti kopā' },
        value: 'acts',
      },
      {
        label: { en: 'Giving or receiving gifts', lv: 'Dāvāt vai saņemt dāvanas' },
        value: 'gifts',
      },
      {
        label: {
          en: 'Having quality one-on-one time',
          lv: 'Pavadīt kvalitatīvu laiku viens pret vienu',
        },
        value: 'quality',
      },
      { label: { en: 'Holding each other close', lv: 'Turēt viens otru cieši' }, value: 'touch' },
    ],
  },
  {
    id: 4,
    text: {
      en: 'You feel most appreciated when your partner:',
      lv: 'Jūs jūtaties visvairāk novērtēts, kad jūsu partneris:',
    },
    options: [
      {
        label: {
          en: 'Compliments or encourages you verbally',
          lv: 'Sniedz komplimentus vai uzmundrina vārdos',
        },
        value: 'words',
      },
      {
        label: { en: 'Performs acts of service for you', lv: 'Veic pakalpojumus jums' },
        value: 'acts',
      },
      {
        label: { en: 'Gives you something thoughtful', lv: 'Dāvina kaut ko pārdomātu' },
        value: 'gifts',
      },
      {
        label: { en: 'Focuses attention entirely on you', lv: 'Pilnībā pievērš uzmanību jums' },
        value: 'quality',
      },
      {
        label: { en: 'Touches you affectionately', lv: 'Apskauj jūs ar mīlestību' },
        value: 'touch',
      },
    ],
  },
  {
    id: 5,
    text: {
      en: 'When you’re in conflict, you value your partner:',
      lv: 'Kad esat konfliktā, jūs novērtējat savu partneri:',
    },
    options: [
      {
        label: { en: 'Expressing their feelings clearly', lv: 'Skaidri izteikt savas jūtas' },
        value: 'words',
      },
      {
        label: {
          en: 'Helping solve the problem practically',
          lv: 'Palīdzēt praktiski atrisināt problēmu',
        },
        value: 'acts',
      },
      {
        label: { en: 'Giving a peace offering gift', lv: 'Dāvāt mierinājuma dāvanu' },
        value: 'gifts',
      },
      {
        label: { en: 'Spending time to talk it through', lv: 'Veltīt laiku, lai pārrunātu' },
        value: 'quality',
      },
      {
        label: { en: 'Offering physical comfort', lv: 'Sniedz fizisku mierinājumu' },
        value: 'touch',
      },
    ],
  },
  {
    id: 6,
    text: {
      en: 'You notice your partner’s love most when they:',
      lv: 'Jūs visvairāk jūtat partnera mīlestību, kad viņi:',
    },
    options: [
      {
        label: { en: 'Say kind things about you', lv: 'Saka labus vārdus par jums' },
        value: 'words',
      },
      {
        label: { en: 'Help with things you need', lv: 'Palīdz ar nepieciešamajām lietām' },
        value: 'acts',
      },
      {
        label: { en: 'Give you thoughtful presents', lv: 'Dāvina pārdomātas dāvanas' },
        value: 'gifts',
      },
      {
        label: { en: 'Plan time to be with you', lv: 'Plāno laiku, lai būt kopā ar jums' },
        value: 'quality',
      },
      {
        label: { en: 'Touch or hug you spontaneously', lv: 'Pieskaras vai apskauj spontāni' },
        value: 'touch',
      },
    ],
  },
  {
    id: 7,
    text: { en: 'A perfect date for you is:', lv: 'Ideāls randiņš jums ir:' },
    options: [
      {
        label: { en: 'Sharing meaningful conversation', lv: 'Dalīšanās ar nozīmīgu sarunu' },
        value: 'words',
      },
      {
        label: { en: 'Doing something helpful together', lv: 'Kopīgi darīt kaut ko noderīgu' },
        value: 'acts',
      },
      { label: { en: 'Exchanging gifts', lv: 'Apmainīties ar dāvanām' }, value: 'gifts' },
      {
        label: {
          en: 'Spending uninterrupted time alone together',
          lv: 'Pavadīt laiku vienatnē kopā bez pārtraukumiem',
        },
        value: 'quality',
      },
      {
        label: { en: 'Holding hands or cuddling', lv: 'Turēt rokas vai apskauties' },
        value: 'touch',
      },
    ],
  },
  {
    id: 8,
    text: {
      en: 'Your partner shows they care when they:',
      lv: 'Jūsu partneris rāda, ka rūpējas, kad viņi:',
    },
    options: [
      { label: { en: 'Give verbal praise', lv: 'Sniedz mutisku atzinību' }, value: 'words' },
      { label: { en: 'Perform helpful acts', lv: 'Veic noderīgus darbus' }, value: 'acts' },
      { label: { en: 'Give thoughtful gifts', lv: 'Dāvina pārdomātas dāvanas' }, value: 'gifts' },
      {
        label: { en: 'Make time to be with you', lv: 'Atvēl laiku būt kopā ar jums' },
        value: 'quality',
      },
      { label: { en: 'Offer physical affection', lv: 'Sniedz fizisku mīlestību' }, value: 'touch' },
    ],
  },
  {
    id: 9,
    text: {
      en: 'You feel most secure in a relationship when your partner:',
      lv: 'Jūs jūtaties visdrošāk attiecībās, kad jūsu partneris:',
    },
    options: [
      { label: { en: 'Expresses love verbally', lv: 'Izsaka mīlestību vārdos' }, value: 'words' },
      { label: { en: 'Supports you through actions', lv: 'Atbalsta ar darbībām' }, value: 'acts' },
      { label: { en: 'Gives meaningful gifts', lv: 'Dāvina nozīmīgas dāvanas' }, value: 'gifts' },
      {
        label: {
          en: 'Spends focused time with you',
          lv: 'Pavada uzmanības pilnu laiku kopā ar jums',
        },
        value: 'quality',
      },
      {
        label: { en: 'Touches you affectionately', lv: 'Pieskaras jums ar mīlestību' },
        value: 'touch',
      },
    ],
  },
  {
    id: 10,
    text: {
      en: 'The way you celebrate achievements is best with:',
      lv: 'Veids, kā svinat sasniegumus, ir vislabākais ar:',
    },
    options: [
      { label: { en: 'Words of recognition', lv: 'Atzinības vārdiem' }, value: 'words' },
      {
        label: {
          en: 'Acts of service to make life easier',
          lv: 'Pakalpojumu darbiem, lai atvieglotu dzīvi',
        },
        value: 'acts',
      },
      {
        label: { en: 'A small reward or gift', lv: 'Nelielu atlīdzību vai dāvanu' },
        value: 'gifts',
      },
      {
        label: { en: 'Time spent together celebrating', lv: 'Laiku kopā, svinot' },
        value: 'quality',
      },
      {
        label: {
          en: 'A congratulatory hug or touch',
          lv: 'Apskāviens vai pieskāriens apsveikuma zīmē',
        },
        value: 'touch',
      },
    ],
  },
  {
    id: 11,
    text: {
      en: 'You feel closest to your partner when they:',
      lv: 'Jūs jūtaties vistuvāk savam partnerim, kad viņi:',
    },
    options: [
      { label: { en: 'Tell you they love you', lv: 'Pasaka, ka jūs mīl' }, value: 'words' },
      {
        label: { en: 'Help with something important', lv: 'Palīdz ar kaut ko svarīgu' },
        value: 'acts',
      },
      {
        label: { en: 'Bring you a thoughtful present', lv: 'Atnes pārdomātu dāvanu' },
        value: 'gifts',
      },
      {
        label: { en: 'Spend meaningful time together', lv: 'Pavada nozīmīgu laiku kopā' },
        value: 'quality',
      },
      { label: { en: 'Hold or cuddle you', lv: 'Tur vai samīļo jūs' }, value: 'touch' },
    ],
  },
  {
    id: 12,
    text: {
      en: 'When you are stressed, you feel comforted by:',
      lv: 'Kad esat stresā, jūs jūtaties mierināts ar:',
    },
    options: [
      { label: { en: 'Encouraging words', lv: 'Iedrošinošiem vārdiem' }, value: 'words' },
      {
        label: { en: 'Practical help or support', lv: 'Praktisku palīdzību vai atbalstu' },
        value: 'acts',
      },
      {
        label: { en: 'Receiving a small gift or token', lv: 'Saņemot mazu dāvanu vai simbolu' },
        value: 'gifts',
      },
      {
        label: { en: 'Undivided attention and presence', lv: 'Nepārtrauktu uzmanību un klātbūtni' },
        value: 'quality',
      },
      {
        label: { en: 'A warm hug or touch', lv: 'Siltu apskāvienu vai pieskārienu' },
        value: 'touch',
      },
    ],
  },
  {
    id: 13,
    text: {
      en: 'You know your partner loves you when they:',
      lv: 'Jūs zināt, ka jūsu partneris jūs mīl, kad viņi:',
    },
    options: [
      {
        label: { en: 'Say loving things regularly', lv: 'Regulāri saka mīļus vārdus' },
        value: 'words',
      },
      {
        label: {
          en: 'Do kind things without being asked',
          lv: 'Dara laipnas lietas bez pieprasījuma',
        },
        value: 'acts',
      },
      {
        label: {
          en: 'Give you gifts that show thoughtfulness',
          lv: 'Dāvina dāvanas, kas rāda pārdomātību',
        },
        value: 'gifts',
      },
      {
        label: {
          en: 'Spend time really listening to you',
          lv: 'Pavada laiku, patiesi klausoties jūs',
        },
        value: 'quality',
      },
      {
        label: { en: 'Touch or hug you often', lv: 'Bieži pieskaras vai apskauj jūs' },
        value: 'touch',
      },
    ],
  },
  {
    id: 14,
    text: {
      en: 'You feel most appreciated when your partner:',
      lv: 'Jūs jūtaties visvairāk novērtēts, kad jūsu partneris:',
    },
    options: [
      { label: { en: 'Compliments your efforts', lv: 'Uzslavē jūsu centienus' }, value: 'words' },
      {
        label: { en: 'Helps make life easier', lv: 'Palīdz padarīt dzīvi vieglāku' },
        value: 'acts',
      },
      {
        label: { en: 'Gives meaningful presents', lv: 'Dāvina nozīmīgas dāvanas' },
        value: 'gifts',
      },
      {
        label: { en: 'Plans special time for you both', lv: 'Plāno īpašu laiku jums abiem' },
        value: 'quality',
      },
      { label: { en: 'Touches or cuddles you', lv: 'Pieskaras vai samīļo jūs' }, value: 'touch' },
    ],
  },
  {
    id: 15,
    text: { en: 'You would rather receive:', lv: 'Jūs labprātāk saņemtu:' },
    options: [
      { label: { en: 'Words of affirmation', lv: 'Apstiprinošus vārdus' }, value: 'words' },
      { label: { en: 'Acts of service', lv: 'Palīdzības darbus' }, value: 'acts' },
      { label: { en: 'A thoughtful gift', lv: 'Pārdomātu dāvanu' }, value: 'gifts' },
      { label: { en: 'Quality time together', lv: 'Kvalitatīvu laiku kopā' }, value: 'quality' },
      { label: { en: 'Physical touch', lv: 'Fizisku pieskārienu' }, value: 'touch' },
    ],
  },
  {
    id: 16,
    text: {
      en: 'Your partner shows love most clearly when they:',
      lv: 'Jūsu partneris vislabāk izrāda mīlestību, kad viņi:',
    },
    options: [
      {
        label: { en: 'Say kind things about you', lv: 'Saka laipnus vārdus par jums' },
        value: 'words',
      },
      { label: { en: 'Do helpful acts', lv: 'Veic palīdzības darbus' }, value: 'acts' },
      { label: { en: 'Give gifts from the heart', lv: 'Dāvina dāvanas no sirds' }, value: 'gifts' },
      {
        label: { en: 'Spend quality time with you', lv: 'Pavada kvalitatīvu laiku ar jums' },
        value: 'quality',
      },
      { label: { en: 'Touch or hug you', lv: 'Pieskaras vai apskauj jūs' }, value: 'touch' },
    ],
  },
  {
    id: 17,
    text: {
      en: 'During hard times, you feel supported when your partner:',
      lv: 'Grūtos brīžos jūs jūtaties atbalstīts, kad jūsu partneris:',
    },
    options: [
      { label: { en: 'Encourages you verbally', lv: 'Iedrošina jūs ar vārdiem' }, value: 'words' },
      { label: { en: 'Takes action to help', lv: 'Veic darbības, lai palīdzētu' }, value: 'acts' },
      { label: { en: 'Gives a gift as a gesture', lv: 'Dāvina dāvanu kā žestu' }, value: 'gifts' },
      {
        label: {
          en: 'Spends time listening and being present',
          lv: 'Pavada laiku, klausoties un būdams klāt',
        },
        value: 'quality',
      },
      {
        label: { en: 'Offers comforting touch', lv: 'Piedāvā mierinošu pieskārienu' },
        value: 'touch',
      },
    ],
  },
  {
    id: 18,
    text: {
      en: 'The most memorable way your partner shows love is:',
      lv: 'Visatmiņā paliekošākais veids, kā jūsu partneris izrāda mīlestību:',
    },
    options: [
      {
        label: { en: 'Through verbal affirmations', lv: 'Ar verbālām apstiprinājumiem' },
        value: 'words',
      },
      { label: { en: 'By helping you practically', lv: 'Praktiski palīdzot jums' }, value: 'acts' },
      {
        label: { en: 'By giving meaningful gifts', lv: 'Dāvājot nozīmīgas dāvanas' },
        value: 'gifts',
      },
      {
        label: { en: 'By spending quality time together', lv: 'Pavadot kvalitatīvu laiku kopā' },
        value: 'quality',
      },
      { label: { en: 'Through physical touch', lv: 'Ar fizisku pieskārienu' }, value: 'touch' },
    ],
  },
  {
    id: 19,
    text: {
      en: 'You feel valued when your partner:',
      lv: 'Jūs jūtaties novērtēts, kad jūsu partneris:',
    },
    options: [
      {
        label: { en: 'Expresses appreciation in words', lv: 'Izsaka pateicību vārdos' },
        value: 'words',
      },
      { label: { en: 'Helps with your tasks', lv: 'Palīdz ar jūsu darbiem' }, value: 'acts' },
      { label: { en: 'Gives thoughtful gifts', lv: 'Dāvina pārdomātas dāvanas' }, value: 'gifts' },
      { label: { en: 'Makes time for you', lv: 'Atvēl jums laiku' }, value: 'quality' },
      { label: { en: 'Touches or hugs you', lv: 'Pieskaras vai apskauj jūs' }, value: 'touch' },
    ],
  },
  {
    id: 20,
    text: {
      en: 'A romantic gesture that moves you most is:',
      lv: 'Romantisks žests, kas jūs visvairāk aizkustina:',
    },
    options: [
      { label: { en: 'Sweet words of love', lv: 'Saldie mīlestības vārdi' }, value: 'words' },
      { label: { en: 'Helpful acts of service', lv: 'Palīdzības darbi' }, value: 'acts' },
      { label: { en: 'Giving a meaningful gift', lv: 'Dāvājot nozīmīgu dāvanu' }, value: 'gifts' },
      {
        label: { en: 'Spending quality time together', lv: 'Pavadot kvalitatīvu laiku kopā' },
        value: 'quality',
      },
      { label: { en: 'A loving touch', lv: 'Mīlošs pieskāriens' }, value: 'touch' },
    ],
  },
  {
    id: 21,
    text: {
      en: 'You feel most connected to your partner when:',
      lv: 'Jūs jūtaties vistuvāk partnerim, kad:',
    },
    options: [
      { label: { en: 'They say something kind', lv: 'Viņi saka kaut ko laipnu' }, value: 'words' },
      {
        label: { en: 'They help you without being asked', lv: 'Viņi palīdz, pat neprasot' },
        value: 'acts',
      },
      {
        label: { en: 'They give a gift with thought', lv: 'Viņi dod pārdomātu dāvanu' },
        value: 'gifts',
      },
      {
        label: {
          en: 'They spend focused time with you',
          lv: 'Viņi pavada kvalitatīvu laiku ar jums',
        },
        value: 'quality',
      },
      {
        label: {
          en: 'They hold or touch you affectionately',
          lv: 'Viņi siltā veidā pieskaras vai apskauj jūs',
        },
        value: 'touch',
      },
    ],
  },
  {
    id: 22,
    text: {
      en: 'When you are feeling down, the best support comes from:',
      lv: 'Kad jūtaties nomākts, vislabākais atbalsts nāk no:',
    },
    options: [
      { label: { en: 'Words of encouragement', lv: 'Uzteicīgi vārdi' }, value: 'words' },
      {
        label: { en: 'Practical help or assistance', lv: 'Praktiska palīdzība vai atbalsts' },
        value: 'acts',
      },
      { label: { en: 'A thoughtful gift', lv: 'Pārdomāta dāvana' }, value: 'gifts' },
      {
        label: {
          en: 'Spending uninterrupted time together',
          lv: 'Kopā pavadīts nepārtraukts laiks',
        },
        value: 'quality',
      },
      { label: { en: 'Physical comfort', lv: 'Fiziska komforta sniegšana' }, value: 'touch' },
    ],
  },
  {
    id: 23,
    text: {
      en: 'You feel love most strongly when your partner:',
      lv: 'Jūs visstiprāk jūtat mīlestību, kad jūsu partneris:',
    },
    options: [
      {
        label: { en: 'Verbalizes their affection', lv: 'Vārdiem izsaka savu mīlestību' },
        value: 'words',
      },
      { label: { en: 'Acts to support you', lv: 'Veic atbalstošus darbus' }, value: 'acts' },
      {
        label: { en: 'Gives you gifts that matter', lv: 'Dāvina nozīmīgas dāvanas' },
        value: 'gifts',
      },
      { label: { en: 'Spends quality time', lv: 'Pavada kvalitatīvu laiku' }, value: 'quality' },
      { label: { en: 'Touches you affectionately', lv: 'Pieskaras jums mīļi' }, value: 'touch' },
    ],
  },
  {
    id: 24,
    text: {
      en: 'Your partner’s actions that mean the most are:',
      lv: 'Jūsu partnera darbības, kas nozīmē visvairāk:',
    },
    options: [
      {
        label: { en: 'Speaking loving words', lv: 'Runāt mīlestības pilnus vārdus' },
        value: 'words',
      },
      { label: { en: 'Performing helpful deeds', lv: 'Veikt noderīgus darbus' }, value: 'acts' },
      { label: { en: 'Gifting meaningful items', lv: 'Dāvināt nozīmīgas lietas' }, value: 'gifts' },
      {
        label: { en: 'Being fully present with you', lv: 'Būt pilnībā klāt ar jums' },
        value: 'quality',
      },
      {
        label: { en: 'Showing affection physically', lv: 'Rādīt mīlestību fiziski' },
        value: 'touch',
      },
    ],
  },
  {
    id: 25,
    text: {
      en: 'You feel love through your partner’s:',
      lv: 'Jūs jūtat mīlestību caur sava partnera:',
    },
    options: [
      {
        label: { en: 'Compliments and encouragement', lv: 'Komplimentiem un uzmundrinājumiem' },
        value: 'words',
      },
      { label: { en: 'Helpful actions', lv: 'Palīdzīgiem darbiem' }, value: 'acts' },
      { label: { en: 'Thoughtful gifts', lv: 'Pārdomātām dāvanām' }, value: 'gifts' },
      { label: { en: 'Time spent together', lv: 'Kopā pavadītam laikam' }, value: 'quality' },
      {
        label: { en: 'Touch and physical closeness', lv: 'Pieskārienu un fiziskai tuvībai' },
        value: 'touch',
      },
    ],
  },
  {
    id: 26,
    text: {
      en: 'The way your partner shows they care most is:',
      lv: 'Veids, kā jūsu partneris visvairāk rāda, ka rūpējas:',
    },
    options: [
      { label: { en: 'With kind words', lv: 'Ar laipniem vārdiem' }, value: 'words' },
      { label: { en: 'By doing helpful acts', lv: 'Veicot noderīgus darbus' }, value: 'acts' },
      { label: { en: 'By giving gifts', lv: 'Dāvinot dāvanas' }, value: 'gifts' },
      {
        label: { en: 'By spending quality time', lv: 'Pavadot kvalitatīvu laiku' },
        value: 'quality',
      },
      { label: { en: 'Through affectionate touch', lv: 'Ar mīļu pieskārienu' }, value: 'touch' },
    ],
  },
  {
    id: 27,
    text: {
      en: 'You feel appreciated when your partner:',
      lv: 'Jūs jūtaties novērtēts, kad jūsu partneris:',
    },
    options: [
      { label: { en: 'Praises you verbally', lv: 'Slavē jūs vārdos' }, value: 'words' },
      {
        label: { en: 'Acts kindly or helpfully', lv: 'Rīkojas laipni vai palīdzīgi' },
        value: 'acts',
      },
      { label: { en: 'Gives thoughtful gifts', lv: 'Dāvina pārdomātas dāvanas' }, value: 'gifts' },
      {
        label: { en: 'Spends meaningful time with you', lv: 'Pavada jēgpilnu laiku kopā ar jums' },
        value: 'quality',
      },
      { label: { en: 'Touches or hugs you', lv: 'Pieskaras vai apskauj jūs' }, value: 'touch' },
    ],
  },
  {
    id: 28,
    text: {
      en: 'Your partner’s love is clearest when they:',
      lv: 'Jūsu partnera mīlestība ir visredzamākā, kad viņi:',
    },
    options: [
      { label: { en: 'Say something affirming', lv: 'Saka kaut ko atbalstošu' }, value: 'words' },
      { label: { en: 'Do something helpful', lv: 'Veic kādu noderīgu darbību' }, value: 'acts' },
      { label: { en: 'Give a meaningful gift', lv: 'Dāvina nozīmīgu dāvanu' }, value: 'gifts' },
      { label: { en: 'Spend quality time', lv: 'Pavada kvalitatīvu laiku' }, value: 'quality' },
      { label: { en: 'Show affectionate touch', lv: 'Rāda mīļu pieskārienu' }, value: 'touch' },
    ],
  },
  {
    id: 29,
    text: {
      en: 'You feel closest to your partner when they:',
      lv: 'Jūs jūtaties vistuvāk partnerim, kad viņi:',
    },
    options: [
      { label: { en: 'Speak words of love', lv: 'Izsaka mīlestības vārdus' }, value: 'words' },
      { label: { en: 'Perform helpful actions', lv: 'Veic noderīgus darbus' }, value: 'acts' },
      { label: { en: 'Give a thoughtful gift', lv: 'Dāvina pārdomātu dāvanu' }, value: 'gifts' },
      {
        label: { en: 'Share uninterrupted time', lv: 'Dalās nepārtraukta laika' },
        value: 'quality',
      },
      { label: { en: 'Offer physical affection', lv: 'Piedāvā fizisku tuvību' }, value: 'touch' },
    ],
  },
  {
    id: 30,
    text: {
      en: 'Overall, you feel most loved when your partner:',
      lv: 'Kopumā jūs jūtaties vismīlētāk, kad jūsu partneris:',
    },
    options: [
      {
        label: { en: 'Says kind and affirming things', lv: 'Saka laipnus un atbalstošus vārdus' },
        value: 'words',
      },
      { label: { en: 'Helps and supports you', lv: 'Palīdz un atbalsta jūs' }, value: 'acts' },
      { label: { en: 'Gives meaningful gifts', lv: 'Dāvina nozīmīgas dāvanas' }, value: 'gifts' },
      {
        label: { en: 'Spends quality time together', lv: 'Pavada kvalitatīvu laiku kopā' },
        value: 'quality',
      },
      {
        label: { en: 'Touches or hugs you affectionately', lv: 'Pieskaras vai apskauj jūs mīļi' },
        value: 'touch',
      },
    ],
  },
];
