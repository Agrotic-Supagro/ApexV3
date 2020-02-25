import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = {
    email: 'toto@gmail.com',
    mot_de_passe: 'toto'
  };

  constructor(private auth: AuthenticationService,
              private alertCtrl: AlertController,
              private router: Router,
              public toastController: ToastController,
              private emailComposer: EmailComposer,
              private database: DatabaseService
              ) { }

  ngOnInit() {

  }

  login() {
    console.log(this.credentials);
    this.auth.login(this.credentials).subscribe(async res => {
      console.log('in login return: ', res);
      if (res.status) {
        this.router.navigateByUrl('/home');
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
            this.auth.resetPassword(dataPwd).subscribe(async res => {
              if (res.status) {
                this.database.updatePassword(dataPwd);
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
