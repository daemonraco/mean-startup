import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    titlePrefix: string = 'MEAN Start-up Client';
    title: string;
    bodyClass: string;
    mainClass: string;

    constructor() {
        this.setTitle('');
        this.setBodyClass('');
        this.setMainClass('container');
    }

    public setBodyClass(klass: string): void {
        this.bodyClass = klass;
    }
    public setMainClass(klass: string): void {
        this.mainClass = klass;
    }
    public setTitle(title: string): void {
        this.title = this.titlePrefix + (title ? ` - ${title}` : '');
    }
}
