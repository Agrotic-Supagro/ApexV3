import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
import { ServerService } from '../services/server.service';
import {Validators, FormBuilder } from '@angular/forms';
import { DateService } from '../services/dates.service';
import { UserConfigurationService } from '../services/user-configuration.service';
import { GlobalConstants } from '../common/global-constants';
import { TranslateService } from '@ngx-translate/core';
import { FtpServerService } from '../services/ftp-server.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: any = {};
  isEdit = false;
  isPwd = false;
  isIfv = true;
  threshold: any;
  isLoading: boolean;
  allDataEgg = 0;
  public language : string;
  public previousLanguage : string;
  public languageIconPath : string;
  public supportedLanguages : Map<string, string>;

  public registrationForm = this.formBuilder.group({
    prenom: ['', [Validators.required, Validators.maxLength(256)]],
    nom: ['', [Validators.required, Validators.maxLength(256)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    structure: ['', [Validators.required, Validators.maxLength(256)]]
    }
  );
  public errorMessages = {
    prenom: [
      { type: 'required', message: 'Le prénom est obligatoire ' },
      { type: 'maxlength', message: 'Le prénom ne peut pas comporter plus de 40 caractères' }
    ],
    nom: [
      { type: 'required', message: 'Le nom est obligatoire ' },
      { type: 'maxlength', message: 'Le nom ne peut pas comporter plus de 40 caractères' }
    ],
    email: [
      { type: 'required', message: 'L\'email est obligatoire ' },
      { type: 'pattern', message: 'Veuillez saisir une adresse électronique valide' }
    ]
  };

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
    public loadingController: LoadingController,
    private dateformat: DateService,
    private serveur: ServerService,
    private auth: AuthenticationService,
    private database: DatabaseService,
    private formBuilder: FormBuilder,
    private conf: UserConfigurationService,
    private _translate: TranslateService,
    private ftpService : FtpServerService,
    private nativeStorage: NativeStorage,
  ) {

   }

  ngOnInit() {
    this.storage.get('TOKEN_KEY')
    .then(val => {
      return val;
    })
    .then(email => {
      this.getUser(email);
    });
    this._translateLanguage();
    this.language = GlobalConstants.getLanguageSelected();
    this.previousLanguage = GlobalConstants.getLanguageSelected();
    this.languageIconPath = GlobalConstants.getPathForCountryIcons() + this.language + ".png";
    this.supportedLanguages = GlobalConstants.getSupportedLanguages();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

  async changeLanguage() {
    if(this.language != this.previousLanguage){
      console.log("Languages different");
      if(!GlobalConstants.getTradFilesNeverDownloaded() || GlobalConstants.getDeviceLanguageSupported()){
        console.log("User wants to change language : "+this.language);
        const loading = await this.loadingController.create({
          message: 'Veuillez patienter...',
        });
        loading.present()
        .then(() => {
          this.ftpService.downloadTradContent(this.language)
          .then(() => {
            this.previousLanguage = this.language;
            GlobalConstants.setLanguageSelected(this.language);
            this._translate.use(GlobalConstants.getLanguageSelected());
            this.languageIconPath = GlobalConstants.getPathForCountryIcons() + this.language + ".png";
            //this.deviceService.saveLanguageSelected();
            loading.dismiss();
            this.nativeStorage.setItem('languageSelected', this.language)
            .then(
              () => console.log('Stored Language ! : '+this.language),
              error => console.error('Error storing Language', error)
            );
          })
          .catch(error => {
            console.log("Error while changing language : "+error);
            this.language = this.previousLanguage;
            GlobalConstants.setLanguageSelected(this.language);
            loading.dismiss()
            .then(  async () => {
              const alert = await this.alertCtrl.create({
                header: 'Erreur',
                message: 'Échec du téléchargement de la langue',
                buttons: ['OK']
              });
              await alert.present();
            })
          })
        })
      }
      else{
        this.previousLanguage = this.language;
        GlobalConstants.setLanguageSelected(this.language);
        this._translate.use(GlobalConstants.getLanguageSelected());
        this.languageIconPath = GlobalConstants.getPathForCountryIcons() + this.language + ".png";
        this.nativeStorage.setItem('languageSelected', this.language)
        .then(
          () => console.log('Stored Language ! : '+this.language),
          error => console.error('Error storing Language', error)
        );
      }
    }
  }

  getUser(email) {
    this.database.getCurrentUser(email).then(data => {
      this.user = data;
      this.registrationForm.value.nom = this.user.nom;
      console.log(this.registrationForm);
      console.log('>> Compte - Info User : ' + this.user.id_utilisateur + ' | ' + this.user.nom);
      this.conf.getApexThreshold(this.user.id_utilisateur).then(res => {
        this.threshold = res;
      });
      if (this.user.model_ifv === 0) {
        this.isIfv = true;
      } else {
        this.isIfv = false;
      }
    });
  }

  async sendData() {
    const data = { email: this.user.email, method: 'all', userName: this.user.nom, idUser: this.user.id_utilisateur};
    console.log(data);
    this.serveur.sendData(data).subscribe(async res => {
        if (res.status) {
          this.presentToast('Vos données vous ont été envoyées. Veuillez vérifier votre boite mail.');
        } else {
          this.presentToast('Erreur. Veuillez vérifier que votre email est correct et réessayez.');
        }
    });
  }

  updateUser() {
    const today = this.dateformat.getDatetime(new Date().toISOString());
    const dataUpdate = {
      prenom: this.registrationForm.value.prenom,
      nom: this.registrationForm.value.nom,
      email: this.registrationForm.value.email,
      structure: this.registrationForm.value.structure,
      date_maj: today,
      etat: 0,
      id_utilisateur: this.user.id_utilisateur
    };
    this.database.updateUser(dataUpdate).then(data => {
      if (data) {
        this.presentToast('Informations mises à jours !');
        const dataServer = {
          table: 'utilisateur',
          data: dataUpdate
        };
        console.log(dataServer);
        this.serveur.syncUser(dataServer).subscribe(res => {
          if (res.status) {
            this.database.updateEtatUtilisateur([1, res.idUser]);
          }
        });
        this.isEdit = false;
      }
    });
  }

  updateThreshold() {
    this.conf.updateApexThreshold(this.user.id_utilisateur, this.threshold);
    this.presentToast('Nombre d\'apex éditées');
  }

  receiveData() {
    this.showLoading();
    console.log('>> Recieve Data');
    this.database.recieveData(this.user);
    this.dismissLoader();
    this.presentToast('Vos données ont été téléchargées avec succès');
  }

  async info() {
    const alert = await this.alertCtrl.create({
      header: 'Informations',
      message: ' La fonction d\'<b>envoie</b> des données, vous permet de revevoir par email un fichier (tableur) contenant '
      + 'l\'ensemble de vos données acquises avec l\'application ApexVigne.'
      + '<br /><br />La fonction de <b>synchronisation</b> des données, vous permet de récupérer sur l\'application '
      + 'ApexVigne vos données sauvegarder sur le serveur.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async showLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Veuillez patienter pendant le téléchargement de vos données...',
      spinner: 'circles'
    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort laoding'));
        }
      });
    });
}

  async dismissLoader() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  async changePwd() {
    const alert = await this.alertCtrl.create({
      header: 'Taper votre nouveau mot de passe',
      inputs: [
        {
          name: 'pwd',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Envoyer',
          handler: data => {
            console.log(data);
            if (data.pwd !== '' && data.pwd !== null) {
              const pwd = data.pwd;
              const dataPwd = {mot_de_passe: pwd, email: this.user.email, idUser: this.user.id_utilisateur};
              this.auth.changePassword(dataPwd).subscribe(async res => {
                console.log(res);
                console.log(res.status);
                if (res.status) {
                  this.database.updatePassword(dataPwd);
                  this.user.mdp = pwd;
                  this.isPwd = false;
                  this.presentToast('Mot de passe changé avec succès !');
                } else {
                  this.presentToast('Une erreur c\'est produite, merci de réessayer');
                }
              });
            } else {
              this.presentToast('Mot de passe incorrect, merci d\'en choisir un autre');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  updateIFV() {
    let modelIfv = 0;
    if (!this.isIfv) {
      modelIfv = 1;
    }
    const dataUpdate = [modelIfv, this.user.id_utilisateur];
    this.database.updateIFV(dataUpdate).then(data => {
      if (data) {
        if (this.isIfv) {
          this.presentToast('Modèle IFV activé !');
        } else {
          this.presentToast('Modèle IFV désactivé !');
        }
      }
    });
  }

  get prenom() {
    return this.registrationForm.get('prenom');
  }
  get nom() {
    return this.registrationForm.get('nom');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get mot_de_passe() {
    return this.registrationForm.get('mot_de_passe');
  }
  get structure() {
    return this.registrationForm.get('structure');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  downloadAllData() {
    this.allDataEgg ++;
    if (this.allDataEgg === 5) {
      this.sendAllData();
      this.presentToast('Vos données vont être envoyées à l\'équipe apex');
      this.allDataEgg = 0;
    }
  }

  sendAllData() {
    this.database.sendAlldata(this.user.nom);
  }
}
