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

export interface AnnotationPosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface AnnotationData {
    book?: number;
    verse?: number;
    description?: string;
    text?: string;
    type: 'homeric' | 'paraphrase';
    color?: string;
    shape?: string;
}

export interface Annotation {
    position: AnnotationPosition;
    type: 'title' | 'scholie' | 'ref' | 'verse' | 'detail' | 'varia' | 'ornament' | 'philologic';
    page: number;
    data: AnnotationData;
}

