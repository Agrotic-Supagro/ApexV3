import { Component, OnInit } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatabaseService } from '../services/database.service';

const THRESHOLD_APEX = 50;

@Component({
  selector: 'app-parcelle-apex',
  templateUrl: './parcelle-apex.page.html',
  styleUrls: ['./parcelle-apex.page.scss'],
})
export class ParcelleApexPage implements OnInit {

  public thresholdApex = THRESHOLD_APEX;
  public numberApex = 0;
  public numberApex0;
  public numberApex1;
  public numberApex2;
  public isList = false;
  public categorie;
  public nomParcelle;
  public selectParcelle;
  constructor(
    public vibration: Vibration,
    private database: DatabaseService,
  ) {
    console.log(this.database.user.nom);
  }

  ngOnInit() {
  }

  public addapex(apexvalue) {
    if (apexvalue === '2') {
      this.numberApex2++;
      this.vibration.vibrate(80);
    } else {
      if (apexvalue === '1') {
        this.numberApex1++;
        this.vibration.vibrate(220);
      } else {
        this.numberApex0++;
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
