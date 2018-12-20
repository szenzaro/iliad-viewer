export interface Map<T> {
    [key: string]: T;
}

export function arrayToMap<T, K extends keyof T>(arr: T[], key: K): Map<T> {
    const map: Map<T> = {};
    arr.forEach((x) => map[x[`${key}`]] = x);
    return map;
}

export function uuid(prefix?: string): string {
    return !!prefix ? `${prefix}-${Math.random()}` : `${Math.random()}`;
}

function inflectionalTagToDescription(tag: string): string {
    let description = '';

    tag.split('').forEach((c) => {
        switch (c) {
            case '1': description += ' First Person'; break;
            case '2': description += ' Second Person'; break;
            case '3': description += ' Third Person'; break;
            case 'A': description += ' Accusative'; break;
            case 'B': description += ' Passive'; break;
            case 'C': description += ' Gerundive'; break;
            case 'D': description += ' Dative'; break;
            case 'd': description += ' Dual'; break;
            case 'E': description += ' Active'; break;
            case 'f': description += ' Feeminine'; break;
            case 'F': description += ' Future'; break;
            case 'G': description += ' Genitive'; break;
            case 'I': description += ' Imperfect'; break;
            case 'Î': description += ' Indicative'; break;
            case 'J': description += ' Aorist'; break;
            case 'K': description += ' Participle'; break;
            case 'L': description += ' Future Perfect'; break;
            case 'm': description += ' Masculine'; break;
            case 'M': description += ' Middle'; break;
            case 'n': description += ' Neutral'; break;
            case 'N': description += ' Nominative'; break;
            case 'O': description += ' Optative'; break;
            case 'p': description += ' Plural'; break;
            case 'P': description += ' Present'; break;
            case 'Q': description += ' Pluperfect'; break;
            case 'R': description += ' Perfect'; break;
            case 's': description += ' Singular'; break;
            case 'S': description += ' Subjunctive'; break;
            case 'V': description += ' Vocative'; break;
            case 'W': description += ' Infinitive'; break;
            case 'Y': description += ' Imperative'; break;
            default: description += `(ERROR Inflect:: ${tag})`;
        }
    });

    return description;
}

function morphologicalTagToDescription(tag: string): string {
    let description = '';

    switch (tag) {
        case '': break;
        case 'A': description += ' Adjective'; break;
        case 'AMORPH': description += ' Element of Morphological Analysis'; break;
        case 'DET': description += ' Article'; break;
        case 'ETYM': description += ' Etymon'; break;
        case 'I+Adv': description += ' Adverb'; break;
        case 'I+AdvPr': description += ' Prepositional Adverb'; break;
        case 'I+Conj': description += ' Conjunction'; break;
        case 'I+Intj': description += ' Interjection'; break;
        case 'I+Neg': description += ' Negation'; break;
        case 'I+Part': description += ' Particle'; break;
        case 'I+Prep': description += ' Preposition'; break;
        // tslint:disable-next-line:max-line-length
        case 'LF': description += ' If it is impossible to analyse a form, this form itself is chosen as lemma, called a lemma-form2'; break;
        case 'N+Ant': description += ' Anthroponymic Name'; break;
        case 'N+Com': description += ' Common Name'; break;
        case 'N+Epi': description += ' Epiclesis (Nickname)'; break;
        case 'N+Lettre': description += ' Name of a letter'; break;
        case 'N+Pat': description += ' Patronymic Name'; break;
        case 'N+Prop': description += ' Proper Noun'; break;
        case 'N+Top': description += ' Toponym (Place Name)'; break;
        case 'NUM+Car': description += ' Cardinal Number (word)'; break;
        case 'NUM+Ord': description += ' Ordinal Number (word)'; break;
        case 'NUMA+Car': description += ' Cardinal Number (alphanumeric system)'; break;
        case 'NUMA+Ord': description += ' Ordinal Number (alphanumeric system)'; break;
        case 'PRO+Dem': description += ' Demonstrative Pronoun'; break;
        case 'PRO+Ind': description += ' Indefinite Pronoun'; break;
        case 'PRO+Int': description += ' Interrogative Pronoun'; break;
        case 'PRO+Per': description += ' Personal Pronoun'; break;
        case 'PRO+Per1p': description += ' Personal Pronoun 1st Person Plural'; break;
        case 'PRO+Per1s': description += ' Personal Pronoun 1st Person Singular'; break;
        case 'PRO+Per2p': description += ' Personal Pronoun 2nd Person Plural'; break;
        case 'PRO+Per2s': description += ' Personal Pronoun 2nd Person Singular'; break;
        case 'PRO+Per3p': description += ' Personal Pronoun 3rd Person Plural'; break;
        case 'PRO+Per3s': description += ' Personal Pronoun 3rd Person Singular'; break;
        case 'PRO+Pos1p': description += ' Possessive Pronoun 1st Person Singular'; break;
        case 'PRO+Pos1s': description += ' Possessive Pronoun 1st Person Singular'; break;
        case 'PRO+Pos2p': description += ' Possessive Pronoun 2nd Person Plural'; break;
        case 'PRO+Pos2s': description += ' Possessive Pronoun 2nd Person Singular'; break;
        case 'PRO+Pos3p': description += ' Possessive Pronoun 3rd Person Plural'; break;
        case 'PRO+Pos3s': description += ' Possessive Pronoun 3 rd Person Singular'; break;
        case 'PRO+Rec': description += ' Reciprocal Pronoun'; break;
        case 'PRO+Ref1s': description += ' Reflexive Pronoun 1st Person Singular'; break;
        case 'PRO+Ref2s': description += ' Reflexive pronoun 2nd person singular'; break;
        case 'PRO+Ref3s': description += ' Reflexive pronoun 3rd person singular'; break;
        case 'PRO+Rel': description += ' Relative Pronoun'; break;
        case 'V': description += ' Verb'; break;
        case 'Z': description += ' (not yet tagged lemma)'; break;
        default: description += `(ERROR morph:: ${tag})`;
    }
    return description;
}

export function tagToDescription(tag: string): string {
    const crasis = tag.split('@');
    if (crasis.length > 1) {
        return crasis.map((v) => tagToDescription(v))
            .reduce((x, y) => x + y, '');
    }
    const parts = tag.split(':');
    let description = '';
    if (parts.length > 0) {
        description += morphologicalTagToDescription(parts[0]);
    }
    if (parts.length > 1) {
        description += inflectionalTagToDescription(parts[1]);
    }
    return description;
}

export function numberToOption(n) {
    return { id: `${n}`, label: `${n}` };
}

export function numberToOptions(n: number) {
    return new Array(n).fill(undefined).map((_, i) => numberToOption(i + 1));
}
