import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Platform, MenuController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ParcelleInputPage } from '../parcelle-input/parcelle-input.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public user: any;
  public parcelles = [];
  public offset = 0;
  public limiteMax = false;

  constructor(
    private plt: Platform,
    private storage: Storage,
    public modalController: ModalController,
    public menuCtrl: MenuController,
    private router: Router,
    private auth: AuthenticationService,
    private database: DatabaseService,
    ) {
    this.plt.ready().then(() => {
      this.storage.get('TOKEN_KEY').then(val => {
        this.database.getCurrentUser(val).then(data => {
          this.user = data;
          console.log('>> Homepage - Info User : ' + this.user.id_utilisateur + ' | ' + this.user.nom);
          const datasql = [this.user.id_utilisateur, this.offset];
          this.database.getAllParcelle(datasql).then( dataParcelle => {
            this.parcelles = this.database.parcelles;
            console.log(this.database.parcelles);
          });
        });
      });
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
   }

  public openParcelleApex() {
    this.router.navigateByUrl('/parcelle-apex');
  }
  public async openParcelleInput() {
    const modal = await this.modalController.create({
      component: ParcelleInputPage,
      componentProps: {
        idUser: this.user.id_utilisateur
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // this.dataReturned = dataReturned.data;
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });
    return await modal.present();
  }

  loadless() {
    if (this.offset !== 0) {
      this.offset -= 5;
    }
    const datasql = [this.user.id_utilisateur, this.offset];
    this.database.getAllParcelle(datasql).then( dataParcelle => {
      this.parcelles = this.database.parcelles;
      console.log(this.database.parcelles);
    });
    this.limiteMax = false;
  }

  loadmore() {
    this.offset += 5;
    const datasql = [this.user.id_utilisateur, this.offset];
    this.database.getAllParcelle(datasql).then( dataParcelle => {
      this.parcelles = this.database.parcelles;
      console.log(this.database.parcelles);
      if (this.parcelles.length === 0) {
        this.limiteMax = true;
      } else {
        this.limiteMax = false;
      }
    });
  }


}
