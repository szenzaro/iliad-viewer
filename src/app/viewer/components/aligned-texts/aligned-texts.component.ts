import { Component, EventEmitter, Input } from '@angular/core';
import { combineLatest, merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-aligned-texts',
  templateUrl: './aligned-texts.component.html',
  styleUrls: ['./aligned-texts.component.scss']
})
export class AlignedTextsComponent {
  readonly leftWordOver = new EventEmitter<string>();
  readonly rightWordOver = new EventEmitter<string>();
  @Input() scrollIndex = 0;

  al1 = this.leftWordOver.pipe(
    switchMap((x) => this.textService.getAlignment('homeric', 'paraphrase', x)),
  );
  al2 = this.rightWordOver.pipe(
    switchMap((x) => this.textService.getAlignment('paraphrase', 'homeric', x)),
  );

  sourceIds = merge(
    this.al1.pipe(map((x) => !!x ? x.source : [])),
    this.al2.pipe(map((x) => !!x ? x.target : [])),
  );

  targetIds = merge(
    this.al1.pipe(map((x) => !!x ? x.target : [])),
    this.al2.pipe(map((x) => !!x ? x.source : [])),
  );

  highlights = combineLatest([
    this.sourceIds,
    this.targetIds,
  ]).pipe(
    map(([source, target]) => ({ source, target })),
  );


  constructor(
    readonly textService: TextService,
  ) {
  }
}
