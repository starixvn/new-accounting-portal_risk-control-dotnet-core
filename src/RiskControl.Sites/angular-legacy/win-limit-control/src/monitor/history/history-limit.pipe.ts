import { Pipe, PipeTransform } from '@angular/core';
import { NumberFormatHelper, NumberFormatType } from 'nap-components/number-format';
import { HistoryModel } from './history.model';
@Pipe({
    name: 'napHistoryLimitPipe'
})
export class HistoryLimitPipe implements PipeTransform {
    transform(value: number, actionName: string): string {
        return actionName.indexOf('Unblock') >= 0
            ? ''
            : NumberFormatHelper.format(value, NumberFormatType.Integer);
    }
}
