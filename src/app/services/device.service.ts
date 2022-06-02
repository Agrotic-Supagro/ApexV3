import { Injectable } from '@angular/core';
import { Device, GetLanguageCodeResult } from '@capacitor/device';

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
