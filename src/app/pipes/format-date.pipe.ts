import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDate',
    standalone: false
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string, format: string = 'yyyy-MM-dd'): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value; // Retorna el valor original si la fecha es inválida
    }

    const options: Intl.DateTimeFormatOptions = {
      year: format.includes('y') ? (format.includes('yy') ? '2-digit' : 'numeric') : undefined,
      month: format.includes('M') ? (format.includes('MM') ? '2-digit' : 'short') : undefined,
      day: format.includes('d') ? (format.includes('dd') ? '2-digit' : 'numeric') : undefined,
      hour: format.includes('h') ? (format.includes('hh') ? '2-digit' : 'numeric') : undefined,
      minute: format.includes('m') ? (format.includes('mm') ? '2-digit' : 'numeric') : undefined,
      second: format.includes('s') ? (format.includes('ss') ? '2-digit' : 'numeric') : undefined,
      timeZone: 'UTC'
    };

    return date.toLocaleString('en-US', options);
  }
}