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
  wordTpe?: string;
  isFromStart?: boolean;
  isExact?: boolean;
  returnTotal?: boolean;
}

export interface FilterFiles {
  app: string;
  tpe: string;
  word: string;
  lanCode?: string;
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
  wordpairs?: WordPair[];
  worddetails?: WordDetail[];
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
  lanPair: string[];
  cs?: Word;
  de?: Word;
  fr?: Word;
  en?: Word;
  nl?: Word;
  tags?: string[];
  author?: string;
}

export interface File {
  s3: string;
  local: string;
}

// This is constant for a word, regardless of language pair!!
export interface WordDetail {
  _id: string;
  lan: string;
  word: string;
  docTpe: string;
  wordTpe: string;
  region?: string;
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
  images?: File[];
  audios?: File[];
  conjugation?: string[];
  isDiminutive?: boolean;
  isPlural?: boolean;
  isComparative?: boolean;
  isSuperlative?: boolean;
  wordCount?: number;
  score?: number;
}

interface Lans {
  de: string;
  en: string;
  fr: string;
  nl: string;
}

export interface Case {
  value: string;
  code: string;
}

export interface LanConfig  {
  tpe: string;
  code: string;
  articles?: string[];
  genera?: string[];
  aspects?: string[];
  cases?: Case[];
  name: Lans;
  regions?: string[];
}

export interface CloudFile {
  _id?: string;
  ETag?: string;
  Location: string;
}

export interface LocalFile {
  _id?: string;
  app: string;
  tpe: string;
  cloudFile: string;
  localFile: string;
  ETag: string;
  name: string;
  size: number;
  format: string;
  lan?: string;
  dtAdded?: Date;
}
