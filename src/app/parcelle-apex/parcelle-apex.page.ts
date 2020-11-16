import { Component, OnInit } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatabaseService } from '../services/database.service';
import { Platform, NavParams, AlertController, ModalController, ToastController } from '@ionic/angular';
import { GUIDGenerator } from '../services/guidgenerator.service';
import { DateService } from '../services/dates.service';
import { LocationTrackerService } from '../services/location-tracker.service';
import { UserConfigurationService } from '../services/user-configuration.service';

@Component({
  selector: 'app-parcelle-apex',
  templateUrl: './parcelle-apex.page.html',
  styleUrls: ['./parcelle-apex.page.scss'],
})
export class ParcelleApexPage implements OnInit {

  public isList = false;
  public idParcelle: string = null;
  public nomParcelle: any;
  public selectParcelle = [];
  public myDate: any = new Date().toISOString();
  public lng: number;
  public lat: number;
  public idUser: any;
  public idProprietaire: any;

  public thresholdApex = 50;
  public numberApex = 0;
  public numberApex0 = 0;
  public numberApex1 = 0;
  public numberApex2 = 0;
  public idSession: any;
  public listObservation = [];

  constructor(
    private plt: Platform,
    public vibration: Vibration,
    public toastController: ToastController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    public modalController: ModalController,
    private database: DatabaseService,
    private guid: GUIDGenerator,
    private dateformat: DateService,
    private locationTracker: LocationTrackerService,
    private conf: UserConfigurationService,
  ) {
    this.plt.ready().then(() => {
      this.idUser = this.navParams.data.idUser;
      this.conf.getApexThreshold(this.idUser).then(res => {
        this.thresholdApex = res;
      });
      this.idSession = this.guid.getGuidSess();
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

  public addapex(apexvalue) {
    // Gestion pour la Table Session
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
    // Gestion pour le seuil avant validation de la méthode apex
    this.numberApex ++;
    if (this.numberApex === this.thresholdApex) {
      this.vibration.vibrate(600);
    }
    // Gestion pour la table Observation (liste des observations à sauvegarder)
    this.listObservation.push({
      apex_value: apexvalue,
      latitude: this.locationTracker.getLatitude(),
      longitude: this.locationTracker.getLongitude(),
      id_session: this.idSession,
      id_observateur: this.idUser,
      etat: 0
    });
  }

  public deleteLast() {
    const apexValue = this.listObservation[this.listObservation.length - 1].apex_value;
    console.log(apexValue);
    // Gestion pour la Table Session
    if (apexValue === '2') {
      this.numberApex2--;
    } else {
      if (apexValue === '1') {
        this.numberApex1--;
      } else {
        this.numberApex0--;
      }
    }
    // Gestion pour le seuil avant validation de la méthode apex
    this.numberApex --;
    this.listObservation.pop();
    console.log(this.listObservation);
    this.presentToast('Dernière observation supprimée !');
  }

  public async saveSession() {

    if (this.idParcelle !== null) {
      const dateSession = this.dateformat.getDatetime(this.myDate);
      console.log('>> Save Session - Proprietaire Id : ' + this.idProprietaire);
      console.log('>> Save Session - Parcelle Id : ' + this.idParcelle);
      // tslint:disable-next-line:max-line-length
      console.log('>> Save Session - Info : ' + dateSession + ' | ' + this.numberApex0 + ' ' + this.numberApex1 + ' ' + this.numberApex2);
      console.log('>> Save Session - Geoloc : ' + this.locationTracker.getLatitude() + ' ' + this.locationTracker.getLongitude());
      if (this.numberApex0 === 0 && this.numberApex1 === 0 && this.numberApex2 === 0) {
        console.log('Session unsave !');
        await this.modalController.dismiss();
      } else {
        console.log('Session to save');
        // TABLE Utilisateur_Parcelle
        const dataToUserParcelle = {id_utilisateur: this.idUser, id_parcelle: this.idParcelle, statut:  1, etat: 0};
        this.database.addUserParcelle(dataToUserParcelle);

        // TABLE PARCELLE
        // tslint:disable-next-line:max-line-length
        const dataToParcelle = {id_parcelle: this.idParcelle, nom_parcelle: this.nomParcelle, id_proprietaire: this.idProprietaire, etat: 0};
        this.database.addParcelle(dataToParcelle);

        // TABLE SESSION
        // tslint:disable-next-line:max-line-length
        const dataToSession = {id_session: this.idSession, date_session: dateSession, apex0: this.numberApex0, apex1: this.numberApex1, apex2: this.numberApex2, id_observateur: this.idUser, id_parcelle: this.idParcelle, etat: 0};
        this.database.addSession(dataToSession);

        // TABLE OBSERVATION
        this.database.addObservation(this.listObservation);

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
      console.log('>> Save Session - Info : ' + dateSession + ' | ' + this.numberApex0 + ' ' + this.numberApex1 + ' ' + this.numberApex2);
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
      const dataToSession = {id_session: this.idSession, date_session: dateSession, apex0: 999, apex1: 999, apex2: 999, id_observateur: this.idUser, id_parcelle: this.idParcelle, etat: 0};
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

  public async apexAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Méthode des Apex',
      message: 'Pour calculer les indices, il est nécessaire de réaliser des observations sur au moins '
      + this.thresholdApex + ' apex. Vous n\'avez réalisé pour l\'instant que ' + this.numberApex + ' observations.',
      buttons: ['OK']
    });
    await alert.present();
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

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }

  public onCancel() {
    this.idParcelle = null;
  }
}
