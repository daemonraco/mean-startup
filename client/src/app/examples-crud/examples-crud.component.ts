import { Component, OnInit } from '@angular/core';
import { PaginatorEvent, SagasuConfig, SagasuField, SagasuEvent } from '../tools';

import { AppComponent } from '../app.component';

import { ExamplesService } from '../providers/examples.service';

@Component({
  selector: 'app-examples-crud',
  templateUrl: './examples-crud.component.html',
  styleUrls: ['./examples-crud.component.scss'],
  providers: [ExamplesService]
})
export class ExamplesCrudComponent implements OnInit {
  protected currentPage: number = -1;
  protected pageQuery: any = {};
  protected searchboxQuery: any = {};

  available: boolean = true;
  currentItem: any = {};
  formTitle: string = '';
  items: Array<any> = [];
  searchboxConfig: SagasuConfig = null;
  total: number = -1;

  constructor(
    private app: AppComponent,
    private examples: ExamplesService) {
  }

  public clearForm(): void {
    this.formTitle = 'Create Item';
    this.currentItem = {};
  }
  public deleteItem(item): void {
    this.app.startLoading('Deleting...');

    this.examples.delete(item._id).subscribe(response => {
      this.app.stopLoading();
      this.countItems();
    }, error => {
      console.log('ExamplesCrudComponent::deleteItem() Error:', error);
      this.app.stopLoading();
    });
  }
  public editItem(item): void {
    this.formTitle = 'Edit Item';
    this.currentItem = item;
  }
  public saveItem(): void {
    if (typeof this.currentItem._id === 'undefined') {
      this.app.startLoading('Creating...');

      this.examples.create(this.currentItem).subscribe(response => {
        this.clearForm();
        this.app.stopLoading();
        this.countItems();
      }, error => {
        console.log('ExamplesCrudComponent::saveItem() Error:', error);
        this.app.stopLoading();
      });
    } else {
      this.app.startLoading('Updating...');

      this.examples.update(this.currentItem._id, this.currentItem).subscribe(response => {
        this.clearForm();
        this.app.stopLoading();
        this.loadItems();
      }, error => {
        console.log('ExamplesCrudComponent::saveItem() Error:', error);
        this.app.stopLoading();
      });
    }
  }
  public updatePage(event: PaginatorEvent): void {
    if (event && event.page != this.currentPage) {
      this.currentPage = event.page;
      this.pageQuery = event.toJSONForApi();
      this.loadItems();
    }
  }
  public updateSeach(event: SagasuEvent): void {
    this.searchboxQuery = event.query;
    this.countItems();
  }

  ngOnInit() {
    this.app.setTitle('Examples CRUD');
    this.clearForm();
    this.loadSearchBox();
    this.countItems();
  }

  protected countItems(): void {
    this.currentPage = -1;

    const query = {
      query: this.searchboxQuery
    };

    this.examples.count(query).subscribe((countResponse: any) => {
      this.total = countResponse.count;
    }, error => {
      this.available = false;
      console.log('ExamplesCrudComponent::loadItems() Error:', error);
    });
  }
  protected loadItems(): void {
    let query = Object.assign({
      query: this.searchboxQuery
    }, this.pageQuery);

    this.app.startLoading('Loading...');
    this.examples.all(query).subscribe((response: any) => {
      this.items = response;
      this.app.stopLoading();
    }, error => {
      this.available = false;
      console.log('ExamplesCrudComponent::loadItems() Error:', error);
      this.app.stopLoading();
    });
  }
  protected loadSearchBox(): void {
    let field;

    this.searchboxConfig = new SagasuConfig();

    field = SagasuField.create('name', SagasuField.TYPE_TEXT);
    this.searchboxConfig.addField(field);

    field = SagasuField.create('description', SagasuField.TYPE_TEXT);
    this.searchboxConfig.addField(field);

    field = SagasuField.create('size', SagasuField.TYPE_SELECTOR);
    field.addOption('');
    field.addOption('medium');
    field.addOption('short');
    field.addOption('tall');
    this.searchboxConfig.addField(field);

    field = SagasuField.create('_ANY_', SagasuField.TYPE_TEXT);
    field.title = 'Generic';
    this.searchboxConfig.addField(field);
  }
}
