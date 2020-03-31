import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DateService {

  constructor() {
  }

  public getDatetime(date) {
    return date.slice(0, 19).replace('T', ' ');
  }

  public setDateFr(date) {
    date = date.split(' ')[0].split('-');
    return date[2] + '/' + date[1] + '/' + date[0];
  }


}
