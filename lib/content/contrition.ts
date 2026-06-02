import type { Lang } from "@/lib/types";

export interface ContritionVersion {
  id: "traditional" | "contemporary" | "brief";
  label: string;
  /** Each string is a stanza/line group, rendered with breathing room. */
  lines: string[];
  /** Short orienting caption shown under the pill toggle. */
  caption: string;
}

const EN: ContritionVersion[] = [
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

const ES: ContritionVersion[] = [
  {
    id: "traditional",
    label: "Tradicional",
    caption: "La forma clásica, en el español devocional tradicional.",
    lines: [
      "Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío; por ser Tú quien eres, Bondad infinita, y porque te amo sobre todas las cosas, me pesa de todo corazón haberte ofendido;",
      "y propongo firmemente, con ayuda de tu gracia, nunca más pecar, confesarme y cumplir la penitencia que me fuere impuesta.",
      "Amén.",
    ],
  },
  {
    id: "contemporary",
    label: "Contemporáneo",
    caption: "La forma del actual Rito de la Penitencia.",
    lines: [
      "Dios mío, me arrepiento de todo corazón de todos mis pecados y los aborrezco;",
      "porque al pecar he obrado mal y he dejado de hacer el bien, pecando contra Ti, a quien debo amar sobre todas las cosas.",
      "Propongo firmemente, con ayuda de tu gracia, hacer penitencia, no volver a pecar y huir de toda ocasión de pecado.",
      "Nuestro Salvador Jesucristo padeció y murió por nosotros. En su nombre, Dios mío, ten misericordia de mí.",
      "Amén.",
    ],
  },
  {
    id: "brief",
    label: "Breve",
    caption: "Una forma breve para memorizar.",
    lines: [
      "Dios mío, me arrepiento de haberte ofendido, porque eres infinitamente bueno.",
      "Con la ayuda de tu gracia, no volveré a pecar.",
      "Amén.",
    ],
  },
];

export const CONTRITION_VERSIONS: Record<Lang, ContritionVersion[]> = { en: EN, es: ES };

/** Explanatory note. Stays squarely inside Catholic teaching on contrition. */
export const CONTRITION_NOTE: Record<Lang, { heading: string; body: string[] }> = {
  en: {
    heading: "What this prayer is",
    body: [
      "The Act of Contrition puts two things into words: real sorrow for sin, and a firm resolve not to return to it. The Church calls contrition “sorrow of the soul and detestation for the sin committed, together with the resolution not to sin again.”",
      "The exact wording matters less than the sorrow behind it. Any of these forms — or your own honest words — will do, so long as the regret is genuine and you mean to amend your life. What God looks for is a contrite heart, not a perfect recitation.",
      "Pray it as part of the sacrament, and you may also pray it any time you fall, especially when you cannot get to confession soon.",
    ],
  },
  es: {
    heading: "Qué es esta oración",
    body: [
      "El Acto de Contrición pone en palabras dos cosas: el dolor verdadero por el pecado y el propósito firme de no volver a él. La Iglesia llama a la contrición «el dolor del alma y la detestación del pecado cometido, con la resolución de no volver a pecar».",
      "Importa menos la fórmula exacta que el dolor que la sostiene. Cualquiera de estas formas —o tus propias palabras sinceras— basta, con tal de que el arrepentimiento sea genuino y quieras enmendar tu vida. Dios busca un corazón contrito, no una recitación perfecta.",
      "Rézalo como parte del sacramento, y también puedes rezarlo cada vez que caigas, sobre todo cuando no puedas confesarte pronto.",
    ],
  },
};
