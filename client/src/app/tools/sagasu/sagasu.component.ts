import { Component, Input, Output, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { SagasuConfig, SagasuEvent } from './subtypes';

@Component({
  selector: 'app-searchbox',
  templateUrl: './sagasu.component.html',
  styleUrls: ['./sagasu.component.scss']
})
export class SagasuComponent implements OnChanges, OnInit {
  @Input('config') config: SagasuConfig;
  @Output('updateResults') updateResults = new EventEmitter<SagasuEvent>();

  debugMode: boolean = false;
  expanded: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  public clear(): boolean {
    this.config.clear();

    if (this.config.submitOnClear) {
      this.search();
    }

    return false;
  }
  public search(): boolean {
    const url = this.router.parseUrl(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    const query = this.config.queryForUrl();

    if (Object.keys(query).length > 0) {
      url.queryParams.query = encodeURI(JSON.stringify(query));
    } else {
      delete url.queryParams.query;
    }

    this.updateResults.emit(new SagasuEvent({
      query: this.config.queryForApi()
    }));

    if (typeof url.queryParams.page !== 'undefined') {
      delete url.queryParams.page;
    }

    this.router.navigateByUrl(url);

    return false;
  }
  public toggleFilters(): void {
    this.expanded = !this.expanded;
  }

  ngOnChanges() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.debugMode = typeof params['debug'] !== 'undefined';

      if (typeof params['query'] !== 'undefined') {
        this.config.clear();

        try {
          const query = JSON.parse(decodeURI(params['query']));
          this.config.loadValues(query);
          this.expanded = Object.keys(query).length > 0;
        } catch (e) {
          console.error(`SagasuComponent::ngOnChanges() Error: ${e}`);
        }
      }
    });
  }
  ngOnInit() {
  }
}
