export interface Word {
    id?: string;
    text: string;
    data?: any; // FIXME: use correct type
}

export interface Verse {
    id: number;
    n: number | 't' | 'f';
    words: Word[];
}

export type VerseKind = 'o' | 't' | 'v' | 'f';

export type VerseType = ['v', number, string[]];
export type OmisitTypeType = ['o', number];
export type FinType = ['f', string[]];
export type TitleType = ['t', string[]];

export type VerseRowType = VerseType | OmisitTypeType | FinType | TitleType;

export interface Chant {
    title: string;
    n: number;
    verses: VerseRowType[];
}

export interface WordData {
    lemma: string;
    normalized: string;
    tag: string;
}

export type ChantData = WordData[];

export interface Annotation {
    page: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
}
