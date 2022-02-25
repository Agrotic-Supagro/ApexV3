import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datesExtra'
})
export class DatesExtraPipe implements PipeTransform {

  transform(value: any, arg): any {
    if (arg === 'dates') {
      var arr1 = value.split(' ');
      var arr2 = arr1[0].split('-');
      return arr2[2] + '/' + arr2[1] + '/' + arr2[0];
    }
    else if (arg === 'heures') {
      var arr1 = value.split(' ');
      var arr2 = arr1[1].split(':');
      return arr2[0] + ':' + arr2[1];
    }
    return value;
  }

}
