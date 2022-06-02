import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController, MenuController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DeviceService } from '../services/device.service';
import { GlobalConstants } from '../common/global-constants';
import { TranslateService } from '@ngx-translate/core';

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
  public languageIconPath : string;

  constructor(private auth: AuthenticationService,
              private alertCtrl: AlertController,
              private router: Router,
              public toastController: ToastController,
              public menuCtrl: MenuController,
              private database: DatabaseService,
              private deviceService : DeviceService,
              private _translate: TranslateService,
              ) { }

  ngOnInit() {
    this.deviceService.getDeviceLanguage().then( (lang : string) => {
      console.log("Langage du device : "+lang);
      this.language = lang;
      GlobalConstants.setLanguageSelected(lang);
      this.languageIconPath = "../../assets/imgs/" + lang + ".png";
      }
      
    );
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

  changeLanguage() {
    console.log("change : "+this.language)
    GlobalConstants.setLanguageSelected(this.language);
    this._translate.use(GlobalConstants.getLanguageSelected());
    this.languageIconPath = "../../assets/imgs/" + GlobalConstants.getLanguageSelected() + ".png";
  }

  ionViewWillEnter() {
    this._translateLanguage();
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
          header: 'Échec de l\'authentification',
          message: 'Identifiants incorrects !',
          buttons: ['OK']
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
      header: 'Réinitialiser le mot de passe',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Votre email'
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
            const pwd = Math.random().toString(36).slice(-8);
            const dataPwd = {mot_de_passe: pwd, email: data.email};
            console.log(dataPwd);
            this.auth.resetPassword(dataPwd).subscribe(async res => {
              if (res.status) {
                console.log('## Return reset pwd :', res.data);
                // this.database.updatePassword(dataPwd);
                this.database.updateUserPassword(res.data);
                this.presentToast('L\'email a été envoyé. Veuillez vérifier votre boite mail.');
              } else {
                this.presentToast('Erreur. L\'email n`\'existe pas. Veuillez vous inscrire.');
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
