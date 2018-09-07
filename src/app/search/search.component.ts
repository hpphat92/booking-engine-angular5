import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit {

  title = 'app';
  public form: FormGroup;

  constructor(public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      numberOfPax: [''],
    });
  }

  ngAfterViewInit(): void {

  }

  search() {

  }
}
