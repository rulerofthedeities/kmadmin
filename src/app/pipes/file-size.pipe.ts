import {Pipe, PipeTransform} from '@angular/core';
/*
 * Convert bytes into largest possible unit.
 * Takes a precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  transform(bytes: number = 0, precision: number = 2): string {
    let returnValue = '?',
        unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }
    if (unit === 0) {
      precision = 0;
    }

    if (!isNaN(parseFloat(String(bytes))) && isFinite(bytes)) {
      returnValue = bytes.toFixed( + precision ) + ' ' + this.units[unit];
    }

    return returnValue;
  }
}
