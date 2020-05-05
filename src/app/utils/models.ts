export interface Word {
    id: string;
    text: string;
    verse: number;
    chant: number;
    source: string;
    data?: WordData;
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
    id: string;
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

export type AnnotationType = 'title' | 'scholie' | 'ref' | 'verse' | 'varia' | 'ornament' ;

export interface Annotation {
    position: AnnotationPosition;
    type: AnnotationType;
    page: number;
    data: AnnotationData;
}

export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export function satisfies(a: Annotation, f: RecursivePartial<Annotation>): boolean {
    const firstLevel = Object.keys(f).filter((x) => x !== 'data').every((k) => a[k] === f[k]);
    const dataLevel = Object.keys(f.data || {}).every((k) => !!a.data && a.data[k] === f.data[k]);
    return firstLevel && dataLevel;
}
