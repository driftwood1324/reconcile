// The Daily Examen — St. Ignatius' five-movement evening review of the day.
// Calm, classic, and theologically plain; it complements (never replaces) the
// sacramental examination of conscience.

export interface ExamenStep {
  id: string;
  title: string;
  prompt: string;
}

export const EXAMEN_INTRO =
  "A few quiet minutes to look back over your day with God. There is nothing to score — only to notice, give thanks, and begin again.";

export const EXAMEN_STEPS: ExamenStep[] = [
  {
    id: "presence",
    title: "Become aware of God's presence",
    prompt:
      "Pause. God is here, nearer to you than your own breath. Set down the noise of the day and let yourself be seen by the One who loves you.",
  },
  {
    id: "gratitude",
    title: "Give thanks",
    prompt:
      "Walk back over the day and name its gifts — small and large. A kindness, a meal, a moment of beauty, a grace you almost missed. Give thanks for each.",
  },
  {
    id: "review",
    title: "Review the day",
    prompt:
      "Ask the Holy Spirit to go back through the hours with you. Where was God present? Where did love grow — and where did it cool?",
  },
  {
    id: "sorrow",
    title: "Face your shortcomings",
    prompt:
      "Where did you fall short — in thought, word, deed, or the good left undone? Name it honestly, without despair. Ask pardon; God's mercy is wider than any failing.",
  },
  {
    id: "resolve",
    title: "Look toward tomorrow",
    prompt:
      "What one thing will you do differently, with God's help? Commit it to Him, and let the rest go.",
  },
];

export const EXAMEN_CLOSE = {
  heading: "Rest now",
  body: "Close with an Our Father, or simply pray: “Into your hands, Lord, I commend my spirit.” Then rest — tomorrow is grace enough for tomorrow.",
};
