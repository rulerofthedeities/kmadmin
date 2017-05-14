export interface Language {
  code: string;
  name: string;
}

export interface LanPair {
  from: string;
  to: string;
}

export interface TpeList {
  label: string;
  val: string;
}

export interface Filter {
  word: string;
  lanCode: string;
  wordTpe: string;
  isFromStart?: boolean;
  isExact?: boolean;
  returnTotal?: boolean;
}

export interface DetailFilterData {
  word1: string;
  lan1: string;
  word2: string;
  lan2: string;
  tpe: string;
}

export interface FilterList {
  wordpairs: WordPair[];
  filter: Filter;
}

export interface AltWord {
  detailId?: string;
  word: string;
}

interface Word {
  detailId?: string;
  word: string;
  alt?: [AltWord];
  hint?: string;
  info?: string;
}

// Data specific for this language pair!!
export interface WordPair {
  _id: string;
  docTpe: string;
  wordTpe: string;
  lanPair: string[];
  cs?: Word;
  de?: Word;
  fr?: Word;
  gb?: Word;
  nl?: Word;
  us?: Word;
  tags?: string[];
  author?: string;
}

// This is constant for a word, regardless of language pair!!
export interface WordDetail {
  _id: string;
  lan: string;
  word: string;
  docTpe: string;
  wordTpe: string;
  article?: string;
  case?: string;
  followingCase?: string;
  genus?: string;
  plural?: string;
  diminutive?: string;
  comparative?: string;
  superlative?: string;
  aspect?: string;
  aspectPair?: string;
  images?: string[];
  audio?: string[];
  conjugation?: string[];
  wordCount?: number;
  score?: number;
}

/*
export interface WordPairDetail {
  _id?: string; // equals wordpair id
  wordPair: WordPair;
  cs?: WordDetail;
  de?: WordDetail;
  fr?: WordDetail;
  gb?: WordDetail;
  nl?: WordDetail;
  us?: WordDetail;
}
*/

interface Lans {
  de: string;
  en: string;
  fr: string;
  nl: string;
}

export interface LanConfig  {
  tpe: string;
  code: string;
  articles: string[];
  genera: string[];
  name: Lans;
}
