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



}
