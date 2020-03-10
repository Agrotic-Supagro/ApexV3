import { Component, OnInit } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';


const THRESHOLD_APEX = 50;

@Component({
  selector: 'app-parcelle-apex',
  templateUrl: './parcelle-apex.page.html',
  styleUrls: ['./parcelle-apex.page.scss'],
})
export class ParcelleApexPage implements OnInit {

  public thresholdApex = THRESHOLD_APEX;
  public numberApex = 0;
  public numberof0value;
  public numberof1value;
  public numberof2value;
  public isList = false;
  public categorie;
  public nomParcelle;
  public selectParcelle;
  constructor(
    public vibration: Vibration
  ) { }

  ngOnInit() {
  }

  public addvalue(apexvalue) {
    if (apexvalue === '2') {
      this.numberof2value++;
      this.vibration.vibrate(80);
    } else {
      if (apexvalue === '1') {
        this.numberof1value++;
        this.vibration.vibrate(220);
      } else {
        this.numberof0value++;
        this.vibration.vibrate(80);
      }
    }
    this.numberApex ++;
    if (this.numberApex === this.thresholdApex) {
      this.vibration.vibrate(600);
    }

  }

  public closeRognee() {
    // todo
  }

  public apexAlert() {
    // todo
  }

  public closeModal() {
    // todo
  }

  public resetNomParcelle() {
    // todo
  }

  public changeClass() {
    // todo
  }

  public addParcelle() {
    // todo
  }

  public onCancel() {
    // todo
  }
}
