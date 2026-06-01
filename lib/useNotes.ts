"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Note } from "./types";
import { addNote, deleteNote, getNotes, subscribe } from "./storage";

const EMPTY: Note[] = [];

/** Reactive view of personal notes. */
export function useNotes() {
  const notes = useSyncExternalStore(subscribe, getNotes, () => EMPTY);

  const add = useCallback((text: string) => addNote(text), []);
  const remove = useCallback((id: string) => deleteNote(id), []);

  return { notes, add, remove, count: notes.length };
}
