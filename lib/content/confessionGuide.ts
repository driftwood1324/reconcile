// A calm, accurate walkthrough of the Sacrament of Penance in the Roman Rite,
// written especially for someone returning after a long time. Stays inside
// Catholic teaching; avoids anything that would feed fear or scrupulosity.

export interface GuideStep {
  text: string;
  /** Words the penitent actually says, surfaced as a quote. */
  say?: string;
}

export interface GuidePhase {
  id: string;
  title: string;
  steps: GuideStep[];
}

export const CONFESSION_GUIDE_INTRO =
  "Confession is simpler than memory makes it. The priest is there as an instrument of God's mercy, bound by an absolute seal he can never break. You cannot shock him. Here is the whole of it, step by step.";

export const CONFESSION_PHASES: GuidePhase[] = [
  {
    id: "before",
    title: "Before you go",
    steps: [
      {
        text: "Examine your conscience. Use the Examination tab and tap whatever applies — it gathers a private list you can bring with you.",
      },
      {
        text: "Be sorry for your sins, and resolve — with God's help — to turn from them. This sorrow, not a perfect memory, is what matters most.",
      },
      {
        text: "Set down any fear. If it has been years, that is exactly what the sacrament is for. You can simply tell the priest it has been a long time, and he will lead you through.",
      },
    ],
  },
  {
    id: "during",
    title: "In the confessional",
    steps: [
      {
        text: "Go in. You may kneel behind a screen or sit face-to-face — either is yours to choose. Make the Sign of the Cross with the priest.",
      },
      {
        text: "Open with how long it has been. An estimate is fine.",
        say: "Bless me, Father, for I have sinned. It has been [a week / two years / a long time] since my last confession.",
      },
      {
        text: "Confess your sins simply and honestly. Name them in kind; for grave sins, include roughly how often. You need no elaborate detail — only the truth. If you're unsure whether something is a sin, you may just ask him.",
      },
      {
        text: "When you have finished, let him know.",
        say: "I am sorry for these and all my sins.",
      },
      {
        text: "Listen. The priest may offer a few words of counsel, then give you a penance — a prayer or an action to carry out afterward.",
      },
      {
        text: "Pray an Act of Contrition. He may prompt you; any honest form will do. (See the Contrition tab.)",
      },
      {
        text: "Receive absolution. As the priest extends his hands and speaks the words that free you from sin, respond at the end:",
        say: "Amen.",
      },
      {
        text: "He gives thanks and sends you out. Often he will say, “Give thanks to the Lord, for he is good.”",
        say: "His mercy endures for ever.",
      },
    ],
  },
  {
    id: "after",
    title: "Afterward",
    steps: [
      {
        text: "Carry out your penance as soon as you reasonably can — that day if possible.",
      },
      {
        text: "Give thanks. You have been forgiven; the slate is truly clean. Sit a moment in that mercy before you hurry on.",
      },
      {
        text: "Record it here if you like, and begin again. Returning often is how the habit takes root.",
      },
    ],
  },
];

export const CONFESSION_GUIDE_RETURNING = {
  heading: "If it has been a long time",
  body: [
    "Don't let shame keep you outside the door — shame is the very thing confession undoes. Priests hear everything; nothing you bring will surprise him, and he wants you there.",
    "If you forget what to do, say so. “Father, it's been years and I'm not sure how this goes” is a perfectly good way to begin. He will walk with you through every step.",
  ],
};
