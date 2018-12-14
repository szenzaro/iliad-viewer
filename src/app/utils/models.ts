export interface Word {
    id: string;
    lemma: string;
    data: any; // FIXME: use correct type
}

export interface Verse {
    id: number;
    n: number;
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
