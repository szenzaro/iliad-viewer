import { Component } from '@angular/core';
import { ScholieService } from 'src/app/services/scholie.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-scholie',
  templateUrl: './scholie.component.html',
  styleUrls: ['./scholie.component.css']
})
export class ScholieComponent {
  scholie = this.scholieService.scholie;

  // tslint:disable-next-line: no-any
  keyNumOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => +a.key - +b.key;

  constructor(
    private scholieService: ScholieService,
  ) {
  }

}
