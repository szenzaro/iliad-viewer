export interface Word {
    id: string;
    lemma: string;
    data: any; // FIXME: use correct type
}

export interface Verse {
    n: number;
    words: Word[];
}

export interface Chant {
    title: string;
    n: number;
    verses: string[][];
}
