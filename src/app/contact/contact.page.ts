import { ServerService } from './../services/server.service';
import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {

  public emailtext = '';
  public emailUser = '';
  constructor(
    private server: ServerService,
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    private database: DatabaseService
    ) {
      this.plt.ready().then(() => {
        this.storage.get('TOKEN_KEY').then(val => {
          this.database.getCurrentUser(val).then(data => {
            console.log('Contact page >> ' + data.email);
            this.emailUser = data.email;
          });
        });
      });
  }

  sendEmail() {
    if (this.emailtext !== '') {
      const dataEmail = { email: this.emailUser, corps_email: this.emailtext};
      this.server.sendEmail(dataEmail).subscribe(async res => {
        if (res.status) {
          this.presentToast('L\'email a été envoyé.');
        } else {
          this.presentToast('Erreur dans l\'envoie de l\'email. Veuillez essayer de nouveau');
        }
      });
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
