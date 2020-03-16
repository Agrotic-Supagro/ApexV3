import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, Platform } from '@ionic/angular';
import { LocationTrackerService } from '../services/location-tracker.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-parcelle-input',
  templateUrl: './parcelle-input.page.html',
  styleUrls: ['./parcelle-input.page.scss'],
})
export class ParcelleInputPage implements OnInit {

  public isList = false;
  public categorie;
  public nomParcelle;
  public selectParcelle: any[];
  public numberof0value;
  public numberof1value;
  public numberof2value;
  public myDate;
  public dateDay: any = new Date().toLocaleDateString('fr-FR');

  public lng;

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private locationTracker: LocationTrackerService
  ) {
    this.plt.ready().then(() => {
      this.selectParcelle = [];
      this.lng = locationTracker.getLongitude();
    });
   }

  ngOnInit() {
  }

  public closeRognee() {
    // todo
  }

  public closeModal() {
    // todo
  }

  public resetNomParcelle() {
    this.nomParcelle = '';
    this.categorie.list = true;
  }

  public changeClass() {
    this.categorie.list = false;
  }

  public async newNameParcelle() {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle parcelle',
      inputs: [{
        name: 'nomparcelle',
        placeholder: 'nom de la parelle'
      }],
      buttons: [{
          text: 'Annuler',
          role: 'Annuler',
          handler: data => {
            this.nomParcelle = null;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            if (data.nomparcelle === '' || data.nomparcelle.length === 0 || /^\s*$/.test(data.nomparcelle)) {
              this.nomParcelle = null;
            } else {
              this.selectParcelle.push({nom: data.nomparcelle, check: true});
              this.nomParcelle = data.nomparcelle;
              this.categorie.list = false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  public onCancel() {
    this.nomParcelle = null;
    this.categorie.list = true;
  }
}
