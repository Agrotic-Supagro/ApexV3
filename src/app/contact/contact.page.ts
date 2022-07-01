import { ServerService } from './../services/server.service';
import { Component, OnInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {

  public emailtext = '';
  public emailUser = '';

   //Trad var
   emailSent : string = "";
   emailSentError : string = "";

  constructor(
    private server: ServerService,
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    private database: DatabaseService,
    private _translate: TranslateService,
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

  ngOnInit(){
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    this._translate.get("emailSent").subscribe( res => {
      this.emailSent = res;
    })
    this._translate.get("emailSentError").subscribe( res => {
      this.emailSentError = res;
    })
  }

  sendEmail() {
    if (this.emailtext !== '') {
      const dataEmail = { email: this.emailUser, corps_email: this.emailtext};
      this.server.sendEmail(dataEmail).subscribe(async res => {
        if (res.status) {
          this.presentToast(this.emailSent);
        } else {
          this.presentToast(this.emailSentError);
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
