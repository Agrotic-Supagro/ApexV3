import { DateService } from './../services/dates.service';
import { GUIDGenerator } from './../services/guidgenerator.service';
import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, Platform, ModalController, NavParams } from '@ionic/angular';
import { LocationTrackerService } from '../services/location-tracker.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-parcelle-input',
  templateUrl: './parcelle-input.page.html',
  styleUrls: ['./parcelle-input.page.scss'],
})
export class ParcelleInputPage implements OnInit {

  public isList = false;
  public idParcelle: string = null;
  public nomParcelle: any;
  public selectParcelle = [];
  public myDate: any = new Date().toISOString();
  public lng: number;
  public lat: number;
  public idUser: any;
  public idProprietaire: any;

  public numberof0value: number;
  public numberof1value: number;
  public numberof2value: number;

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private guid: GUIDGenerator,
    private dateformat: DateService,
    private locationTracker: LocationTrackerService,
    private navParams: NavParams
  ) {
    this.plt.ready().then(() => {
      this.idUser = this.navParams.data.idUser;
    });
   }

  ngOnInit() {
    this.selectParcelle = [];
    this.database.getListParcelle().then( data => {
      if (data === null) {
        console.log(data);
      } else {
        console.log(data);
        this.selectParcelle = data;
        this.isList = true;
      }
    });
    if (this.selectParcelle.length > 0) { this.isList = true; }
  }

  public async parcelleEcimee() {
    const alertEcimee = await this.alertCtrl.create({
      message: 'Marquer la parcelle comme écimée ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Oui',
          handler: () => {
            this.saveEcimee();
          }
        }
      ]
    });
    await alertEcimee.present();
  }

  public async saveEcimee() {
    if (this.idParcelle !== null) {
      const dateSession = this.dateformat.getDatetime(this.myDate);
      console.log('>> Save Session - Proprietaire Id : ' + this.idProprietaire);
      console.log('>> Save Session - Parcelle Id : ' + this.idParcelle);
      // tslint:disable-next-line:max-line-length
      console.log('>> Save Session - Info : ' + dateSession + ' | ' + this.numberof0value + ' ' + this.numberof1value + ' ' + this.numberof2value);
      console.log('>> Save Session - Geoloc : ' + this.locationTracker.getLatitude() + ' ' + this.locationTracker.getLongitude());
      console.log('>> Save Session - Parcelle Ecimmée');
      // TABLE Utilisateur_Parcelle
      const dataToUserParcelle = {id_utilisateur: this.idUser, id_parcelle: this.idParcelle, statut:  1, etat: 0};
      this.database.addUserParcelle(dataToUserParcelle);

      // TABLE PARCELLE
      // tslint:disable-next-line:max-line-length
      const dataToParcelle = {id_parcelle: this.idParcelle, nom_parcelle: this.nomParcelle, id_proprietaire: this.idProprietaire, etat: 0};
      this.database.addParcelle(dataToParcelle);

      // TABLE SESSION
      // tslint:disable-next-line:max-line-length
      const dataToSession = {id_session: this.guid.getGuidSess(), date_session: dateSession, apex0: 999, apex1: 0, apex2: 0, id_observateur: this.idUser, id_parcelle: this.idParcelle, etat: 0};
      this.database.addSession(dataToSession);

      await this.modalController.dismiss();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Erreur',
        message: 'Veuillez choisir un nom de parcelle ou en ajouter un nouveau !',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  public async saveSession() {
    if (this.numberof0value == null) {this.numberof0value = 0; }
    if (this.numberof1value == null) {this.numberof1value = 0; }
    if (this.numberof2value == null) {this.numberof2value = 0; }

    if (this.idParcelle !== null) {
      const dateSession = this.dateformat.getDatetime(this.myDate);
      console.log('>> Save Session - Proprietaire Id : ' + this.idProprietaire);
      console.log('>> Save Session - Parcelle Id : ' + this.idParcelle);
      // tslint:disable-next-line:max-line-length
      console.log('>> Save Session - Info : ' + dateSession + ' | ' + this.numberof0value + ' ' + this.numberof1value + ' ' + this.numberof2value);
      console.log('>> Save Session - Geoloc : ' + this.locationTracker.getLatitude() + ' ' + this.locationTracker.getLongitude());
      if (this.numberof0value === 0 && this.numberof1value === 0 && this.numberof2value === 0) {
        console.log('Session unsave !');
        await this.modalController.dismiss();
      } else {
        console.log('Session to save');
        const dataToUserParcelle = {id_utilisateur: this.idUser, id_parcelle: this.idParcelle, statut:  1, etat: 0};
        this.database.addUserParcelle(dataToUserParcelle);
        // tslint:disable-next-line:max-line-length
        const dataToParcelle = {id_parcelle: this.idParcelle, nom_parcelle: this.nomParcelle, id_proprietaire: this.idProprietaire, etat: 0};
        this.database.addParcelle(dataToParcelle);
        // tslint:disable-next-line:max-line-length
        const dataToSession = {id_session: this.guid.getGuidSess(), date_session: dateSession, apex0: this.numberof0value, apex1: this.numberof1value, apex2: this.numberof2value, id_observateur: this.idUser, id_parcelle: this.idParcelle, etat: 0};
        this.database.addSession(dataToSession);
        await this.modalController.dismiss();
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Erreur',
        message: 'Veuillez choisir un nom de parcelle ou en ajouter un nouveau !',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  public resetNomParcelle() {
    this.idParcelle = null;
    this.nomParcelle = null;
    this.idProprietaire = null;
  }

  public changeParcelle() {
    console.log('>> ' + this.idParcelle);
    const resultat = this.selectParcelle.find( data => data.id_parcelle === this.idParcelle);
    this.nomParcelle = resultat.nom_parcelle;
    this.idProprietaire = resultat.id_proprietaire;
  }

  public async newNameParcelle() {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle parcelle',
      inputs: [{
        name: 'nom_parcelle',
        placeholder: 'nom de la parelle'
      }],
      buttons: [{
          text: 'Annuler',
          role: 'Annuler',
          handler: data => {
            this.idParcelle = null;
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            if (data.nom_parcelle === '' || data.nom_parcelle.length === 0 || /^\s*$/.test(data.nom_parcelle)) {
              this.idParcelle = null;
            } else {
              const guidParcelle = this.guid.getGuid();
              this.selectParcelle.push({id_parcelle: guidParcelle, nom_parcelle: data.nom_parcelle, id_proprietaire: this.idUser});
              this.idParcelle = guidParcelle;
              this.nomParcelle = data.nom_parcelle;
              this.idProprietaire = this.idUser;
              this.isList = true;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  public onCancel() {
    this.idParcelle = null;
  }
}
