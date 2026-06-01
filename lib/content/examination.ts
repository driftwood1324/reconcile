import type { StateOfLife } from "@/lib/types";

export interface ExamSection {
  id: string;
  title: string;
  /** Optional line under the title — e.g. the commandment text. */
  subtitle?: string;
  questions: string[];
}

export interface Examination {
  id: string;
  label: string;
  intro: string;
  sections: ExamSection[];
}

// ── Quick: four plain categories (universal) ─────────────────────────────────
const QUICK: Examination = {
  id: "quick",
  label: "Quick",
  intro:
    "A short, honest pass when time is tight. Read slowly. Name what is true, not what is comfortable.",
  sections: [
    {
      id: "god",
      title: "Toward God",
      questions: [
        "Have I prayed daily, or have I let God fall to the bottom of the list?",
        "Did I keep the Lord's Day — Mass, and rest from needless work?",
        "Have I treated the faith as optional, hiding it or staying silent when I should have spoken?",
        "Have I put money, work, screens, or my own ego where God belongs?",
        "Did I receive Communion in a state of mortal sin, or skip confession when I knew I needed it?",
      ],
    },
    {
      id: "others",
      title: "Toward others",
      questions: [
        "Was I patient and present with my family, or harsh, distant, and quick to anger?",
        "Did I keep my word and pay what I owed?",
        "Have I gossiped, mocked, or torn down a person's reputation behind their back?",
        "Did I forgive, or am I still nursing a grudge?",
        "Have I been generous with my time and money, or tight-fisted while others went without?",
      ],
    },
    {
      id: "chastity",
      title: "Chastity",
      questions: [
        "Have I used pornography or sought out lust in images, video, or thought?",
        "Did I masturbate, or use another person for my own gratification?",
        "Have I been faithful in body, eyes, and attention to the state of life I'm in?",
        "Did I lead anyone else into sin by what I said, sent, or encouraged?",
        "Have I guarded my eyes and my phone, or fed appetites I know are disordered?",
      ],
    },
    {
      id: "interior",
      title: "Interior life",
      questions: [
        "Am I proud — unable to admit fault, hungry for praise, contemptuous of others?",
        "Have I given in to laziness in my duties, my prayer, or my body?",
        "Did I numb myself with drink, food, or distraction to avoid what I should face?",
        "Have I told the truth about myself, or built a more flattering version for others?",
        "Do I trust God, or am I quietly running my life on fear and control?",
      ],
    },
  ],
};

// ── Traditional: the Ten Commandments (universal) ────────────────────────────
const TRADITIONAL: Examination = {
  id: "traditional",
  label: "Commandments",
  intro:
    "The Ten Commandments, the oldest frame for examining a conscience. Take them one at a time.",
  sections: [
    {
      id: "c1",
      title: "First Commandment",
      subtitle: "I am the Lord your God; you shall have no other gods before me.",
      questions: [
        "Have I given God the first place, or let something else rule me — wealth, success, comfort, another person?",
        "Did I pray, or treat God as someone to call on only in a crisis?",
        "Have I dabbled in superstition, horoscopes, the occult, or new-age practices?",
        "Did I despair of God's mercy, or presume on it as a license to sin?",
        "Have I denied or been ashamed of the faith?",
      ],
    },
    {
      id: "c2",
      title: "Second Commandment",
      subtitle: "You shall not take the name of the Lord your God in vain.",
      questions: [
        "Have I used God's name, or Jesus Christ's, carelessly or in anger?",
        "Did I curse, blaspheme, or speak of holy things with contempt?",
        "Have I broken a vow or a promise made to God?",
      ],
    },
    {
      id: "c3",
      title: "Third Commandment",
      subtitle: "Remember to keep holy the Lord's Day.",
      questions: [
        "Did I miss Mass on Sunday or a holy day through my own fault?",
        "Was I late, distracted, or there in body only?",
        "Did I do needless work and deny myself and my family real rest?",
      ],
    },
    {
      id: "c4",
      title: "Fourth Commandment",
      subtitle: "Honor your father and your mother.",
      questions: [
        "Have I honored and cared for my parents, especially as they age?",
        "Did I lead my own household well, or neglect my duty to those in my care?",
        "Have I obeyed lawful authority where I owe it, and exercised my own authority justly?",
        "Did I provoke those under me to anger by harshness or by my absence?",
      ],
    },
    {
      id: "c5",
      title: "Fifth Commandment",
      subtitle: "You shall not kill.",
      questions: [
        "Have I harmed anyone in body, or wished harm on them?",
        "Did I hold on to anger, hatred, or revenge?",
        "Have I been reckless with my health or another's — through drink, drugs, rage, or the wheel?",
        "Did I cooperate in or support abortion, euthanasia, or the taking of innocent life?",
        "Have I wounded others with cutting, contemptuous words?",
      ],
    },
    {
      id: "c6",
      title: "Sixth Commandment",
      subtitle: "You shall not commit adultery.",
      questions: [
        "Have I been faithful in body and in heart to the state of life I'm in?",
        "Did I use pornography, masturbate, or entertain lustful fantasies?",
        "Have I engaged in sex outside of marriage, or treated the marital act selfishly?",
        "Did I use contraception against the openness marriage owes to life?",
        "Have I guarded my eyes, or fed lust through what I watch and scroll?",
      ],
    },
    {
      id: "c7",
      title: "Seventh Commandment",
      subtitle: "You shall not steal.",
      questions: [
        "Have I taken what is not mine, or kept what I should have returned?",
        "Did I cheat, defraud, or cut corners in my work or my taxes?",
        "Have I paid my debts and given an honest day's labor for my wage?",
        "Am I wasteful or greedy while others are in real need?",
      ],
    },
    {
      id: "c8",
      title: "Eighth Commandment",
      subtitle: "You shall not bear false witness against your neighbor.",
      questions: [
        "Have I lied, or shaded the truth to protect myself?",
        "Did I ruin or chip away at another's good name through gossip or slander?",
        "Have I judged others rashly, or spread what I had no right to share?",
        "Did I fail to make right a lie or an injury to someone's reputation?",
      ],
    },
    {
      id: "c9",
      title: "Ninth Commandment",
      subtitle: "You shall not covet your neighbor's wife.",
      questions: [
        "Have I entertained desire for someone I have no right to?",
        "Did I let my eyes, my screen, or my imagination run unchecked?",
        "Have I worked to keep my heart and attention faithful where they belong?",
      ],
    },
    {
      id: "c10",
      title: "Tenth Commandment",
      subtitle: "You shall not covet your neighbor's goods.",
      questions: [
        "Am I envious of what others have — their money, status, or success?",
        "Did I let greed or discontent drive my decisions?",
        "Have I been grateful for what God has given, or always grasping for more?",
      ],
    },
  ],
};

export const UNIVERSAL_EXAMS: Examination[] = [QUICK, TRADITIONAL];

// ── State-of-life examinations ───────────────────────────────────────────────
export interface StateOfLifeExam extends Examination {
  id: StateOfLife;
}

const SINGLE_MAN: StateOfLifeExam = {
  id: "single_man",
  label: "Single man",
  intro:
    "For the unmarried man — called to chastity, purpose, and the courage to become who God made you to be. Answer plainly.",
  sections: [
    {
      id: "god",
      title: "Toward God",
      questions: [
        "Have I prayed daily, or only when I wanted something?",
        "Did I keep holy the Lord's Day — Mass, and real rest?",
        "Have I been ashamed of the faith, or silent when I should have spoken?",
        "Have I put career, fitness, money, or my own image where God belongs?",
        "Did I receive Communion in mortal sin, or neglect confession when I knew I needed it?",
      ],
    },
    {
      id: "chastity",
      title: "Chastity & purity",
      questions: [
        "Have I used pornography or sought out lust in images, video, or thought?",
        "Did I masturbate, or use a woman — in body or in fantasy — for my own gratification?",
        "Have I treated women as persons to be respected, or as objects to be consumed?",
        "Did I lead a woman into sin, or blur lines I knew I should hold?",
        "Have I guarded my eyes and my phone, or fed appetites I know are disordered?",
      ],
    },
    {
      id: "purpose",
      title: "Purpose & self-mastery",
      questions: [
        "Have I given in to drifting, laziness, or self-pity?",
        "Did I numb myself with drink, screens, gaming, or distraction instead of facing my duties?",
        "Have I taken my vocation seriously — discerning marriage, priesthood, or religious life — or just coasted?",
        "Am I building a life of discipline and virtue, or living for comfort and the next pleasure?",
        "Have I been honest about myself, or hidden behind a flattering image?",
      ],
    },
    {
      id: "others",
      title: "Toward others",
      questions: [
        "Have I honored and helped my parents and family?",
        "Did I keep my word, pay my debts, and deal honestly?",
        "Have I gossiped, mocked, or torn down another man behind his back?",
        "Did I forgive, or am I nursing resentment and envy?",
        "Have I been generous with my time and money, or self-absorbed?",
      ],
    },
    {
      id: "witness",
      title: "Witness in the world",
      questions: [
        "Have I let the faith shape how I work, vote, and treat people, or kept it private and toothless?",
        "Did I stand up for what is right, or stay silent to avoid the cost?",
        "Have I cared for the poor and the weak, or looked past them?",
        "Did I lead other men toward God by my example, or away from Him?",
      ],
    },
  ],
};

const MARRIED_MAN: StateOfLifeExam = {
  id: "married_man",
  label: "Married man",
  intro:
    "An examination for the vocation you actually live. You answer for these men: a husband, a father, a worker, a soul, a body.",
  sections: [
    {
      id: "husband",
      title: "As a husband",
      questions: [
        "Did I love my wife as Christ loves the Church — laying myself down for her, or expecting to be served?",
        "Have I been faithful in body, eyes, and attention?",
        "Did I listen to her, or dismiss and talk over her?",
        "Was I gentle and patient, or did I rule the home by temper and silence?",
        "Have I prayed with her and for her, or left her to carry the faith alone?",
      ],
    },
    {
      id: "father",
      title: "As a father",
      questions: [
        "Did I give my children my time and presence, or only my leftovers?",
        "Have I taught them the faith by word and by my own example?",
        "Was I a steady, just authority — or absent, or harsh, or a pushover?",
        "Did I lose my temper with them, or wound them with my words?",
        "Have I prayed for each of my children by name?",
      ],
    },
    {
      id: "work",
      title: "As a worker & provider",
      questions: [
        "Did I provide for my family through honest, diligent work?",
        "Have I let ambition or the job crowd out my wife and children?",
        "Was I honest in my dealings, or did I cut corners and shade the truth?",
        "Did I treat those under me, and those over me, with justice and respect?",
        "Have I made an idol of money, status, or being needed?",
      ],
    },
    {
      id: "interior",
      title: "Interior life",
      questions: [
        "Did I pray daily, or only when it was convenient?",
        "Am I governed by pride — needing to be right, to be admired, to be in control?",
        "Have I let anger, lust, or self-pity take root in me?",
        "Did I face my faults honestly, or excuse and rename them?",
        "Do I lead my household toward God, or just toward comfort?",
      ],
    },
    {
      id: "body",
      title: "The body & appetites",
      questions: [
        "Have I been temperate with drink, food, and screens, or do they run me?",
        "Did I use my body and strength well, or grow soft through sloth?",
        "Have I guarded chastity in what I watch, scroll, and click?",
        "Did I numb myself — alcohol, distraction, endless scrolling — to avoid duty or pain?",
        "Have I been open with my wife to the gift of life, as the Church teaches, rather than contracepting?",
      ],
    },
  ],
};

const SINGLE_WOMAN: StateOfLifeExam = {
  id: "single_woman",
  label: "Single woman",
  intro:
    "For the unmarried woman — called to chastity, purpose, and trust in God's plan for your life. Answer plainly.",
  sections: [
    {
      id: "god",
      title: "Toward God",
      questions: [
        "Have I prayed daily, or let God fall to the bottom of the list?",
        "Did I keep holy the Lord's Day — Mass, and real rest?",
        "Have I been ashamed of the faith, or silent when I should have spoken?",
        "Have I put relationships, appearance, career, or approval where God belongs?",
        "Did I receive Communion in mortal sin, or neglect confession when I knew I needed it?",
      ],
    },
    {
      id: "chastity",
      title: "Chastity & purity",
      questions: [
        "Have I practiced chastity in my actions, my dress, and my thoughts?",
        "Did I use someone emotionally or physically, or lead a man on for attention?",
        "Have I entertained lustful thoughts, pornography, or impure fantasies?",
        "Did I form attachments that reduce another person to a means to my own ends?",
        "Have I honored my body, and others', as made for love and not for use?",
      ],
    },
    {
      id: "purpose",
      title: "Purpose & vocation",
      questions: [
        "Have I trusted God with my future, or let fear and discontent rule me?",
        "Did I treat a relationship or marriage as the thing that would finally complete me?",
        "Have I grown stagnant — 'waiting' for a spouse or a job before becoming who God calls me to be?",
        "Did I numb myself with social media, shopping, or distraction instead of facing my life?",
        "Have I offered my gifts to others, or kept my time and talents only for myself?",
      ],
    },
    {
      id: "others",
      title: "Toward others",
      questions: [
        "Have I honored and helped my parents and family?",
        "Did I judge others harshly — especially online, or about their relationships?",
        "Have I gossiped, slandered, or torn down another woman out of envy?",
        "Did I rejoice at others' blessings — engagements, children, success — or resent them?",
        "Have I forgiven, or am I holding on to bitterness?",
      ],
    },
    {
      id: "witness",
      title: "Witness in the world",
      questions: [
        "Have I let the faith shape how I work, speak, and treat people?",
        "Did I care for the poor and the vulnerable?",
        "Have I been a witness to Christ, or hidden my faith to fit in?",
        "Did I lead others toward God by my example, or away from Him?",
      ],
    },
  ],
};

const MARRIED_WOMAN: StateOfLifeExam = {
  id: "married_woman",
  label: "Married woman",
  intro:
    "For the married woman — called to love your husband, your children, and God above all. Answer plainly.",
  sections: [
    {
      id: "wife",
      title: "As a wife",
      questions: [
        "Have I loved and respected my husband, or torn him down with my words — to his face or to others?",
        "Was I faithful to him in body, heart, and attention?",
        "Did I nag, manipulate, or withhold to get my way?",
        "Have I supported him and honored his role, or competed and kept score?",
        "Did I pray with him and for him?",
      ],
    },
    {
      id: "mother",
      title: "As a mother",
      questions: [
        "Did I give my children my time and patience, or only my leftovers and frustration?",
        "Have I taught them the faith by word and by my own example?",
        "Was I a steady, loving authority — or harsh, anxious, or permissive?",
        "Did I lose my temper with them, or wound them with my words?",
        "Have I prayed for each of my children by name?",
      ],
    },
    {
      id: "home",
      title: "Home, work & contentment",
      questions: [
        "Have I let comparison or discontent rule me — other families, other homes, other lives?",
        "Did I keep score in the household instead of serving freely?",
        "Was I honest and just in my work and my dealings?",
        "Have I been a good steward of money and time, or wasteful, grasping, or envious?",
        "Did I make space for my husband's and family's needs over my own preferences?",
      ],
    },
    {
      id: "interior",
      title: "Interior life",
      questions: [
        "Did I pray daily, or only when it was convenient?",
        "Am I ruled by pride — needing to be right, admired, in control?",
        "Have I let anger, self-pity, or resentment take root?",
        "Did I face my faults honestly, or excuse and rename them?",
        "Do I trust God with my marriage and family, or run on fear and control?",
      ],
    },
    {
      id: "body",
      title: "Body & appetites",
      questions: [
        "Have I been temperate with food, drink, and screens, or do they run me?",
        "Did I practice chastity in what I watch, read, and scroll?",
        "Have I cared for my body as a gift, neither indulging nor neglecting it?",
        "Did I numb myself with distraction to avoid duty or pain?",
        "Have my husband and I kept our marriage open to life, as the Church teaches, rather than contracepting?",
      ],
    },
  ],
};

const RELIGIOUS: StateOfLifeExam = {
  id: "religious",
  label: "Religious",
  intro:
    "For those in consecrated life — examined against the vows you professed and the life you embraced. Answer plainly.",
  sections: [
    {
      id: "prayer",
      title: "Prayer & union with God",
      questions: [
        "Have I been faithful to my hours of prayer, the Liturgy of the Hours, and the Eucharist?",
        "Did I pray with my whole heart, or go through the motions?",
        "Have I kept my interior life alive, or let it grow cold and routine?",
        "Did I make time for silence and the Lord, or fill every hour with activity?",
      ],
    },
    {
      id: "poverty",
      title: "Poverty",
      questions: [
        "Have I lived my vow of poverty in fact, or quietly accumulated comforts and possessions?",
        "Did I treat the community's goods with care, or waste and presume on them?",
        "Have I been attached to money, devices, or conveniences?",
        "Did I show real solidarity with the poor, or only speak of it?",
      ],
    },
    {
      id: "chastity",
      title: "Chastity",
      questions: [
        "Have I kept my vow of chastity in body, heart, eyes, and thought?",
        "Did I guard against pornography, impurity, and disordered attachments?",
        "Have I formed possessive or particular friendships that compromise my consecration?",
        "Did I give my whole heart to Christ, or hold parts of it back?",
      ],
    },
    {
      id: "obedience",
      title: "Obedience",
      questions: [
        "Have I obeyed my superiors and my rule in a spirit of faith, or grumbled and resisted?",
        "Did I follow my own will under the appearance of zeal?",
        "Have I been proud, stubborn, or contemptuous of authority?",
        "Did I accept the duties and assignments given me, even when they were hard?",
      ],
    },
    {
      id: "community",
      title: "Community & charity",
      questions: [
        "Have I loved those in my community, or been cold, critical, or divisive?",
        "Did I gossip, hold grudges, or sow discord?",
        "Have I borne with others' faults patiently and forgiven readily?",
        "Did I do my share of the common work, or shirk it onto others?",
      ],
    },
    {
      id: "mission",
      title: "Mission & witness",
      questions: [
        "Have I served those entrusted to me with zeal, or with laziness and routine?",
        "Did I give scandal, or witness to Christ by my life?",
        "Have I been a witness of joy and hope, or of complaint and bitterness?",
        "Did I keep the salvation of souls and the glory of God as my purpose?",
      ],
    },
  ],
};

export const STATE_OF_LIFE_EXAMS: StateOfLifeExam[] = [
  SINGLE_MAN,
  MARRIED_MAN,
  SINGLE_WOMAN,
  MARRIED_WOMAN,
  RELIGIOUS,
];

export const STATE_OF_LIFE_OPTIONS: { id: StateOfLife; label: string }[] =
  STATE_OF_LIFE_EXAMS.map((e) => ({ id: e.id, label: e.label }));

export function getStateOfLifeExam(id: StateOfLife): StateOfLifeExam {
  return STATE_OF_LIFE_EXAMS.find((e) => e.id === id) ?? SINGLE_MAN;
}
