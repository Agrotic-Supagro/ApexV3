import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DateService } from '../services/dates.service';
import { StadePhenologiquePage } from '../stade-phenologique/stade-phenologique.page';
import { CommentairesSessionPage } from '../commentaires-session/commentaires-session.page';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.page.html',
  styleUrls: ['./session-info.page.scss'],
})
export class SessionInfoPage implements OnInit {
  idUser: any;
  idSession: any;
  session: any;
  myDate: any;
  numberof0value: number;
  numberof1value: number;
  numberof2value: number;
  ecimee = false;

  public idComm = '';
  public commentairetext = '';
  public idStade = '';

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private dateformat: DateService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.idUser = this.navParams.data.idUser;
    this.idSession = this.navParams.data.idSession;
    this.database.getInfoSession(this.idSession).then( data => {
      if (data === null) {
        console.log(data);
      } else {
        console.log(data);
        this.session = data;
        this.numberof0value = data.apex0;
        this.numberof1value = data.apex1;
        this.numberof2value = data.apex2;
        this.myDate = data.date_session;
        this.idStade = data.id_stade;
        this.commentairetext = data.txt_comm;
        this.idComm = data.id_comm;
        console.log(this.session);
        if (this.numberof0value === 999) {
          this.ecimee = true;
          this.numberof0value = null;
          this.numberof1value = null;
          this.numberof2value = null;
        }
      }
    });
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
      const dateSession = this.dateformat.getDatetime(this.myDate);
      const today = this.dateformat.getDatetime(new Date().toISOString());
      // tslint:disable-next-line:max-line-length
      console.log('>> Update Session - Info : ' + dateSession + ' | ' + this.numberof0value + ' ' + this.numberof1value + ' ' + this.numberof2value);
      console.log('>> Update Session - Parcelle Ecimmée');

      // TABLE SESSION
      // tslint:disable-next-line:max-line-length
      const dataToSession = {date_maj: today, date_session: dateSession, apex0: 999, apex1: 999, apex2: 999, etat: 0, id_session: this.idSession};
      this.database.updateSession(dataToSession);
      // TABLE COMMENTAIRE
      const dataToCommentaire = {txt_comm: this.commentairetext,  etat: 0, id_comm: this.idComm};
      this.database.updateCommentaire(dataToCommentaire);

      // TABLE Session_StadePheno
      const dataToSessionStade = {id_stade: this.idStade,  etat: 0, id_session: this.idSession};
      this.database.updateLienSessionStade(dataToSessionStade);

      await this.modalController.dismiss();
  }

  public async saveSession() {
    if (this.numberof0value == null) {this.numberof0value = 0; }
    if (this.numberof1value == null) {this.numberof1value = 0; }
    if (this.numberof2value == null) {this.numberof2value = 0; }

    console.log('Date ', new Date(this.myDate).toISOString());
    const dateSession = this.dateformat.getDatetime(new Date(this.myDate).toISOString());
    console.log('Convert date', dateSession);
    const today = this.dateformat.getDatetime(new Date().toISOString());

    // tslint:disable-next-line:max-line-length
    console.log('>> UPDATE Session - Info : ' + dateSession + ' | ' + this.numberof0value + ' ' + this.numberof1value + ' ' + this.numberof2value);
    if (this.numberof0value === 0 && this.numberof1value === 0 && this.numberof2value === 0) {
      console.log('Session unsave !');
      await this.modalController.dismiss();
    } else {
      console.log('Update Session >');
      // TABLE COMMENTAIRE
      const dataToCommentaire = {txt_comm: this.commentairetext,  etat: 0, id_comm: this.idComm};
      this.database.updateCommentaire(dataToCommentaire);

      // TABLE Session_StadePheno
      const dataToSessionStade = {id_stade: this.idStade,  etat: 0, id_session: this.idSession};
      this.database.updateLienSessionStade(dataToSessionStade);

      // TABLE SESSION
      // tslint:disable-next-line:max-line-length
      const dataToSession = {date_maj: today, date_session: dateSession, apex0: this.numberof0value, apex1: this.numberof1value, apex2: this.numberof2value, etat: 0, id_session: this.idSession};
      this.database.updateSession(dataToSession).then(async _ => {
        await this.modalController.dismiss();
      }
      );
    }
  }

  public async stadePheno() {
    const modal = await this.modalController.create({
      component: StadePhenologiquePage,
      componentProps: {
        idStade: this.idStade,
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned);
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
