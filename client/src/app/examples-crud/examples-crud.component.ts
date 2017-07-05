import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AppComponent } from '../app.component';

import { ExamplesService } from '../providers/examples.service';

@Component({
  selector: 'app-examples-crud',
  templateUrl: './examples-crud.component.html',
  styleUrls: ['./examples-crud.component.scss'],
  providers: [ExamplesService]
})
export class ExamplesCrudComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  available: boolean = true;
  currentItem: any = {};
  formTitle: string = '';
  items: Array<any> = [];

  constructor(private app: AppComponent, private examples: ExamplesService) {
    this.app.title = 'Examples CRUD';

    this.clearForm();
    this.loadItems();
  }

  public clearForm(): void {
    this.formTitle = 'Create Item';
    this.currentItem = {};
  }
  public deleteItem(item): void {
    this.blockUI.start('Deleting...');

    this.examples.delete(item._id).subscribe(response => {
      this.blockUI.stop();

      this.loadItems();
    }, error => {
      console.log('Error:', error);
      this.blockUI.stop();
    });
  }
  public editItem(item): void {
    this.formTitle = 'Edit Item';
    this.currentItem = item;
  }
  public saveItem(): void {
    if (typeof this.currentItem._id === 'undefined') {
      this.blockUI.start('Creating...');

      this.examples.create(this.currentItem).subscribe(response => {
        this.clearForm();
        this.blockUI.stop();

        this.loadItems();
      }, error => {
        console.log('Error:', error);
        this.blockUI.stop();
      });
    } else {
      this.blockUI.start('Updating...');

      this.examples.update(this.currentItem._id, this.currentItem).subscribe(response => {
        this.clearForm();
        this.blockUI.stop();

        this.loadItems();
      }, error => {
        console.log('Error:', error);
        this.blockUI.stop();
      });
    }
  }

  ngOnInit() {
  }

  protected loadItems(): void {
    this.blockUI.start('Loading...');

    this.examples.all().subscribe(response => {
      this.items = response;
      this.blockUI.stop();
    }, error => {
      this.available = false;
      console.log('Error:', error);
      this.blockUI.stop();
    });
  }
}
