import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplesCrudComponent } from './examples-crud.component';

describe('ExamplesCrudComponent', () => {
  let component: ExamplesCrudComponent;
  let fixture: ComponentFixture<ExamplesCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamplesCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamplesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
