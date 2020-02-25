import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Map, uuid } from 'src/app/utils';
import { InSubject } from '../../utils/in-subject';

import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { Annotation } from 'src/app/utils/models';

declare var OpenSeadragon;

export interface OsdAnnotation {
  id: string;
  element: HTMLDivElement;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  text: string;
  annotation: Annotation;
  modalService?: NgbModal;
}

interface OsdAnnotationAPI {
  elements: OsdAnnotation[];
  getElements: () => OsdAnnotation[];
  getElementById: (id: string) => OsdAnnotation;
  addElement: (e: OsdAnnotation) => OsdAnnotation[];
  addElements: (es: OsdAnnotation[]) => OsdAnnotation[];
  removeElementById: (id: string) => void;
  removeElementsById: (ids: string[]) => void;
  goToElementLocation: (id: string) => void;
}

interface OsdViewerAPI {
  addHandler: (eventName: string, handler: (x: { page: number }) => void) => void;
  goToPage: (page: number) => void;
  HTMLelements: () => OsdAnnotationAPI;
  viewport;
  gestureSettingsMouse;
  raiseEvent: (evtName: string) => void;
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
    '@context': manifestResource.service['@context'],
    '@id': manifestResource.service['@id'],
    profile: [manifestResource.service['@profile']],
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
export class OpenseadragonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('osd', { read: ElementRef, static: true }) div: ElementRef;

  @Input() @InSubject() options; // TODO: add interface to better type this object
  optionsChange = new BehaviorSubject({});

  @Input() @InSubject() manifestURL: string;
  manifestURLChange = new BehaviorSubject(undefined);

  @Input() @InSubject() page: number;
  @Output() pageChange = new EventEmitter<number>();

  @Input() @InSubject() annotations: Map<OsdAnnotation[]>;
  annotationsChange = new BehaviorSubject<Map<OsdAnnotation[]>>({});

  @Input() text: string;

  tileSources: Observable<Array<{}>> = this.manifestURLChange
    .pipe(
      filter((url) => !!url),
      distinctUntilChanged(),
      switchMap((url) => this.http.get(url)),
      map((manifest: { sequences: Partial<Array<{ canvases }>> }) => manifest // get the resource fields in the manifest json structure
        .sequences.map((seq) => seq.canvases.map((canv) => canv.images).reduce((x, y) => x.concat(y), []))
        .reduce((x, y) => x.concat(y), []).map((res) => res.resource)
        .map(manifestResourcetoTileSource)
      ),
    );

  // clip to project related images
  clippedTileSources = this.tileSources
    .pipe(
      map((tiles: Array<{}>) => tiles.slice(18)),
    );

  viewer: Partial<OsdViewerAPI>;
  viewerId: string;
  annotationsHandle: OsdAnnotationAPI;

  private subscriptions: Subscription[] = [];

  get pageAnnotations() {
    return (page: number) => !!this.annotations[page] ? this.annotations[page] : [];
  }

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
  ) {
    this.subscriptions.push(this.pageChange.pipe(
      distinctUntilChanged(),
    ).subscribe((x) => {
      if (!!this.viewer) {
        this.viewer.goToPage(x - 1);
      }
    }));

    this.subscriptions.push(combineLatest([
      this.annotationsChange,
      this.pageChange,
    ]).subscribe(([ann, page]) => {
      if (!this.annotationsHandle) { return; }
      const p = page as number;
      this.updateAnnotations(!!ann[p - 1] ? ann[p - 1] : []);
    }));
  }

  ngAfterViewInit() {
    this.viewerId = uuid('openseadragon');
    this.div.nativeElement.id = this.viewerId;

    const commonOptions = {
      visibilityRatio: 0.1,
      minZoomLevel: 0.5,
      defaultZoomLevel: 1,
      sequenceMode: true,
      prefixUrl: 'assets/osd/images/',
      id: this.div.nativeElement.id,
      navigatorBackground: '#606060',
      showNavigator: false,
      gestureSettingsMouse: {
        clickToZoom: false,
        dblClickToZoom: true,
      },
    };

    this.subscriptions.push(combineLatest([this.optionsChange, this.clippedTileSources])
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
          this.pageChange.next(page + 1);
          this.clearAnnotations();
          this.annotationsHandle.addElements(this.pageAnnotations(page));
        });

        this.annotationsHandle = this.viewer.HTMLelements();
        this.initAnnotationsEventSource();
        this.annotationsHandle.addElements(this.pageAnnotations(0));
      }));
  }

  updateAnnotations(data: OsdAnnotation[]) {
    this.clearAnnotations();
    this.annotationsHandle.addElements(data);
    this.viewer.raiseEvent('resize');
  }

  hideAnnotation() {
    (this.viewer.HTMLelements().elements as OsdAnnotation[]).forEach((e) => {
      e.element.children[0].dispatchEvent(new Event('annev'));
    });
  }

  clearAnnotations() {
    const ids = this.annotationsHandle.getElements().map(({ id }) => id);
    this.annotationsHandle.removeElementsById(ids);
  }

  initAnnotationsEventSource() {
    const keys = Object.keys(this.annotations);

    keys.forEach((k) => {
      this.annotations[k].forEach((a) => {
        a.modalService = this.modalService;
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
