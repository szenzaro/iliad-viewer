import { Injectable } from '@angular/core';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { combineLatest, forkJoin } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Map } from '../utils/index';
import { Word } from '../utils/models';
import { CacheService } from './cache.service';
import { TextService } from './text.service';

interface AlignmentEntry {
  type: AlignmentKind | ScholieKind;
  source: string[];
  target: string[];
}

interface ScholieEntry {
  kind: 'h' | 'p';
  source: string[];
  target: string[];
}

export type AlignmentType = 'auto' | 'manual';
export type AlignmentKind = 'sub' | 'ins' | 'del' | 'eq';
export type ScholieKind = 'homerscholie' | 'homernotscholie' | 'paraphrasescholie';

export const AlignmentLabels = {
  auto: _T('Auto'),
  manual: _T('Manual'),
};

@Injectable({
  providedIn: 'root'
})
export class AlignmentService {

  private manifestAlignmentsData = this.textService.manifest.pipe(
    map(({ alignments }) => alignments),
    shareReplay(1),
  );

  private manifestScholieAlignmentsData = this.textService.manifest.pipe(
    map(({ scholieAlignments }) => scholieAlignments),
    shareReplay(1),
  );

  private alignments = this.manifestAlignmentsData.pipe(
    map((al) => al.map(({ source, target, type }) => `./assets/data/alignments/${type}/${source}/${target}.json`)),
    map((al) => al.map((a) => this.cacheService.cachedGet<Map<AlignmentEntry>>(a))),
    switchMap((al) => combineLatest([forkJoin(al), this.textService.manifest]).pipe(
      map(([als, { alignments }]) => {
        const ret: Map<Map<AlignmentEntry>> = {};
        alignments.forEach((a, i) => {
          ret[`${a.type}_${a.source}-${a.target}`] = als[i];
        });
        return ret;
      })
    )),
    shareReplay(1),
  );

  // TODO: refactor alignments and scholieAlignments as a single parametric function
  private scholieAlignments = this.manifestScholieAlignmentsData.pipe(
    map((al) => al.map(({ source, target }) => `./assets/data/scholie-alignment/${source}/${target}.json`)),
    map((al) => al.map((a) => this.cacheService.cachedGet<Map<ScholieEntry>>(a))),
    switchMap((al) => combineLatest([forkJoin(al), this.textService.manifest]).pipe(
      map(([als, { scholieAlignments }]) => {
        const ret: Map<Map<AlignmentEntry>> = {};
        scholieAlignments.forEach((a, i) => {

          const keys = Object.keys(als[i]);
          const data: Map<AlignmentEntry> = {};
          keys.forEach((k) => {
            const { source, target, kind } = als[i][k];
            const type = kind === 'h' ? 'homerscholie' : 'homernotscholie';
            data[k] = { source, target, type };
          });
          ret[`scholie_${a.source}-${a.target}`] = data;
        });
        return ret;
      })
    )),
    shareReplay(1),
  );

  homericScholieAlignmentsIDS = this.scholieAlignments.pipe( // TODO make this more robust
    map((als) => als['scholie_homeric-scholie']),
    shareReplay(1),
  );

  alignmentTypes = this.textService.manifest.pipe(
    map(({ alignments }) => [...new Set(alignments.map((x) => x.type))]),
    shareReplay(1),
  );

  constructor(
    private textService: TextService,
    private cacheService: CacheService,
  ) {
  }

  getAlignment(source: string, target: string, wordId: string, type: AlignmentType) {
    return this.alignments
      .pipe(
        map((alignment) => alignment[`${type}_${source}-${target}`][wordId]), // Can be undefined!
        map((al) => ({ ...al, source: al?.source ?? [], target: al?.target ?? [] } as AlignmentEntry)),
      );
  }

  getScholieAlignment(source: string, target: string, wordId: string) {
    return this.scholieAlignments
      .pipe(
        map((alignment) => alignment[`scholie_${source}-${target}`][wordId]), // Can be undefined!
        map((al) => ({ ...al, source: al?.source ?? [], target: al?.target ?? [] } as AlignmentEntry)),
      );
  }

  getScholieAlignmentChants(source: string, target: string) {
    return this.manifestScholieAlignmentsData.pipe(
      map((als) => als.find((v) => v.source === source && v.target === target)?.chants),
    );
  }

  getAlignmentChants(source: string, target: string, type: AlignmentType) {
    return this.manifestAlignmentsData.pipe(
      map((als) => als.find((v) => v.source === source && v.target === target && v.type === type)?.chants),
    );
  }

  getWordAlignmentKind(w: Word, source: string, target: string, alignmentType: AlignmentType) {
    return (w.source === source
      ? this.getAlignment(source, target, w.id, alignmentType)
      : this.getAlignment(target, source, w.id, alignmentType)
    ).pipe(
      map((x) => ({
        ...x,
        source: w.source === source ? [...(x.source), w.id] : w.source,
        target: w.source === source ? x.target : [...x.target, w.id],
      })),
      map((x) => x.type),
    );
  }

  getWordScholieAlignmentKind(w: Word, source: string, target: string) {
    return (w.source === source
      ? this.getScholieAlignment(source, target, w.id)
      : this.getScholieAlignment(target, source, w.id)
    ).pipe(
      map((x) => ({
        ...x,
        source: w.source === source ? [...(x.source), w.id] : w.source,
        target: w.source === source ? x.target : [...x.target, w.id],
      })),
      map((x) => source === 'scholie' ? 'paraphrasescholie' : x.type),
    );
  }
}
