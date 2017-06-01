import { Component, OnInit } from '@angular/core';
import { ApiClient } from '../api.client';


@Component({
    selector: 'spinner',
    template: '<div *ngIf=\"visible\" class=\"spinner-wrapper\" ><div class=\"spinner\"></div></div>',
    styles: [require('./spinner.component.css')],
})

export class SpinnerComponent implements OnInit {
    visible: any;
    _apiClient: ApiClient;

    constructor(apiClient: ApiClient ) {
        let that = this;
        this._apiClient = apiClient;
        this._apiClient.beginAsync.subscribe(
            () => {
                that.visible = true;
            });
        this._apiClient.endAsync.subscribe(
            () => {
                that.visible = false;
            });
    }

    ngOnInit() {
    }

}

