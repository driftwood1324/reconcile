export interface Confession {
  id: string;
  /** ISO 8601 timestamp of when the confession was made. */
  date: string;
  /** Optional private note ("what I'm working on", penance, etc.). */
  note?: string;
}

export interface Note {
  id: string;
  /** Free-text body (e.g. sins to bring to the next confession). */
  text: string;
  /** ISO 8601 timestamp of creation. */
  createdAt: string;
}

export type ReminderInterval = "weekly" | "biweekly" | "monthly" | "custom";

export type StateOfLife =
  | "single_man"
  | "married_man"
  | "single_woman"
  | "married_woman"
  | "religious";

export interface Settings {
  reminderInterval: ReminderInterval;
  /** Only meaningful when reminderInterval === "custom". */
  customDays?: number;
  /** Whether local-notification reminders are scheduled (requires permission). */
  remindersEnabled: boolean;
  /** Remembered choice for the "By state of life" examination tab. */
  stateOfLife?: StateOfLife;
}

export const DEFAULT_SETTINGS: Settings = {
  reminderInterval: "monthly",
  remindersEnabled: false,
  stateOfLife: "single_man",
};
