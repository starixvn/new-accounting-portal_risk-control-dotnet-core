import { Pipe, PipeTransform } from '@angular/core';
import { LimitLevel } from '../../../common/filter';

@Pipe({
    name: 'napFlagPipe'
})
export class FlagPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case LimitLevel.Black:
                return 'text-black';
            case LimitLevel.Grey:
                return 'text-grey';
            case LimitLevel.Orange:
                return 'text-orange';
            case LimitLevel.Yellow:
                return 'text-yellow';
            case LimitLevel.Red:
                return 'text-red';
            default:
                return '';
        }
    }
}
