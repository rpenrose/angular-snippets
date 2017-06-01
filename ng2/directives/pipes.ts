import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'refDataName' })
export class RefDataNamePipe implements PipeTransform {
    transform(val: number, allRefDataItems: any) {
        return this.transformInternal(val, allRefDataItems);
    }

    transformInternal(val: number, allRefDataItems: any) {
        let item = this.find(allRefDataItems, val);
        return item ? item.name : '';
    }

    find(arr: Array<any>, val: number): any {
        let returnVal: any = null;
        arr.forEach((itm: any) => {
            if (itm.id == val) {
                returnVal = itm;
            }
        });
        return returnVal;
    }
}


@Pipe({ name: 'dateStringFormat' })
export class DateStringFormatPipe implements PipeTransform {

    private isValidDate(d: any) {

        if (Object.prototype.toString.call(d) === '[object Date]') {
            if (isNaN(d.getTime())) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    transform(val: string) {

        let dateOnly = val.substr(0, 10);
        let dateVal: any = new Date(dateOnly);

        if (dateVal && this.isValidDate(dateVal)) {
            let day = dateVal.getDate();
            let month = dateVal.getMonth() + 1;
            let year = dateVal.getFullYear();
            return this.pad(day) + '/' + this.pad(month) + '/' + year.toString().substr(2, 2);
        }

        return '';
    }

    pad(val: any) {
        if (val > 9) {
            return val.toString();
        }
        return '0' + val;
    }
}
