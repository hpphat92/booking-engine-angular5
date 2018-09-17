import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit, Component, ContentChild, Directive, ElementRef, HostBinding, HostListener,
  Input, OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MatFormFieldControl } from '@angular/material';

declare var $: any;

@Component({
  selector: 'choosePassenger',
  templateUrl: './choose-passenger.component.html',
  styleUrls: ['./choose-passenger.component.scss']
})
export class ChoosePassengerComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  private subscription;
  public listSelections = _.times(20, x => x + 1);
  @HostBinding('class.focused')
  public formFocused: boolean;
  @ContentChild(MatFormFieldControl)
  public inputRef: MatFormFieldControl<any>;
  public frm;
  @ContentChild('input')
  public inputEl: ElementRef;

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    let clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.formFocused = false;
    }
  }

  ngAfterViewInit(): void {
  }

  constructor(public elementRef: ElementRef,
              public fb: FormBuilder) {
    this.frm = this.fb.group({
      rooms: [1],
      adults: [1]
    });
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      console.log(this.inputEl);
    }, 1000);
    if (this.inputEl) {
      this.inputEl.nativeElement.onfocus = () => {
        this.formFocused = true;
      };
      this.patchControlValue(this.frm.getRawValue());
      this.subscription = this.frm.valueChanges.subscribe((formValue) => {
        this.patchControlValue(formValue);
      });
    }
  }

  public patchControlValue(formValue) {
    this.inputRef.ngControl.control.patchValue(formValue);
    this.inputEl.nativeElement.value = `${formValue.rooms} room(s) and ${formValue.adults} adult(s).`;
  }

  ngOnDestroy(): void {
    this.subscription && this.subscription.unsubscribe();
  }

}
