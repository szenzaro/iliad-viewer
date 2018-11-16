import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import OpenSeadragon from 'openseadragon';

import { InSubject } from '../../utils/InSubject';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';

/*

From:
{
  "@id": "https://www.e-codices.unifr.ch:443/loris/bge/bge-gr0044/bge-gr0044_e001.jp2/full/full/0/default.jpg",
  "@type": "dctypes:Image",
  "format": "image/jpeg",
  "height": 7304,
  "width": 5472,
  "service": {
    "@context": "http://iiif.io/api/image/2/context.json",
    "@id": "https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2",
    "profile": "http://iiif.io/api/image/2/level2.json"
  }
}

To:
{
  '@context': 'http://iiif.io/api/image/2/context.json',
  '@id': 'https://www.e-codices.unifr.ch/loris/bge/bge-gr0044/bge-gr0044_e001.jp2',
  'profile': ['http://iiif.io/api/image/2/level2.json'],
  'protocol': 'http://iiif.io/api/image',
  'height': 7304,
  'width': 5472,
}

*/
function manifestResourcetoTileSource(manifestResource) {
  return {
    '@context': manifestResource['service']['@context'],
    '@id': manifestResource['service']['@id'],
    profile: [manifestResource['service']['@profile']],
    protocol: 'http://iiif.io/api/image',
    height: manifestResource.height,
    width: manifestResource.width,
  };
}

@Component({
  selector: 'app-openseadragon',
  templateUrl: './openseadragon.component.html',
  styleUrls: ['./openseadragon.component.scss']
})
export class OpenseadragonComponent implements AfterViewInit {
  @ViewChild('osd', { read: ElementRef }) div: ElementRef;

  @Input() @InSubject() options; // TODO: add interface to better type this object
  optionsChange = new BehaviorSubject({});

  @Input() @InSubject() manifestURL: string;
  manifestURLChange = new BehaviorSubject(undefined);

  @Output() pageChange = new EventEmitter<number>();
  @Output() chantChange = new EventEmitter<number>();

  @Input() text: string;

  tileSources: Observable<{}[]> = this.manifestURLChange
    .pipe(
      filter((url) => !!url),
      switchMap((url) => this.http.get(url)),
      map((manifest: { sequences: any[] }) => manifest // get the resource fields in the manifest json structure
        .sequences.map((seq) => seq.canvases.map((canv) => canv.images).reduce((x, y) => x.concat(y), []))
        .reduce((x, y) => x.concat(y), []).map((res) => res.resource)
        .map(manifestResourcetoTileSource)
      ),
    );

  // clip to project related images
  clippedTileSources = this.tileSources
    .pipe(
      map((tiles: any[]) => tiles.slice(18, 145)) // TODO: check right boundary
    );

  viewer: Partial<{ addHandler: any }>;

  constructor(
    private http: HttpClient,
    private textService: TextService,
  ) {
  }

  ngAfterViewInit() {
    this.div.nativeElement.id = `openseadragon-${Math.random()}`;
    combineLatest(this.optionsChange, this.clippedTileSources)
      .subscribe(([_, tileSources]) => {
        if (!!tileSources) {
          this.viewer = OpenSeadragon({
            visibilityRatio: 1,
            minZoomLevel: 0.5,
            defaultZoomLevel: 1,
            sequenceMode: true,
            prefixUrl: 'assets/osd/images/',
            id: this.div.nativeElement.id,
            navigatorBackground: '#606060',
            tileSources,
          });
        } else {
          this.viewer = OpenSeadragon({
            prefixUrl: 'assets/osd/images/',
            ...this.options,
            id: this.div.nativeElement.id,
            navigatorBackground: '#606060',
          });
        }

        this.viewer.addHandler('page', (x) => {
          this.textService.getVersesNumberFromPage(this.text, x.page).toPromise()
            .then((pageData) => {
              this.pageChange.next(x.page + 1);
              this.chantChange.next(pageData[0]);
            });
        });
      });
  }

}
