import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'napFloorPipe'
})
export class FloorPipe implements PipeTransform {
    transform(value: number): number {
        const abs = Math.abs(value);
        const sign = value > 0 ? 1 : -1;
        return sign * Math.floor(abs);
    }
}
