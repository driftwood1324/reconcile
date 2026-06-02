export interface Confession {
  id: string;
  /** ISO 8601 timestamp of when the confession was made. */
  date: string;
  /** Optional private note ("what I'm working on", a resolution, etc.). */
  note?: string;
  /** Optional penance given by the priest, to carry out afterward. */
  penance?: string;
  /** Whether that penance has been completed. */
  penanceDone?: boolean;
}

export interface Note {
  id: string;
  /** Free-text body (e.g. sins to bring to the next confession). */
  text: string;
  /** ISO 8601 timestamp of creation. */
  createdAt: string;
}

export interface FlaggedItem {
  /** Stable key `${examId}:${sectionId}:${index}` identifying the question. */
  key: string;
  /** The question text, stored so the "bring to confession" list is self-contained. */
  text: string;
}

export type ReminderInterval = "weekly" | "biweekly" | "monthly" | "custom";

/** Unit a custom reminder cadence is expressed in. */
export type CustomUnit = "days" | "weeks" | "months";

/** App-wide text scale for readability. */
export type TextSize = "normal" | "large";

/** Interface + content language. */
export type Lang = "en" | "es";

export type StateOfLife =
  | "single_man"
  | "married_man"
  | "single_woman"
  | "married_woman"
  | "religious";

export interface Settings {
  reminderInterval: ReminderInterval;
  /** Count for a custom cadence (paired with customUnit). Only meaningful when
   *  reminderInterval === "custom". */
  customCount?: number;
  customUnit?: CustomUnit;
  /** Whether local-notification reminders are scheduled (requires permission). */
  remindersEnabled: boolean;
  /** Nightly Daily-Examen reminder. */
  examenReminderEnabled: boolean;
  /** Hour of day (0–23, local) for the examen reminder. */
  examenHour: number;
  /** App-wide text scale. */
  textSize: TextSize;
  /** Interface + content language. */
  language: Lang;
  /** Remembered choice for the "By state of life" examination tab. */
  stateOfLife?: StateOfLife;
}

export const DEFAULT_SETTINGS: Settings = {
  reminderInterval: "monthly",
  customCount: 2,
  customUnit: "weeks",
  remindersEnabled: false,
  examenReminderEnabled: false,
  examenHour: 21,
  textSize: "normal",
  language: "en",
  stateOfLife: "single_man",
};
