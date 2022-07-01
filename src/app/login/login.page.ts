import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController, MenuController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { GlobalConstants } from '../common/global-constants';
import { TranslateService } from '@ngx-translate/core';
import { FtpServerService } from '../services/ftp-server.service';
import { LoadingController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /*credentials = {
    email: 'toto@gmail.com',
    mot_de_passe: 'toto'
  };*/
  credentials = {
    email: '',
    mot_de_passe: ''
  };

  public nbUser2020 = 0;
  public nbParcelle2020 = 0;
  public userOld: any = [];
  public language : string;
  public previousLanguage : string;
  public languageIconPath : string;
  public supportedLanguages : Map<string, string>;

  //Trad objects
  errorConn = { key : "errorConn", value : ""};
  wrongID = { key : "wrongID", value : ""};
  reInitMdp  = { key : "reInitMdp", value : ""};
  yourEmail = { key : "yourEmail", value : ""};
  emailSent  = { key : "emailSent", value : ""};
  emailDoesntExist  = { key : "emailDoesntExist", value : ""};
  error  = { key : "error", value : ""};
  waitMsg  = { key : "waitMsg", value : ""};
  okBtn  = { key : "okBtn", value : ""};
  dlMsg  = { key : "dlMsg", value : ""};
  cancel  = { key : "cancel", value : ""};
  send  = { key : "send", value : ""};
  tabOfVars = [ this.errorConn,  this.wrongID, this.reInitMdp, this.yourEmail, this.emailSent, this.emailDoesntExist, this.error, this.waitMsg,
    this.okBtn, this.dlMsg, this.cancel, this.send,];

  constructor(private auth: AuthenticationService,
              private alertCtrl: AlertController,
              private router: Router,
              public toastController: ToastController,
              public menuCtrl: MenuController,
              private database: DatabaseService,
              private _translate: TranslateService,
              private ftpService : FtpServerService,
              public loadingController: LoadingController,
              private nativeStorage: NativeStorage,
              ) { }

  ngOnInit() {
    this._translateLanguage();
    this.language = GlobalConstants.getLanguageSelected();
    this.previousLanguage = this.language;
    this.languageIconPath = GlobalConstants.getPathForCountryIcons() + this.language + ".png";
    this.supportedLanguages = GlobalConstants.getSupportedLanguages();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(var elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
  }

  async changeLanguage() {
    if(this.language != this.previousLanguage){
      console.log("Languages different");
      if(!GlobalConstants.getTradFilesNeverDownloaded() || GlobalConstants.getDeviceLanguageSupported()){
        console.log("User wants to change language : "+this.language);
        const loading = await this.loadingController.create({
          message: this.waitMsg.value,
        });
        loading.present()
        .then(() => {
          this.ftpService.downloadTradContent(this.language)
          .then(() => {
            this.previousLanguage = this.language;
            GlobalConstants.setLanguageSelected(this.language);
            this._translateLanguage();
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
                header: this.error.value,
                message: this.dlMsg.value,
                buttons: [this.okBtn.value]
              });
              await alert.present();
            })
          })
        })
      }
      else{
        this.previousLanguage = this.language;
        GlobalConstants.setLanguageSelected(this.language);
        this._translateLanguage();
        this.languageIconPath = GlobalConstants.getPathForCountryIcons() + this.language + ".png";
        this.nativeStorage.setItem('languageSelected', this.language)
        .then(
          () => console.log('Stored Language ! : '+this.language),
          error => console.error('Error storing Language', error)
        );
      }
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.database.getNombreUtilisateur().then(data => {
      this.nbUser2020 = data;
      console.log('Login Page > nb user 2020 :', this.nbUser2020);
    });
    this.database.getNombreParcelle().then(data => {
      this.nbParcelle2020 = data;
      console.log('Login Page > nb parcelle 2020 :', this.nbParcelle2020);
    });
    this.database.retrieveUserV1().then(data => {
      this.userOld = data;
      console.log('Login Page > nb user 2019 :', this.userOld);
    });
   }

  login() {
    console.log('formulaire :', this.credentials);
    this.auth.login(this.credentials).subscribe(async res => {
      console.log('in login return: ', res);
      if (res.status) {
        const navigationExtras: NavigationExtras = {
          state: {
            jwt: res.jwt
          }
        };
        console.log(Array.isArray(this.userOld), this.userOld, this.nbUser2020, this.nbParcelle2020);
        if (Array.isArray(this.userOld) && this.nbUser2020 < 2 && this.nbParcelle2020 === 0) {
          console.log('---------------- Load old data 2019');
          if (this.userOld[0].email.toLowerCase() === this.credentials.email.toLowerCase()) {
            console.log('---------------- Go to populate DB');
            this.database.populateDB(res.data.id_utilisateur).then(_ => {
              console.log('---------------- End populate DB');
              this.router.navigateByUrl('/home');
            });
          }
        } else {
          this.router.navigateByUrl('/home');
        }

        /*if (this.userOld[0].email === this.credentials.email) {
          // this.database.populateDB(res.data.id_utilisateur);
        }*/


      } else {
        const alert = await this.alertCtrl.create({
          header: this.errorConn.value,
          message: this.wrongID.value,
          buttons: [this.okBtn.value]
        });
        await alert.present();
      }
    });
  }

  forgetpwd() {
    console.log('ToDo > mot de passe oublié');
    this.presentPrompt();
  }

  drop() {
    this.database.droptable();
  }
  create() {
    this.database.open();
  }

  insert() {
    const data = {id_utilisateur: '4d1h3b977-0611-4a14-8673-6cb3fbd3ce61',
    prenom: 'D',
    nom: 'S',
    email: 'd@gt.gg',
    mot_de_passe: 'x',
    structure: 's'
  };
    this.database.addUser(data);
  }

  async presentPrompt() {
    const alert = await this.alertCtrl.create({
      header: this.reInitMdp.value,
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: this.yourEmail.value
        }
      ],
      buttons: [
        {
          text: this.cancel.value,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.send.value,
          handler: data => {
            const pwd = Math.random().toString(36).slice(-8);
            const dataPwd = {mot_de_passe: pwd, email: data.email};
            console.log(dataPwd);
            this.auth.resetPassword(dataPwd).subscribe(async res => {
              if (res.status) {
                console.log('## Return reset pwd :', res.data);
                // this.database.updatePassword(dataPwd);
                this.database.updateUserPassword(res.data);
                this.presentToast(this.emailSent.value);
              } else {
                this.presentToast(this.emailDoesntExist.value);
              }
            });

          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
