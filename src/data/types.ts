export interface TarotCard {
  n: string;
  nm: string;
  kw: string[];
  mg: string;
  rv: string;
  cl: string;
  im: string;
  el?: string;
  pr?: string;
  suit?: string;
}

export interface CourseLesson {
  id: string;
  t: string;
}

export interface CourseModule {
  t: string;
  i: string;
  l: CourseLesson[];
}

export interface QuizQuestion {
  q: string;
  o: string[];
  c: number;
}

export interface SpreadDef {
  nm: string;
  n: number;
  p: string[];
}

export interface ChatMessage {
  r: "u" | "a";
  t: string;
}
