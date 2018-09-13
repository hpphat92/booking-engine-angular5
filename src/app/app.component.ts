import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  public form: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public authService: AuthService) {
    this.form = this.formBuilder.group({
      keyword: [''],
      checkInCheckOut: ['', Validators.required],
      numberOfPax: [''],
      isTraveliingForWork: ['']
    });
  }

  public navigateToHome() {
    this.authService.navigateByUrl('');
  }
}
