import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnDestroy {
  constructor(public router: Router,
              public route: ActivatedRoute,
              public authService: AuthService) {
    this.route.params.subscribe((param) => {
      let { id: partnerId } = param;
      this.authService.currentPartnerId = partnerId;
    });
  }

  ngOnDestroy(): void {
    this.authService.currentPartnerId = null;
  }

}
