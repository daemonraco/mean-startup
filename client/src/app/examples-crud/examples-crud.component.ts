import { Component, OnInit } from '@angular/core';

import { AppComponent } from '../app.component';

import { ExamplesService } from '../providers/examples.service';

@Component({
  selector: 'app-examples-crud',
  templateUrl: './examples-crud.component.html',
  styleUrls: ['./examples-crud.component.scss'],
  providers: [ExamplesService]
})
export class ExamplesCrudComponent implements OnInit {
  available: boolean = true;
  currentItem: any = {};
  formTitle: string = '';
  items: Array<any> = [];

  constructor(private app: AppComponent, private examples: ExamplesService) {
    this.clearForm();
    this.loadItems();
  }

  public clearForm(): void {
    this.formTitle = 'Create Item';
    this.currentItem = {};
  }
  public deleteItem(item): void {
    this.app.startLoading('Deleting...');

    this.examples.delete(item._id).subscribe(response => {
      this.app.stopLoading();

      this.loadItems();
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

        this.loadItems();
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

  ngOnInit() {
    this.app.title = 'Examples CRUD';
  }

  protected loadItems(): void {
    this.app.startLoading('Loading...');

    this.examples.all().subscribe((response: any) => {
      this.items = response;
      this.app.stopLoading();
    }, error => {
      this.available = false;
      console.log('ExamplesCrudComponent::loadItems() Error:', error);
      this.app.stopLoading();
    });
  }
}
