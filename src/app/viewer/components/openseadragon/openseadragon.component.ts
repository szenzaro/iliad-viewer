import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { InSubject } from '../../utils/InSubject';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { Map, uuid } from 'src/app/utils';

declare var OpenSeadragon: any;

interface OsdAnnotation {
  id: string;
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
}

interface OsdAnnotationAPI {
  getElements: () => OsdAnnotation[];
  getElementById: (id: string) => OsdAnnotation;
  addElement: (e: OsdAnnotation) => OsdAnnotation[];
  addElements: (es: OsdAnnotation[]) => OsdAnnotation[];
  removeElementById: (id: string) => void;
  removeElementsById: (ids: string[]) => void;
  goToElementLocation: (id: string) => void;
}

function createAnnotation(text: string, x = 0, y = 0, width = 0, height = 0): OsdAnnotation {
  const element = document.createElement('div');
  element.classList.add('annotation');
  element.innerHTML = text;
  return {
    id: uuid('annotation'),
    element,
    x,
    y,
    width,
    height
  };
}

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

  @Input() @InSubject() page: number;
  @Output() pageChange = new EventEmitter<number>();

  @Input() annotationsData: Map<OsdAnnotation[]> = {
    0: [createAnnotation('description', 630, 670, 1377, 100)],
  };

  @Input() text: string;

  tileSources: Observable<{}[]> = this.manifestURLChange
    .pipe(
      filter((url) => !!url),
      distinctUntilChanged(),
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

  viewer: Partial<{ addHandler: Function, goToPage: Function, HTMLelements: Function, viewport: any }>;
  viewerId: string;
  annotations: OsdAnnotationAPI;

  get pageAnnotations() {
    return (page: number) => !!this.annotationsData[page] ? this.annotationsData[page] : [];
  }

  constructor(
    private http: HttpClient,
  ) {
    this.pageChange
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe((x) => {
        if (!!this.viewer) {
          this.viewer.goToPage(x);
        }
      });
  }

  ngAfterViewInit() {
    this.viewerId = uuid('openseadragon');
    this.div.nativeElement.id = this.viewerId;

    const commonOptions = {
      visibilityRatio: 1,
      minZoomLevel: 0.5,
      defaultZoomLevel: 1,
      sequenceMode: true,
      prefixUrl: 'assets/osd/images/',
      id: this.div.nativeElement.id,
      navigatorBackground: '#606060',
      showNavigator: true,
    };

    combineLatest(this.optionsChange, this.clippedTileSources)
      .subscribe(([_, tileSources]) => {
        if (!!tileSources) {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            tileSources,
          });
        } else {
          this.viewer = OpenSeadragon({
            ...commonOptions,
            ...this.options,
          });
        }

        this.viewer.addHandler('page', ({ page }) => {
          this.pageChange.next(page);
          this.clearAnnotations();
          this.annotations.addElements(this.pageAnnotations(page));
        });

        this.annotations = this.viewer.HTMLelements();

        this.annotations.addElements(this.pageAnnotations(0));
      });
  }

  clearAnnotations() {
    const ids = this.annotations.getElements().map(({ id }) => id);
    this.annotations.removeElementsById(ids);
  }
}
