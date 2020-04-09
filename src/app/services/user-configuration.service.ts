import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {

  constructor(
    private  storage: Storage,
  ) {

  }

  getApexThreshold(idUser) {
    return this.storage.get(idUser).then(data => {
      if (data) {
        return data.threshold;
      } else {
        this.storage.set(idUser, {threshold: 50});
        return 50;
      }
    }, err => {
      console.log('Storage error : ', err);
      });
  }
  updateApexThreshold(idUser, threshold) {
    this.storage.set(idUser, {threshold: threshold});
  }
}
