import { Component } from '@angular/core';
import { TextService } from './services/text.service';
import { NEVER, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iliad-viewer';  
}
