import { Component, Input, Output, OnChanges, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PaginatorEvent } from './subtypes/paginator.event';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges, OnInit {
  @Input('pageSize') pageSize: number = 10;
  @Input('splice') splice: number = 3;
  @Input('total') total: number = 0;
  @Output('updatePage') updatePage = new EventEmitter<PaginatorEvent>();

  debugMode: boolean = false;
  firstPage: any = null;
  lastPage: any = null;
  pageCount: number = -1;
  preEllipsis: boolean = false;
  postEllipsis: boolean = false;
  page: number = 0;
  pages: any[] = [];
  singlePage: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  public navigateTo(page: any): boolean {
    this.page = page.position;
    this.calculatePages();

    const url = this.router.parseUrl(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    url.queryParams.page = page.position;
    this.router.navigateByUrl(url);

    return false;
  }

  ngOnChanges(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.debugMode = typeof params['debug'] !== 'undefined';
      this.page = typeof params['page'] !== 'undefined' ? parseInt(params['page']) : 0;

      this.calculatePages();
    });
  }
  ngOnInit() {
  }

  protected calculatePages(): void {
    this.singlePage = true;
    this.preEllipsis = false;
    this.postEllipsis = false;
    this.pages = [];
    this.pageCount = Math.ceil(this.total / this.pageSize);

    for (let i = 0; i < this.pageCount; i++) {
      this.pages.push({
        name: i + 1,
        position: i
      });
    }

    this.singlePage = this.pages.length < 2;

    if (!this.singlePage) {
      this.firstPage = this.pages[0];
      this.lastPage = this.pages[this.pages.length - 1];

      let spliceFrom = this.page - this.splice;
      spliceFrom = spliceFrom < 0 ? 0 : spliceFrom;
      this.pages = this.pages.splice(spliceFrom, this.splice * 2 + 1);

      if (this.pages[0].position > 0) {
        this.preEllipsis = true;
      }
      if (this.pages[this.pages.length - 1].position < this.pageCount - 1) {
        this.postEllipsis = true;
      }
    }

    this.updatePage.emit(new PaginatorEvent({
      page: this.page,
      limit: this.pageSize * 1,
      skip: this.pageSize * this.page
    }));
  }
}
