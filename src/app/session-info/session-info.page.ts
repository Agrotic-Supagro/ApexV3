import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DateService } from '../services/dates.service';
import { StadePhenologiquePage } from '../stade-phenologique/stade-phenologique.page';
import { CommentairesSessionPage } from '../commentaires-session/commentaires-session.page';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-session-info',
  templateUrl: './session-info.page.html',
  styleUrls: ['./session-info.page.scss'],
})
export class SessionInfoPage implements OnInit {
  idUser: any;
  user: any;
  idSession: any;
  parcelle: any;
  session: any;
  myDate = new Date().toISOString();;
  numberof0value: number;
  numberof1value: number;
  numberof2value: number;
  ecimee = false;
  navigationExtras: NavigationExtras;

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
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        console.log('received data from Parcelle-info', this.router.getCurrentNavigation().extras.state);
        console.log('Page Parcelle Input. IdUser :', this.router.getCurrentNavigation().extras.state.user.id_utilisateur);
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.idUser = this.router.getCurrentNavigation().extras.state.user.id_utilisateur;
        this.idSession = this.router.getCurrentNavigation().extras.state.idSession;
        this.parcelle = this.router.getCurrentNavigation().extras.state.parcelle;

        console.log('User', this.user);
        console.log('IdUser', this.idUser);
        console.log('IdSession', this.idSession);
        console.log('IdParcelle', this.parcelle);

        this.navigationExtras = {
          state: {
            user: this.user,
            parcelle: this.parcelle
          }
        };

        this.database.getInfoSession(this.idSession).then( data => {
          if (data === null) {
            console.log(data);
          } else {
            console.log('data Session', data);
            this.session = data;
            this.numberof0value = data.apex0;
            this.numberof1value = data.apex1;
            this.numberof2value = data.apex2;
            //console.log('ooooo' + new Date(data.date_session).toISOString());
            console.log('uuuu '+ new Date().toISOString());
            this.myDate = new Date('2022-01-07').toISOString();
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
    });
    // FOR MODAL
    /*this.idUser = this.navParams.data.idUser;
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
    });*/
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
      console.log('Save Session ECIME :');
      console.log('Date ', new Date(this.myDate).toISOString());
      const dateSession = this.dateformat.getDatetime(new Date(this.myDate).toISOString());
      console.log('Convert date', dateSession);
      const today = this.dateformat.getDatetime(new Date().toISOString());
      // tslint:disable-next-line:max-line-length
      console.log('>> Update Session - Info : ' + dateSession + ' | ' + this.numberof0value + ' ' + this.numberof1value + ' ' + this.numberof2value);
      console.log('>> Update Session - Parcelle Ecimmée');

      // TABLE COMMENTAIRE
      const dataToCommentaire = {txt_comm: this.commentairetext,  etat: 0, id_comm: this.idComm};
      this.database.updateCommentaire(dataToCommentaire).then(async _ => {
        // TABLE Session_StadePheno
        const dataToSessionStade = {id_stade: this.idStade,  etat: 0, id_session: this.idSession};
        this.database.updateLienSessionStade(dataToSessionStade).then(async __ => {
          // TABLE SESSION
          // tslint:disable-next-line:max-line-length
          const dataToSession = {date_maj: today, date_session: dateSession, apex0: 999, apex1: 999, apex2: 999, etat: 0, id_session: this.idSession};
          this.database.updateSession(dataToSession).then(async ___ => {
            // CLOSE FOR MODAL
            // await this.modalController.dismiss();
            // CLOSE FOR PAGE
            this.router.navigate(['/parcelle-info'], this.navigationExtras);
          });
        });
      });
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
      // CLOSE FOR MODAL
      // await this.modalController.dismiss();
      // CLOSE FOR PAGE
      this.router.navigate(['/parcelle-info'], this.navigationExtras);
    } else {
      console.log('Update Session >');
      // TABLE COMMENTAIRE
      const dataToCommentaire = {txt_comm: this.commentairetext,  etat: 0, id_comm: this.idComm};
      this.database.updateCommentaire(dataToCommentaire).then(async ___ => {
        // TABLE Session_StadePheno
        const dataToSessionStade = {id_stade: this.idStade,  etat: 0, id_session: this.idSession};
        this.database.updateLienSessionStade(dataToSessionStade).then(async __ => {
          // TABLE SESSION
          // tslint:disable-next-line:max-line-length
          const dataToSession = {date_maj: today, date_session: dateSession, apex0: this.numberof0value, apex1: this.numberof1value, apex2: this.numberof2value, etat: 0, id_session: this.idSession};
          this.database.updateSession(dataToSession).then(async _ => {
            // CLOSE FOR MODAL
            // await this.modalController.dismiss();
            // CLOSE FOR PAGE
            this.router.navigate(['/parcelle-info'], this.navigationExtras);
          });
        });
      });
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
