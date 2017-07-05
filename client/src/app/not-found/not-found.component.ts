import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppComponent } from '../app.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  unknownUrl: string = '';

  constructor(private app: AppComponent, private router: Router) {
    this.app.title = '404 Not Found';
    this.unknownUrl = router.url;
    console.log('Router', router.url);
  }

  ngOnInit() {
  }
}
