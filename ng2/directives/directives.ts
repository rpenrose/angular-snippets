import { Self, Component, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {NgModel, CORE_DIRECTIVES, FORM_DIRECTIVES, ControlValueAccessor} from '@angular/common';

@Component({
    template: '<input type="text" /><button (click)="clear()" >X</button>',
    selector: 'rjpDatePicker[ngModel]',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export class DatePickerDirective implements ControlValueAccessor, OnInit {
    public cd: NgModel;
    public onChange: any = Function.prototype;
    public onTouched: any = Function.prototype;
    private _activeDate: Date;
    private activeDate: string;
    private el: any;
    private dp: any;
    private jqEl: any;

    constructor(el: ElementRef, @Self() cd: NgModel) {
        this.cd = cd;
        this.el = el;
        // hack
        cd.valueAccessor = this;
    }

    ngOnInit() {
        let that = this;
        this.jqEl = jQuery(this.el.nativeElement).find('input');

        this.dp = this.jqEl.fdatepicker({
            format: 'dd-mm-yyyy',
            disableDblClickSelection: true
        });

        this.dp.on('changeDate', function (ev: any) {
            let theDate = ev.date;
            let formattedDate = that.formatDate(theDate);
            that.cd.viewToModelUpdate(formattedDate);
            that.writeValue(ev.Date);
        });
    };

    clear() {
        this.cd.viewToModelUpdate(null);
        this.writeValue(null);
        this.jqEl.val('');
    }

    // todo: support null value
    public writeValue(value: any): void {
        if (value === this._activeDate) {
            return;
        }
        if (value && value instanceof Date) {
            this.activeDate = value;
            return;
        }

        let theDate = value ? new Date(value) : void 0;
        this.activeDate = this.formatDate(theDate);
    }

    private formatDate(dateVal: any) {
        if (!dateVal) {
            return void 0;
        }

        let yyyy = dateVal.getFullYear().toString();
        let mm = (dateVal.getMonth() + 1).toString(); // getMonth() is zero-based
        let dd = dateVal.getDate().toString();
        let retVal = yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]); // padding
        return retVal;
    };

    public registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
    public registerOnTouched(fn: () => {}): void { this.onTouched = fn; }
}

@Component({
    selector: 'enquiry-status',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: '<span class="badge {{theClass}} action-badge" style="margin : center;">{{textVal}}</span>'
})
export class EnquiryStatusDirective implements OnInit {
    private theClass: string;

    @Input() statusVal: any;
    @Input() textVal: any;
    ngOnInit() {

        let val = parseInt(this.statusVal, 10);
        this.textVal = this.textVal && this.textVal.length > 0 ? this.textVal : 'Undefined';
        switch (val) {
            case 0:
            case 1:
                this.theClass = 'status-open';
                break;
            case 2:
                this.theClass = 'status-offered';
                break;
            case 3:
                this.theClass = 'status-booked';
                break;
            case 4:
                this.theClass = 'status-expired';
                break;
            default:
                this.theClass = 'status-open';
                this.textVal = 'Undefined';
                break;
        }
    }
}

@Component({
    selector: 'supplier-response-status',
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: '<span class="badge {{theClass}}" style="margin : center;">{{textVal}}</span>'
})
export class EnquiryResponseStatusDirective implements OnInit {
    private theClass: string;

    @Input() statusVal: any;
    @Input() textVal: any;

    ngOnInit() {

        let val = !this.statusVal ? 0 : parseInt(this.statusVal, 10);
        this.textVal = !this.textVal ? 'No Response' : this.textVal;

        switch (val) {
            case 0:
            case 1:
                this.theClass = 'status-open';
                break;
            case 2:
                this.theClass = 'status-confirmed';
                break;
            case 3:
                this.theClass = 'status-alternative';
                break;
            case 4:
                this.theClass = 'status-expired';
                break;
            case 5:
                this.theClass = 'status-declined';
                break;
            case 6:
                this.theClass = 'status-offered';
                break;
            case 7:
                this.theClass = 'status-booked';
                break;
        }
    }
}

@Component({
    selector: 'test',
    template: '<p>test</p>'
})

export class TestComponent implements OnInit {
    visible: any;

    constructor() {
        console.log('test constructor');
    }

    ngOnInit() {
        console.log('test init');
    }
}

@Component({
    selector: 'pagination',
    template: require('./directives.pagination.html')
})

export class PaginationComponent implements OnInit {
    @Input() pageNumber: number;
    @Input() hasMorePages: any;
    @Output() pageClicked: any = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    handlePageClick(pageNo: any) {
        this.pageNumber = pageNo;
        this.pageClicked.emit(pageNo);
    }
}
