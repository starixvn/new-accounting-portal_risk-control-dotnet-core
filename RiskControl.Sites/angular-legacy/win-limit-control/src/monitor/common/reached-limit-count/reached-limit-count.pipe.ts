import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'napReachedLimitCountPipe'
})
export class ReachedLimitCountPipe implements PipeTransform {
    transform(value: number): string {

        return value > 1 ? '(' + value + ')' : '';
    }
}
