import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';

import OpenSeadragon from 'openseadragon';

@Component({
  selector: 'app-openseadragon',
  templateUrl: './openseadragon.component.html',
  styleUrls: ['./openseadragon.component.scss']
})
export class OpenseadragonComponent implements AfterViewInit {
  @ViewChild('osd', { read: ElementRef }) div: ElementRef;

  @Input() options = {};

  viewer: any;

  ngAfterViewInit() {
    this.div.nativeElement.id = `openseadragon-${Math.random()}`;
    this.viewer = OpenSeadragon({ prefixUrl: 'assets/osd/images/', ...this.options, id: this.div.nativeElement.id });
  }

}
