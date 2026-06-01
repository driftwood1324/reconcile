/**
 * Prayer texts and devotional guides for the Resources section.
 * Standard, widely-used English forms. Where translations differ, the common
 * contemporary (ICEL) wording is used.
 */

export interface Prayer {
  id: string;
  title: string;
  /** Each entry is a stanza/line group, rendered with breathing room. */
  lines: string[];
}

// ── Common prayers ───────────────────────────────────────────────────────────
export const COMMON_PRAYERS: Prayer[] = [
  {
    id: "sign-of-the-cross",
    title: "Sign of the Cross",
    lines: [
      "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
    ],
  },
  {
    id: "our-father",
    title: "Our Father",
    lines: [
      "Our Father, Who art in heaven, hallowed be Thy name; Thy kingdom come, Thy will be done on earth as it is in heaven.",
      "Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
    ],
  },
  {
    id: "hail-mary",
    title: "Hail Mary",
    lines: [
      "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus.",
      "Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
    ],
  },
  {
    id: "glory-be",
    title: "Glory Be",
    lines: [
      "Glory be to the Father, and to the Son, and to the Holy Spirit:",
      "as it was in the beginning, is now, and ever shall be, world without end. Amen.",
    ],
  },
  {
    id: "apostles-creed",
    title: "Apostles' Creed",
    lines: [
      "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord,",
      "Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead;",
      "He ascended into heaven, and is seated at the right hand of God the Father almighty; from there He will come to judge the living and the dead.",
      "I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
    ],
  },
  {
    id: "hail-holy-queen",
    title: "Hail, Holy Queen",
    lines: [
      "Hail, holy Queen, Mother of Mercy, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve.",
      "To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus.",
      "O clement, O loving, O sweet Virgin Mary. Pray for us, O holy Mother of God, that we may be made worthy of the promises of Christ. Amen.",
    ],
  },
  {
    id: "memorare",
    title: "The Memorare",
    lines: [
      "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided.",
      "Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
    ],
  },
  {
    id: "st-michael",
    title: "Prayer to St. Michael",
    lines: [
      "St. Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil.",
      "May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, by the power of God, cast into hell Satan and all the evil spirits who prowl about the world seeking the ruin of souls. Amen.",
    ],
  },
  {
    id: "guardian-angel",
    title: "Guardian Angel Prayer",
    lines: [
      "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.",
    ],
  },
];

// ── The Holy Rosary ──────────────────────────────────────────────────────────
export interface RosaryMysterySet {
  id: string;
  name: string;
  days: string;
  mysteries: string[];
}

export const ROSARY_MYSTERIES: RosaryMysterySet[] = [
  {
    id: "joyful",
    name: "The Joyful Mysteries",
    days: "Monday & Saturday",
    mysteries: [
      "The Annunciation",
      "The Visitation",
      "The Nativity",
      "The Presentation in the Temple",
      "The Finding of the Child Jesus in the Temple",
    ],
  },
  {
    id: "sorrowful",
    name: "The Sorrowful Mysteries",
    days: "Tuesday & Friday",
    mysteries: [
      "The Agony in the Garden",
      "The Scourging at the Pillar",
      "The Crowning with Thorns",
      "The Carrying of the Cross",
      "The Crucifixion and Death of Our Lord",
    ],
  },
  {
    id: "glorious",
    name: "The Glorious Mysteries",
    days: "Wednesday & Sunday",
    mysteries: [
      "The Resurrection",
      "The Ascension",
      "The Descent of the Holy Spirit",
      "The Assumption of Mary",
      "The Coronation of Mary as Queen of Heaven and Earth",
    ],
  },
  {
    id: "luminous",
    name: "The Luminous Mysteries",
    days: "Thursday",
    mysteries: [
      "The Baptism of the Lord in the Jordan",
      "The Wedding at Cana",
      "The Proclamation of the Kingdom of God",
      "The Transfiguration",
      "The Institution of the Eucharist",
    ],
  },
];

export const ROSARY_STEPS: string[] = [
  "On the crucifix, make the Sign of the Cross and pray the Apostles' Creed.",
  "On the first bead, pray the Our Father.",
  "On the next three beads, pray a Hail Mary on each (for faith, hope, and charity).",
  "Pray the Glory Be, then announce the first Mystery.",
  "On the large bead, pray the Our Father.",
  "On each of the ten beads, pray a Hail Mary while meditating on the Mystery.",
  "Pray the Glory Be, then the Fatima Prayer.",
  "Announce the next Mystery and repeat for all five decades.",
  "Conclude with the Hail, Holy Queen and the Sign of the Cross.",
];

export const FATIMA_PRAYER: Prayer = {
  id: "fatima",
  title: "The Fatima Prayer",
  lines: [
    "O my Jesus, forgive us our sins, save us from the fires of hell; lead all souls to Heaven, especially those who have most need of Thy mercy. Amen.",
  ],
};

// ── The Chaplet of Divine Mercy ──────────────────────────────────────────────
export const DIVINE_MERCY_STEPS: { label: string; text: string }[] = [
  {
    label: "Begin",
    text: "Make the Sign of the Cross, then pray one Our Father, one Hail Mary, and the Apostles' Creed.",
  },
  {
    label: "On each Our Father bead",
    text: "Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.",
  },
  {
    label: "On each of the ten Hail Mary beads",
    text: "For the sake of His sorrowful Passion, have mercy on us and on the whole world.",
  },
  {
    label: "Repeat",
    text: "Pray the two prayers above for all five decades, on the Our Father bead and the ten beads of each decade.",
  },
  {
    label: "To conclude (three times)",
    text: "Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.",
  },
];

export const DIVINE_MERCY_INTRO =
  "The Chaplet of Divine Mercy is prayed on ordinary Rosary beads, given by Our Lord to St. Faustina. It is a plea for mercy — on ourselves and on the whole world.";

export const ROSARY_INTRO =
  "The Rosary draws us through the life of Christ with His Mother. Pray one set of Mysteries, meditating on each as you go. Five decades in all.";
