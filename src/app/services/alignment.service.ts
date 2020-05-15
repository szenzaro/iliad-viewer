import { Injectable } from '@angular/core';
import { combineLatest, forkJoin } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { Map } from '../utils/index';
import { CacheService } from './cache.service';
import { TextService } from './text.service';

interface AlignmentEntry {
  type: 'sub' | 'ins' | 'del' | 'eq';
  source: string[];
  target: string[];
}

export type AlignmentType = 'auto' | 'manual';

@Injectable({
  providedIn: 'root'
})
export class AlignmentService {

  private manifestAlignmentsData = this.textService.manifest.pipe(
    map(({ alignments }) => alignments),
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
        map((al)=> ({ source: al?.source ?? [], target: al?.target ?? [] } as AlignmentEntry)),
      );
  }

  getAlignmentChants(source: string, target: string, type: AlignmentType) {
    return this.manifestAlignmentsData.pipe(
      map((als) => als.find((v) => v.source === source && v.target === target && v.type === type)?.chants),
    );
  }
}
