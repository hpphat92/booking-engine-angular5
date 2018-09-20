import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-place-viewer',
  templateUrl: './place-viewer.component.html',
  styleUrls: ['./place-viewer.component.scss']
})
export class PlaceViewerComponent {

  @Input()
  public hideBackDrop;
}
