import { Injectable } from '@angular/core';
import { Device, GetLanguageCodeResult } from '@capacitor/device';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() { }

  async getDeviceLanguage() : Promise<string> {
    const language = await (await Device.getLanguageCode()).value;
    return language;
  }

}
