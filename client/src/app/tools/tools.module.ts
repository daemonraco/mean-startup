import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from './paginator/paginator.component';
import { SagasuComponent } from './sagasu/sagasu.component';

import { StringifyPipe } from './pipes/stringify.pipe';

@NgModule({
    declarations: [
        PaginatorComponent,
        SagasuComponent,
        StringifyPipe
    ],
    exports: [
        PaginatorComponent,
        SagasuComponent,
        StringifyPipe
    ],
    imports: [
        BrowserModule,
        FormsModule
    ]
})
export class ToolsModule { }
