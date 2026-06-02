/**
 * A small, fully-offline liturgical calendar. Everything is computed on-device:
 * Easter drives the moveable feasts; seasons and colors follow from there; a
 * curated sanctoral covers the major fixed feasts and popular memorials. Days
 * without a listed celebration simply fall back to the season.
 *
 * Scope: the Roman Calendar as used in the United States (e.g. Epiphany,
 * Ascension, and Corpus Christi transferred to Sunday). It aims to be useful
 * and correct for the common cases, not a substitute for the official Ordo.
 */

export type Season =
  | "advent"
  | "christmas"
  | "ordinary"
  | "lent"
  | "triduum"
  | "easter";

export type LiturgicalColor = "violet" | "white" | "green" | "red" | "rose";

export interface LiturgicalDay {
  date: Date;
  season: Season;
  seasonLabel: string;
  color: LiturgicalColor;
  /** The day's feast/saint, if notable. */
  celebration: string | null;
  /** "solemnity" | "feast" | "memorial" — for the listed celebration. */
  rank: string | null;
  isFastDay: boolean;
  isAbstinenceDay: boolean;
  /** A short note about the day's penitential character, if any. */
  fastNote: string | null;
}

function ymd(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function sameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
const key = (d: Date) =>
  `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Gregorian Easter (Anonymous/Meeus algorithm). */
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** First Sunday of Advent (the 4th Sunday before Christmas). */
function firstAdvent(year: number): Date {
  const christmas = new Date(year, 11, 25);
  const dow = christmas.getDay();
  const lastSundayBefore = new Date(year, 11, 25 - (dow === 0 ? 7 : dow));
  return addDays(lastSundayBefore, -21);
}

/** Sunday after Jan 6 — Baptism of the Lord (close of Christmas season, US). */
function baptismOfTheLord(year: number): Date {
  const jan6 = new Date(year, 0, 6);
  const dow = jan6.getDay();
  // If Epiphany (Sunday) lands on Jan 7 or 8, Baptism is the following Monday.
  return dow === 0 ? new Date(year, 0, 7) : addDays(jan6, 7 - dow);
}

/** Sunday in the Christmas octave — Holy Family (Dec 30 when Christmas is Sunday). */
function holyFamily(year: number): Date {
  const christmas = new Date(year, 11, 25);
  const dow = christmas.getDay();
  return dow === 0 ? new Date(year, 11, 30) : addDays(christmas, 7 - dow);
}

/** Curated fixed-date sanctoral. Key = "MM-DD". */
const SANCTORAL: Record<string, { name: string; rank: string; color?: LiturgicalColor }> = {
  "01-01": { name: "Mary, Mother of God", rank: "solemnity", color: "white" },
  "01-02": { name: "Sts. Basil & Gregory Nazianzen", rank: "memorial" },
  "01-03": { name: "The Most Holy Name of Jesus", rank: "memorial", color: "white" },
  "01-04": { name: "St. Elizabeth Ann Seton", rank: "memorial" },
  "01-21": { name: "St. Agnes", rank: "memorial", color: "red" },
  "01-24": { name: "St. Francis de Sales", rank: "memorial" },
  "01-25": { name: "Conversion of St. Paul", rank: "feast", color: "white" },
  "01-28": { name: "St. Thomas Aquinas", rank: "memorial" },
  "01-31": { name: "St. John Bosco", rank: "memorial" },
  "02-02": { name: "Presentation of the Lord", rank: "feast", color: "white" },
  "02-03": { name: "St. Blaise", rank: "memorial", color: "red" },
  "02-11": { name: "Our Lady of Lourdes", rank: "memorial", color: "white" },
  "02-14": { name: "Sts. Cyril & Methodius", rank: "memorial" },
  "02-22": { name: "Chair of St. Peter", rank: "feast", color: "white" },
  "03-17": { name: "St. Patrick", rank: "memorial", color: "white" },
  "03-19": { name: "St. Joseph, Spouse of the BVM", rank: "solemnity", color: "white" },
  "03-25": { name: "The Annunciation of the Lord", rank: "solemnity", color: "white" },
  "04-25": { name: "St. Mark, Evangelist", rank: "feast", color: "red" },
  "04-29": { name: "St. Catherine of Siena", rank: "memorial", color: "white" },
  "05-01": { name: "St. Joseph the Worker", rank: "memorial", color: "white" },
  "05-03": { name: "Sts. Philip & James, Apostles", rank: "feast", color: "red" },
  "05-13": { name: "Our Lady of Fatima", rank: "memorial", color: "white" },
  "05-14": { name: "St. Matthias, Apostle", rank: "feast", color: "red" },
  "05-26": { name: "St. Philip Neri", rank: "memorial" },
  "05-31": { name: "The Visitation of the BVM", rank: "feast", color: "white" },
  "06-13": { name: "St. Anthony of Padua", rank: "memorial" },
  "06-24": { name: "Nativity of St. John the Baptist", rank: "solemnity", color: "white" },
  "06-29": { name: "Sts. Peter & Paul, Apostles", rank: "solemnity", color: "red" },
  "07-03": { name: "St. Thomas, Apostle", rank: "feast", color: "red" },
  "07-11": { name: "St. Benedict", rank: "memorial" },
  "07-22": { name: "St. Mary Magdalene", rank: "feast", color: "white" },
  "07-25": { name: "St. James, Apostle", rank: "feast", color: "red" },
  "07-26": { name: "Sts. Joachim & Anne", rank: "memorial" },
  "07-31": { name: "St. Ignatius of Loyola", rank: "memorial" },
  "08-04": { name: "St. John Vianney", rank: "memorial" },
  "08-06": { name: "The Transfiguration of the Lord", rank: "feast", color: "white" },
  "08-08": { name: "St. Dominic", rank: "memorial" },
  "08-10": { name: "St. Lawrence", rank: "feast", color: "red" },
  "08-11": { name: "St. Clare", rank: "memorial" },
  "08-14": { name: "St. Maximilian Kolbe", rank: "memorial", color: "red" },
  "08-15": { name: "The Assumption of the BVM", rank: "solemnity", color: "white" },
  "08-22": { name: "The Queenship of Mary", rank: "memorial", color: "white" },
  "08-24": { name: "St. Bartholomew, Apostle", rank: "feast", color: "red" },
  "08-28": { name: "St. Augustine", rank: "memorial" },
  "09-08": { name: "Nativity of the BVM", rank: "feast", color: "white" },
  "09-14": { name: "The Exaltation of the Holy Cross", rank: "feast", color: "red" },
  "09-15": { name: "Our Lady of Sorrows", rank: "memorial", color: "white" },
  "09-21": { name: "St. Matthew, Evangelist", rank: "feast", color: "red" },
  "09-29": { name: "Sts. Michael, Gabriel & Raphael", rank: "feast", color: "white" },
  "09-30": { name: "St. Jerome", rank: "memorial" },
  "10-01": { name: "St. Thérèse of the Child Jesus", rank: "memorial" },
  "10-02": { name: "The Holy Guardian Angels", rank: "memorial", color: "white" },
  "10-04": { name: "St. Francis of Assisi", rank: "memorial" },
  "10-07": { name: "Our Lady of the Rosary", rank: "memorial", color: "white" },
  "10-15": { name: "St. Teresa of Jesus (Ávila)", rank: "memorial" },
  "10-18": { name: "St. Luke, Evangelist", rank: "feast", color: "red" },
  "10-28": { name: "Sts. Simon & Jude, Apostles", rank: "feast", color: "red" },
  "11-01": { name: "All Saints", rank: "solemnity", color: "white" },
  "11-02": { name: "All Souls", rank: "feast", color: "violet" },
  "11-09": { name: "Dedication of the Lateran Basilica", rank: "feast", color: "white" },
  "11-21": { name: "Presentation of the BVM", rank: "memorial", color: "white" },
  "11-22": { name: "St. Cecilia", rank: "memorial", color: "red" },
  "11-30": { name: "St. Andrew, Apostle", rank: "feast", color: "red" },
  "12-03": { name: "St. Francis Xavier", rank: "memorial" },
  "12-06": { name: "St. Nicholas", rank: "memorial" },
  "12-08": { name: "The Immaculate Conception", rank: "solemnity", color: "white" },
  "12-12": { name: "Our Lady of Guadalupe", rank: "feast", color: "white" },
  "12-13": { name: "St. Lucy", rank: "memorial", color: "red" },
  "12-14": { name: "St. John of the Cross", rank: "memorial" },
  "12-25": { name: "The Nativity of the Lord (Christmas)", rank: "solemnity", color: "white" },
  "12-26": { name: "St. Stephen, First Martyr", rank: "feast", color: "red" },
  "12-27": { name: "St. John, Apostle & Evangelist", rank: "feast", color: "white" },
  "12-28": { name: "The Holy Innocents", rank: "feast", color: "red" },
};

const SEASON_LABEL: Record<Season, string> = {
  advent: "Advent",
  christmas: "Christmastide",
  ordinary: "Ordinary Time",
  lent: "Lent",
  triduum: "Sacred Triduum",
  easter: "Eastertide",
};

const SEASON_COLOR: Record<Season, LiturgicalColor> = {
  advent: "violet",
  christmas: "white",
  ordinary: "green",
  lent: "violet",
  triduum: "red",
  easter: "white",
};

/** The full liturgical reading of a single day. */
export function getLiturgicalDay(input: Date = new Date()): LiturgicalDay {
  const date = ymd(input);
  const year = date.getFullYear();

  const east = easter(year);
  const ashWednesday = addDays(east, -46);
  const palmSunday = addDays(east, -7);
  const holyThursday = addDays(east, -3);
  const goodFriday = addDays(east, -2);
  const pentecost = addDays(east, 49);
  const advent = firstAdvent(year);
  const baptism = baptismOfTheLord(year);
  const christmas = new Date(year, 11, 25);

  // ── Season ────────────────────────────────────────────────────────────────
  let season: Season;
  if (date >= advent && date < christmas) season = "advent";
  else if (date >= christmas || date <= baptism) season = "christmas";
  else if (date >= holyThursday && date <= east) season = "triduum";
  else if (date >= ashWednesday && date < holyThursday) season = "lent";
  else if (date > east && date <= pentecost) season = "easter";
  else season = "ordinary";

  let color = SEASON_COLOR[season];
  // Gaudete / Laetare rose Sundays.
  if (season === "advent" && date.getDay() === 0 && sameDate(date, addDays(advent, 14)))
    color = "rose";
  if (season === "lent" && date.getDay() === 0 && sameDate(date, addDays(ashWednesday, 25)))
    color = "rose";

  // ── Moveable celebrations (take precedence over the sanctoral) ─────────────
  const moveableRaw: { d: Date; name: string; rank: string; color: LiturgicalColor }[] = [
    { d: palmSunday, name: "Palm Sunday of the Passion", rank: "Sunday", color: "red" },
    { d: holyThursday, name: "Holy Thursday", rank: "Triduum", color: "white" },
    { d: goodFriday, name: "Good Friday of the Lord's Passion", rank: "Triduum", color: "red" },
    { d: addDays(east, -1), name: "Holy Saturday", rank: "Triduum", color: "violet" },
    { d: east, name: "Easter Sunday of the Resurrection", rank: "solemnity", color: "white" },
    { d: addDays(east, 7), name: "Divine Mercy Sunday", rank: "Sunday", color: "white" },
    { d: addDays(east, 39), name: "The Ascension of the Lord", rank: "solemnity", color: "white" },
    { d: pentecost, name: "Pentecost Sunday", rank: "solemnity", color: "red" },
    { d: addDays(east, 56), name: "The Most Holy Trinity", rank: "solemnity", color: "white" },
    { d: addDays(east, 63), name: "The Most Holy Body & Blood of Christ", rank: "solemnity", color: "white" },
    { d: addDays(east, 68), name: "The Most Sacred Heart of Jesus", rank: "solemnity", color: "white" },
    { d: ashWednesday, name: "Ash Wednesday", rank: "", color: "violet" },
    { d: baptism, name: "The Baptism of the Lord", rank: "feast", color: "white" },
    { d: holyFamily(year), name: "The Holy Family", rank: "feast", color: "white" },
    { d: addDays(advent, -7), name: "Our Lord Jesus Christ, King of the Universe", rank: "solemnity", color: "white" },
  ];
  const moveable = moveableRaw.map((m) => ({ ...m, d: ymd(m.d) }));

  let celebration: string | null = null;
  let rank: string | null = null;

  const mv = moveable.find((m) => sameDate(m.d, date));
  if (mv) {
    celebration = mv.name;
    rank = mv.rank || null;
    color = mv.color;
  } else {
    const fixed = SANCTORAL[key(date)];
    if (fixed) {
      celebration = fixed.name;
      rank = fixed.rank;
      if (fixed.color) color = fixed.color;
    }
  }

  // ── Fast & abstinence (Latin Church, US norms) ─────────────────────────────
  const isFriday = date.getDay() === 5;
  const inLent = date >= ashWednesday && date <= goodFriday;
  const isAshWednesday = sameDate(date, ashWednesday);
  const isGoodFriday = sameDate(date, goodFriday);

  const isFastDay = isAshWednesday || isGoodFriday;
  const isAbstinenceDay = isAshWednesday || isGoodFriday || (isFriday && inLent);

  let fastNote: string | null = null;
  if (isFastDay) fastNote = "A day of fasting and abstinence from meat.";
  else if (isAbstinenceDay) fastNote = "A Friday of Lent — abstinence from meat.";
  else if (isFriday) fastNote = "A Friday — a traditional day of penance.";

  return {
    date,
    season,
    seasonLabel: SEASON_LABEL[season],
    color,
    celebration,
    rank,
    isFastDay,
    isAbstinenceDay,
    fastNote,
  };
}

/** Hex for a liturgical color, tuned to read on the deep-navy ground. */
export function colorHex(c: LiturgicalColor): string {
  switch (c) {
    case "violet":
      return "#8a6db5";
    case "white":
      return "#e9ecf3";
    case "green":
      return "#5fa978";
    case "red":
      return "#c0504a";
    case "rose":
      return "#d98aa8";
  }
}
