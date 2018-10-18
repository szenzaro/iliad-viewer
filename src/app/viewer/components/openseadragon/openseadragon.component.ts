import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';

import OpenSeadragon from 'openseadragon';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, filter, switchMap, startWith, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  @Input() set options(o) {
    this.optionsChange.next(o);
  }
  get options() { return this.optionsChange.value; }

  optionsChange = new BehaviorSubject({});

  @Input() set manifestURL(url: string) {
    if (url !== this.manifestURLChange.value) {
      this.manifestURLChange.next(url);
    }
  }
  get manifestURL() { return this.manifestURLChange.value; }

  manifestURLChange = new BehaviorSubject(undefined);

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

  viewer: any;

  constructor(private http: HttpClient) {
    this.tileSources.subscribe();
    this.optionsChange.subscribe();
  }

  ngAfterViewInit() {
    this.div.nativeElement.id = `openseadragon-${Math.random()}`;
    combineLatest(this.optionsChange, this.tileSources)
      .subscribe(([opts, tileSources]) => {
        console.log('here', opts, tileSources);
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
      });
  }

}
