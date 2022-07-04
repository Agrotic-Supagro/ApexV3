import { Component, OnInit } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { DatabaseService } from '../services/database.service';
import { Platform, AlertController, ModalController, ToastController } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { GUIDGenerator } from '../services/guidgenerator.service';
import { DateService } from '../services/dates.service';
import { LocationTrackerService } from '../services/location-tracker.service';
import { UserConfigurationService } from '../services/user-configuration.service';
import { ApexInformationComponent } from '../apex-information/apex-information.component';
import { StadePhenologiquePage } from '../stade-phenologique/stade-phenologique.page';
import { CommentairesSessionPage } from '../commentaires-session/commentaires-session.page';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

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

  public commentairetext = '';
  public idStade = '';

  //Trad objects
  error = { key : "error", value : ""};
  lastObsDeleted = { key : "lastObsDeleted", value : ""};
  newParcelInd = { key : "newParcelInd", value : ""};
  okBtn = { key : "okBtn", value : ""};
  markAsToppedQstn = { key : "markAsToppedQstn", value : ""};
  noBtn = { key : "noBtn", value : ""};
  yesBtn = { key : "yesBtn", value : ""};
  apexMethd = { key : "apexMethd", value : ""};
  apexMthMsg1 = { key : "apexMthMsg1", value : ""};
  apexMthMsg2 = { key : "apexMthMsg2", value : ""};
  apexMthMsg3 = { key : "apexMthMsg3", value : ""};
  newParcel = { key : "newParcel", value : ""};
  nameOfParcel = { key : "nameOfParcel", value : ""};
  add = { key : "add", value : ""};
  cancel = { key : "cancel", value : ""};
  tabOfVars = [this.error, this.lastObsDeleted, this.newParcelInd, this.okBtn, this.markAsToppedQstn, this.noBtn, this.yesBtn, this.apexMethd, 
    this.apexMthMsg1, this.apexMthMsg2, this.apexMthMsg3, this.newParcel, this.nameOfParcel, this.add, this.cancel,];

  constructor(
    private plt: Platform,
    public vibration: Vibration,
    public toastController: ToastController,
    // private navParams: NavParams,
    private alertCtrl: AlertController,
    public modalController: ModalController,
    private database: DatabaseService,
    private guid: GUIDGenerator,
    private route: ActivatedRoute,
    private router: Router,
    private dateformat: DateService,
    private locationTracker: LocationTrackerService,
    private conf: UserConfigurationService,
    public popoverCtrl: PopoverController,
    private _translate: TranslateService,
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        console.log('Page Parcelle Input. IdUser :', this.router.getCurrentNavigation().extras.state.idUser);
        this.idUser = this.router.getCurrentNavigation().extras.state.idUser;
        this.conf.getApexThreshold(this.idUser).then(res => {
          this.thresholdApex = res;
        });
        this.idSession = this.guid.getGuidSess();
      }
    });
    // FOR MODAL
    /*this.plt.ready().then(() => {
      this.idUser = this.navParams.data.idUser;
      this.conf.getApexThreshold(this.idUser).then(res => {
        this.thresholdApex = res;
      });
      this.idSession = this.guid.getGuidSess();
    });*/
  }

  ngOnInit() {
    this._translateLanguage();
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

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(var elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
        component: ApexInformationComponent,
        event: ev,
        animated: true,
        showBackdrop: true
    });
    popover.onDidDismiss().then((result) => {
      console.log(result.data);
      if (result.data === 'deleteLastObs') {
        this.deleteLast();
      } else if (result.data === 'ecimee') {
        this.saveEcimee();
      } else if (result.data === 'stadePheno') {
        this.stadePheno();
      } else if (result.data === 'commentaire') {
        this.commentaire();
      }
    });
    return await popover.present();
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
    this.presentToast(this.lastObsDeleted.value);
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
        // CLOSE FOR MODAL
        // await this.modalController.dismiss();
        // CLOSE FOR PAGE
        this.router.navigateByUrl('/home');
      } else {
        console.log('Session to save');
        // TABLE Utilisateur_Parcelle
        const dataToUserParcelle = {id_utilisateur: this.idUser, id_parcelle: this.idParcelle, statut:  1, etat: 0};
        this.database.addUserParcelle(dataToUserParcelle);

        // TABLE session_stadepheno
        const dataToSessionStade = {id_session: this.idSession, id_stade: this.idStade, etat: 0};
        this.database.addSessionStadePheno(dataToSessionStade);

        // TABLE session_stadepheno
        const dataToCommentaire = {txt_comm: this.commentairetext, id_session: this.idSession, etat: 0};
        this.database.addCommentaire(dataToCommentaire);

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

        // CLOSE FOR MODAL
        // await this.modalController.dismiss();
        // CLOSE FOR PAGE
        this.router.navigateByUrl('/home');
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: this.error.value,
        message: this.newParcelInd.value,
        buttons: [this.okBtn.value]
      });
      await alert.present();
    }
  }

  public async parcelleEcimee() {
    const alertEcimee = await this.alertCtrl.create({
      message: this.markAsToppedQstn.value,
      buttons: [
        {
          text: this.noBtn.value,
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.yesBtn.value,
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

      // TABLE session_stadepheno
      const dataToSessionStade = {id_session: this.idSession, id_stade: this.idStade, etat: 0};
      this.database.addSessionStadePheno(dataToSessionStade);

      // TABLE session_stadepheno
      const dataToCommentaire = {txt_comm: this.commentairetext, id_session: this.idSession, etat: 0};
      this.database.addCommentaire(dataToCommentaire);

      // CLOSE FOR MODAL
      // await this.modalController.dismiss();
      // CLOSE FOR PAGE
      this.router.navigateByUrl('/home');
    } else {
      const alert = await this.alertCtrl.create({
        header: this.error.value,
        message: this.newParcelInd.value,
        buttons: [this.okBtn.value]
      });
      await alert.present();
    }
  }

  public async apexAlert() {
    const alert = await this.alertCtrl.create({
      header: this.apexMethd.value,
      message: this.apexMthMsg1.value
      + this.thresholdApex + this.apexMthMsg2.value + this.numberApex + this.apexMthMsg3.value,
      buttons: [this.okBtn.value]
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
      header: this.newParcel.value,
      inputs: [{
        name: 'nom_parcelle',
        placeholder: this.nameOfParcel.value
      }],
      buttons: [{
          text: this.cancel.value,
          role: 'Annuler',
          handler: data => {
            this.idParcelle = null;
            console.log('Cancel clicked');
          }
        },
        {
          text: this.add.value,
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

  public async stadePheno() {
    const modal = await this.modalController.create({
      component: StadePhenologiquePage,
      componentProps: {
        idStade: this.idStade,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log('Return stade Id', dataReturned);
      this.idStade = dataReturned.data;
    });
    return await modal.present();
  }

  public async commentaire() {
    const modal = await this.modalController.create({
      component: CommentairesSessionPage,
      componentProps: {
        commentairetext : this.commentairetext,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
      this.commentairetext = dataReturned.data.commentaire;
    });
    return await modal.present();
  }

}
