// Gentle, orthodox help for scrupulosity — the persistent, anxious fear of
// having sinned. A confession app has a duty not to feed it; this guide offers
// the Church's settled pastoral counsel, not medical advice.

export const SCRUPLES_INTRO =
  "Scrupulosity is the habit of seeing sin where there is none, or of magnifying small faults into mountains. It is a heavy cross — and it is not the same thing as a tender conscience. If this is your struggle, these are the truths the Church asks you to lean on.";

export interface ScruplePoint {
  heading: string;
  body: string;
}

export const SCRUPLES_POINTS: ScruplePoint[] = [
  {
    heading: "Once it is confessed, it is gone",
    body: "A sin brought to a valid confession is forgiven — completely, permanently. You do not need to confess it again, even if the memory and the dread return. Re-confessing forgiven sins feeds the fear; let them rest in God's mercy.",
  },
  {
    heading: "Doubtful sins are not mortal sins",
    body: "Mortal sin requires three things together: grave matter, full knowledge, and deliberate consent. If you are unsure whether you truly consented, or whether the matter was grave, you may presume you did not sin mortally. Doubt is not guilt.",
  },
  {
    heading: "Obey your confessor",
    body: "Choose one regular confessor or spiritual director and follow his judgment, even when your feelings protest. For the scrupulous, obedience is the surest path to peace — your own anxious reasoning is the one voice not to trust here.",
  },
  {
    heading: "God is not waiting to condemn you",
    body: "He is your Father, not your accuser. His mercy is wider than every failing and far wider than your fear. He sees the love beneath your struggle, and He is pleased with you for trying.",
  },
  {
    heading: "Sometimes it is an illness — and that is no shame",
    body: "Scrupulosity often overlaps with anxiety and OCD. When it does, a good (ideally Catholic) therapist can help as truly as a confessor — and seeking that help is an act of humility, not a lack of faith.",
  },
];

export const SCRUPLES_CLOSE =
  "This is spiritual encouragement, not medical advice. If fear and compulsion are taking over your prayer or your peace, please reach out to a trusted priest and, when needed, a mental-health professional.";
