import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BlockUIModule } from 'ng-block-ui';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoutes } from './app.routes';

import { ToolsModule } from './tools/index';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ExamplesCrudComponent } from './examples-crud/examples-crud.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    NotFoundComponent,
    ExamplesCrudComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {
      enableTracing: false
    }),
    BlockUIModule,
    BsDropdownModule.forRoot(),
    ToolsModule
  ],
  providers: [
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
