import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'napDate' })
export class NapDatePipe implements PipeTransform {
  transform(date: string, pattern: string): string {
    if (date === '0001-01-01T00:00:00') {
      return '';
    }

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, pattern);
  }
}
