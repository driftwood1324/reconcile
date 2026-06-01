export interface ContritionVersion {
  id: "traditional" | "contemporary" | "brief";
  label: string;
  /** Each string is a stanza/line group, rendered with breathing room. */
  lines: string[];
  /** Short orienting caption shown under the pill toggle. */
  caption: string;
}

export const CONTRITION_VERSIONS: ContritionVersion[] = [
  {
    id: "traditional",
    label: "Traditional",
    caption: "The classic form, in the older devotional English.",
    lines: [
      "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because I dread the loss of heaven and the pains of hell;",
      "but most of all because they offend Thee, my God, Who art all good and deserving of all my love.",
      "I firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life.",
      "Amen.",
    ],
  },
  {
    id: "contemporary",
    label: "Contemporary",
    caption: "The form printed in the current Rite of Penance.",
    lines: [
      "My God, I am sorry for my sins with all my heart.",
      "In choosing to do wrong and failing to do good, I have sinned against You Whom I should love above all things.",
      "I firmly intend, with Your help, to do penance, to sin no more, and to avoid whatever leads me to sin.",
      "Our Savior Jesus Christ suffered and died for us. In His name, my God, have mercy.",
      "Amen.",
    ],
  },
  {
    id: "brief",
    label: "Brief",
    caption: "A short form to commit to memory.",
    lines: [
      "O my God, I am sorry for my sins because I have offended You, Who are infinitely good.",
      "With the help of Your grace, I will sin no more.",
      "Amen.",
    ],
  },
];

/** Explanatory note. Stays squarely inside Catholic teaching on contrition. */
export const CONTRITION_NOTE = {
  heading: "What this prayer is",
  body: [
    "The Act of Contrition puts two things into words: real sorrow for sin, and a firm resolve not to return to it. The Church calls contrition “sorrow of the soul and detestation for the sin committed, together with the resolution not to sin again.”",
    "The exact wording matters less than the sorrow behind it. Any of these forms — or your own honest words — will do, so long as the regret is genuine and you mean to amend your life. What God looks for is a contrite heart, not a perfect recitation.",
    "Pray it as part of the sacrament, and you may also pray it any time you fall, especially when you cannot get to confession soon.",
  ],
};
