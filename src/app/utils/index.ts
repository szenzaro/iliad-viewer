import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';

export interface Map<T> {
    [key: string]: T;
}

export function arrayToMap<T, K extends keyof T>(arr: T[], key: K): Map<T> {
    const map: Map<T> = {};
    arr.forEach((x) => map[x[`${key}`]] = x);
    return map;
}

export function groupBy<T, K extends keyof T>(arr: T[], key: K): Map<T[]> {
    const map: Map<T[]> = {};
    arr.forEach((x) => {
        if (x !== undefined) {
            if (!map[x[`${key}`]]) {
                map[x[`${key}`]] = [];
            }
            map[x[`${key}`]].push(x);
        }
    });
    return map;
}

export function uuid(prefix?: string): string {
    return !!prefix ? `${prefix}-${Math.random()}` : `${Math.random()}`;
}

function inflectionalTagToDescription(tag: string): string {
    let description = '';

    tag.split('').forEach((c) => {
        switch (c) {
            case '1': description += _T(' First Person'); break;
            case '2': description += _T(' Second Person'); break;
            case '3': description += _T(' Third Person'); break;
            case 'A': description += _T(' Accusative'); break;
            case 'B': description += _T(' Passive'); break;
            case 'C': description += _T(' Gerundive'); break;
            case 'D': description += _T(' Dative'); break;
            case 'd': description += _T(' Dual'); break;
            case 'E': description += _T(' Active'); break;
            case 'f': description += _T(' Feminine'); break;
            case 'F': description += _T(' Future'); break;
            case 'G': description += _T(' Genitive'); break;
            case 'I': description += _T(' Imperfect'); break;
            case 'Î': description += _T(' Indicative'); break;
            case 'J': description += _T(' Aorist'); break;
            case 'K': description += _T(' Participle'); break;
            case 'L': description += _T(' Future Perfect'); break;
            case 'm': description += _T(' Masculine'); break;
            case 'M': description += _T(' Middle'); break;
            case 'n': description += _T(' Neutral'); break;
            case 'N': description += _T(' Nominative'); break;
            case 'O': description += _T(' Optative'); break;
            case 'p': description += _T(' Plural'); break;
            case 'P': description += _T(' Present'); break;
            case 'Q': description += _T(' Pluperfect'); break;
            case 'R': description += _T(' Perfect'); break;
            case 's': description += _T(' Singular'); break;
            case 'S': description += _T(' Subjunctive'); break;
            case 'V': description += _T(' Vocative'); break;
            case 'W': description += _T(' Infinitive'); break;
            case 'Y': description += _T(' Imperative'); break;
            default: description += `(ERROR Inflect:: ${tag})`;
        }
    });

    return description;
}

function morphologicalTagToDescription(tag: string, ): string {
    let description = '';

    switch (tag) {
        case '': break;
        case 'A': description += _T(' Adjective'); break;
        case 'AMORPH': description += _T(' Element of Morphological Analysis'); break;
        case 'DET': description += _T(' Article'); break;
        case 'ETYM': description += _T(' Etymon'); break;
        case 'I+Adv': description += _T(' Adverb'); break;
        case 'I+AdvPr': description += _T(' Prepositional Adverb'); break;
        case 'I+Conj': description += _T(' Conjunction'); break;
        case 'I+Intj': description += _T(' Interjection'); break;
        case 'I+Neg': description += _T(' Negation'); break;
        case 'I+Part': description += _T(' Particle'); break;
        case 'I+Prep': description += _T(' Preposition'); break;
        // tslint:disable-next-line:max-line-length
        case 'LF': description += _T(' If it is impossible to analyse a form, this form itself is chosen as lemma, called a lemma-form2'); break;
        case 'N+Ant': description += _T(' Anthroponymic Name'); break;
        case 'N+Com': description += _T(' Common Name'); break;
        case 'N+Epi': description += _T(' Epiclesis (Nickname)'); break;
        case 'N+Lettre': description += _T(' Name of a letter'); break;
        case 'N+Pat': description += _T(' Patronymic Name'); break;
        case 'N+Prop': description += _T(' Proper Noun'); break;
        case 'N+Top': description += _T(' Toponym (Place Name)'); break;
        case 'NUM+Car': description += _T(' Cardinal Number (word)'); break;
        case 'NUM+Ord': description += _T(' Ordinal Number (word)'); break;
        case 'NUMA+Car': description += _T(' Cardinal Number (alphanumeric system)'); break;
        case 'NUMA+Ord': description += _T(' Ordinal Number (alphanumeric system)'); break;
        case 'PRO+Dem': description += _T(' Demonstrative Pronoun'); break;
        case 'PRO+Ind': description += _T(' Indefinite Pronoun'); break;
        case 'PRO+Int': description += _T(' Interrogative Pronoun'); break;
        case 'PRO+Per': description += _T(' Personal Pronoun'); break;
        case 'PRO+Per1p': description += _T(' Personal Pronoun 1st Person Plural'); break;
        case 'PRO+Per1s': description += _T(' Personal Pronoun 1st Person Singular'); break;
        case 'PRO+Per2p': description += _T(' Personal Pronoun 2nd Person Plural'); break;
        case 'PRO+Per2s': description += _T(' Personal Pronoun 2nd Person Singular'); break;
        case 'PRO+Per3p': description += _T(' Personal Pronoun 3rd Person Plural'); break;
        case 'PRO+Per3s': description += _T(' Personal Pronoun 3rd Person Singular'); break;
        case 'PRO+Pos1p': description += _T(' Possessive Pronoun 1st Person Singular'); break;
        case 'PRO+Pos1s': description += _T(' Possessive Pronoun 1st Person Singular'); break;
        case 'PRO+Pos2p': description += _T(' Possessive Pronoun 2nd Person Plural'); break;
        case 'PRO+Pos2s': description += _T(' Possessive Pronoun 2nd Person Singular'); break;
        case 'PRO+Pos3p': description += _T(' Possessive Pronoun 3rd Person Plural'); break;
        case 'PRO+Pos3s': description += _T(' Possessive Pronoun 3 rd Person Singular'); break;
        case 'PRO+Rec': description += _T(' Reciprocal Pronoun'); break;
        case 'PRO+Ref1s': description += _T(' Reflexive Pronoun 1st Person Singular'); break;
        case 'PRO+Ref2s': description += _T(' Reflexive pronoun 2nd person singular'); break;
        case 'PRO+Ref3s': description += _T(' Reflexive pronoun 3rd person singular'); break;
        case 'PRO+Rel': description += _T(' Relative Pronoun'); break;
        case 'V': description += _T(' Verb'); break;
        case 'Z': description += _T(' (not yet tagged lemma)'); break;
        default: description += `(ERROR morph:: ${tag})`;
    }
    return description;
}

export function tagToDescription(tag: string): string {
    return checkTag(
        tag,
        (crasis: string[]) => crasis.map((v) => tagToDescription(v)).reduce((x, y) => x + y, ''),
        (parts: string[]) => {
            let description = '';
            if (parts.length > 0) {
                description += morphologicalTagToDescription(parts[0]);
            }
            if (parts.length > 1) {
                description += inflectionalTagToDescription(parts[1]);
            }
            return description;
        },
        '',
    );
}

export function numberToOption(n) {
    return { id: `${n}`, label: `${n}` };
}

export function numberToOptions(n: number) {
    return new Array(n).fill(undefined).map((_, i) => numberToOption(i + 1));
}

export type POS_OP = 'or' | 'and';
export type POS = 'Adjective' | 'Article' | 'Etymon' | 'Adverb' | 'Name' | 'Verb' | 'Pronoun' | 'Num' | 'Conj' | 'Neg' | 'Intj'
    | 'Particle'
    | 'Preposition'
    | 'Masculine' | 'Feminine' | 'Neutral'
    | 'Singular' | 'Plural' | 'Dual'
    | 'Anthroponymic' | 'Toponym' | 'Patronymic'
    | 'Present' | 'Imperfect' | 'Future' | 'Aorist' | 'Perfect' | 'Pluperfect' | 'FuturePerfect'
    | 'Indicative' | 'Subjunctive' | 'Imperative' | 'Optative' | 'Infinitive' | 'Participle'
    | '1st' | '2nd' | '3rd'
    | 'Active' | 'Middle' | 'Passive'
    | 'Nominative' | 'Vocative' | 'Accusative' | 'Genitive' | 'Dative';

export interface PosFilter {
    op: POS_OP;
    pos: POS[];
}

export function isAdjective(tag: string): boolean {
    return !!tag && tag.startsWith('A');
}
export function isArticle(tag: string): boolean {
    return !!tag && tag.startsWith('DET');
}
export function isAdverb(tag: string): boolean {
    return !!tag && tag.startsWith('I+Adv');
}
export function isParticle(tag: string): boolean {
    return !!tag && tag.startsWith('I+Part');
}
export function isPreposition(tag: string): boolean {
    return !!tag && tag.startsWith('I+Prep');
}
export function isName(tag: string): boolean {
    return !!tag && tag.startsWith('N+') && !isAnthroponymic(tag) && !isToponym(tag) && !isPatronymic(tag);
}
export function isAnthroponymic(tag: string): boolean {
    return !!tag && tag.startsWith('N+Ant');
}
export function isPatronymic(tag: string): boolean {
    return !!tag && tag.startsWith('N+Pat');
}
export function isVerb(tag: string): boolean {
    return !!tag && tag.startsWith('V');
}
export function isPronoun(tag: string): boolean {
    return !!tag && tag.startsWith('PRO+');
}
export function isNum(tag: string): boolean {
    return !!tag && tag.startsWith('NUM');
}
export function isNeg(tag: string): boolean {
    return !!tag && tag.startsWith('I+Neg');
}
export function isConj(tag: string): boolean {
    return !!tag && tag.startsWith('I+Conj');
}
export function isIntj(tag: string): boolean {
    return !!tag && tag.startsWith('I+Intj');
}
export function isPresent(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isPresent(crasis[0]) || isPresent(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('P'),
        false,
    );
}
export function isImperfect(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isImperfect(crasis[0]) || isImperfect(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('I'),
        false,
    );
}
export function isFuture(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isFuture(crasis[0]) || isFuture(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('F'),
        false,
    );
}
export function isAorist(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isAorist(crasis[0]) || isAorist(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('J'),
        false,
    );
}
export function isPerfect(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isPerfect(crasis[0]) || isPerfect(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('R'),
        false,
    );
}
export function isPluperfect(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isPluperfect(crasis[0]) || isPluperfect(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('Q'),
        false,
    );
}
export function isFuturePerfect(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isFuturePerfect(crasis[0]) || isFuturePerfect(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('L'),
        false,
    );
}
export function isIndicative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isIndicative(crasis[0]) || isIndicative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('Î'),
        false,
    );
}
export function isSubjunctive(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isSubjunctive(crasis[0]) || isSubjunctive(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('S'),
        false,
    );
}
export function isImperative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isImperative(crasis[0]) || isImperative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('Y'),
        false,
    );
}
export function isOptative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isOptative(crasis[0]) || isOptative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('O'),
        false,
    );
}
export function isInfinitive(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isInfinitive(crasis[0]) || isInfinitive(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('W'),
        false,
    );
}
export function isParticiple(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isParticiple(crasis[0]) || isParticiple(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('K'),
        false,
    );
}
export function is1st(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => is1st(crasis[0]) || is1st(crasis[1]),
        (parts: string[]) => /^PRO\+...1/.test(tag) || (parts[1] || '').includes('1'),
        false,
    );
}
export function is2nd(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => is2nd(crasis[0]) || is2nd(crasis[1]),
        (parts: string[]) => /^PRO\+...2/.test(tag) || (parts[1] || '').includes('2'),
        false,
    );
}
export function is3rd(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => is3rd(crasis[0]) || is3rd(crasis[1]),
        (parts: string[]) => /^PRO\+...3/.test(tag) || (parts[1] || '').includes('3'),
        false,
    );
}
export function isActive(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isActive(crasis[0]) || isActive(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('E'),
        false,
    );
}
export function isMiddle(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isMiddle(crasis[0]) || isMiddle(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('M'),
        false,
    );
}
export function isPassive(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isPassive(crasis[0]) || isPassive(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('B'),
        false,
    );
}
export function isToponym(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isToponym(crasis[0]) || isToponym(crasis[1]),
        (parts: string[]) => (parts[0] || '').startsWith('N+Top'),
        false,
    );
}
export function isMasculine(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isMasculine(crasis[0]) || isMasculine(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('m'),
        false,
    );
}

export function isFeminine(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isFeminine(crasis[0]) || isFeminine(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('f'),
        false,
    );
}

export function isNeutral(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isNeutral(crasis[0]) || isNeutral(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('n'),
        false,
    );
}

export function isSingular(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isSingular(crasis[0]) || isSingular(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('s') || parts[0].endsWith('s'),
        false,
    );
}

export function isPlural(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isPlural(crasis[0]) || isPlural(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('p') || parts[0].endsWith('p'),
        false,
    );
}

export function isDual(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isDual(crasis[0]) || isDual(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('d'),
        false,
    );
}

export function isNominative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isNominative(crasis[0]) || isNominative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('N'),
        false,
    );
}

export function isVocative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isVocative(crasis[0]) || isVocative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('V'),
        false,
    );
}

export function isAccusative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isAccusative(crasis[0]) || isAccusative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('A'),
        false,
    );
}

export function isGenitive(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isGenitive(crasis[0]) || isGenitive(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('G'),
        false,
    );
}

export function isDative(tag: string): boolean {
    return checkTag(
        tag,
        (crasis: string[]) => isDative(crasis[0]) || isDative(crasis[1]),
        (parts: string[]) => (parts[1] || '').includes('D'),
        false,
    );
}

function checkTag<T>(tag: string, f: (crasis: string[]) => T, g: (parts: string[]) => T, defaultValue: T): T {
    if (!tag) { return defaultValue; }
    const crasis = tag.split('@');
    if (crasis.length > 1) {
        return f(crasis);
    }
    const parts = tag.split(':');
    if (parts.length < 1) { return defaultValue; }
    return g(parts);
}

export function containsPOStoHighlight(tag: string, posFilter: PosFilter): boolean {
    if (!posFilter.pos || posFilter.pos.length === 0 || !tag) {
        return false;
    }
    const pos: boolean[] = [];

    posFilter.pos.forEach((x) => {
        // tslint:disable-next-line:no-eval
        pos.push(eval(`is${x}(tag)`) as boolean);
    });
    return pos.reduce((x, y) => posFilter.op === 'and' ? x && y : x || y, posFilter.op === 'and' ? true : false);
}

export function removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function capitalize(s: string) {
    return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
}
