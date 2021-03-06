import { Component } from '@angular/core';

import { CONSTANTS } from './shared';

@Component({
    selector: 'as-main-app',
    templateUrl: 'app/app.html'
})
export class AppComponent {
    public appBrand: string;
    pageTitle: string = 'Smart Album';
    constructor() {
        this.appBrand = CONSTANTS.MAIN.APP.BRAND;
    }
}
