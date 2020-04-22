import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class DateService {

  constructor() {
  }

  public getDatetime(date) {
    date = date.split('T')[0];
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const sec = new Date().getSeconds();
    return date + ' ' + hour + ':' + minute + ':' + sec;
  }

  public setDateFr(date) {
    date = date.split(' ')[0].split('-');
    return date[2] + '/' + date[1] + '/' + date[0];
  }


}
