import { Parcelle } from './../services/parcelle-service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Platform, MenuController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ParcelleInputPage } from '../parcelle-input/parcelle-input.page';
import { Chart } from 'chart.js';
import { ParcelleApexPage } from '../parcelle-apex/parcelle-apex.page';
import { ParcelleInfoPage } from '../parcelle-info/parcelle-info.page';
import { UserConfigurationService } from '../services/user-configuration.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('barChart', {static: true}) barChart;

  public user: any;
  public parcelles: Parcelle[] = [];
  public offset = 0;
  public limiteMax = false;
  Data: any[] = [];
  url: any;
  filter = 'date';
  canvasIdIncrement = 0;

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    public modalController: ModalController,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private router: Router,
    private auth: AuthenticationService,
    private database: DatabaseService,
    private conf: UserConfigurationService,
    ) {
      this.storage.get('TOKEN_KEY')
      .then(val => {
        return val;
      })
      .then(email => {
        this.database.getCurrentUser(email).then(data => {
          this.user = data;
          console.log(this.user);
          console.log('>> Homepage - Info User : ' + this.user.id_utilisateur + ' | ' + this.user.nom);
          console.log('>> Homepage - IFV : ' + this.user.model_ifv);
        })
        .then(_ => {
          const datasql = [this.user.id_utilisateur, 0];
          this.database.getAllParcelle(datasql, this.filter).then( data => {
            // this.parcelles = this.changeFilter(this.database.parcelles);
            this.parcelles = this.database.parcelles;
            console.log(this.parcelles);
          });
        })
        .then(res => {
          this.computeChart();
        });
      });
    }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  public async sendParcelle(parcelle, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Recevoir les données de la parcelle ' + parcelle.nom_parcelle + ' par email ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Envoyer',
          handler: (alertData) => {
            this.presentToast('Données envoyées avec succès sur votre email !');
            slidingItem.close();
          }
        }
      ]
    });
    await alert.present();
  }

  public async shareParcelle(parcelle, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: 'Partager la parcelle ' + parcelle.nom_parcelle + ' par email :',
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'email'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Partager',
          handler: (alertData) => {
            console.log(alertData.email);
            this.presentToast('Parcelle partagée avec succès. En attente de validation!');
            slidingItem.close();
          }
        }
      ]
    });
    await alert.present();
  }

  public async deleteParcelle(idParcelle) {
    const alert = await this.alertCtrl.create({
      header: 'Voulez-vous supprimer cette parcelle ?',
      message: 'Cette action est irréversible',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            console.log('Confirm Okay');
            this.database.updateParcelleBeforeDelete(idParcelle).then(data => {
              if (data) {
                this.parcelles = null;
                this.offset = 0;
                const datasql = [this.user.id_utilisateur, this.offset];
                this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
                  this.parcelles = this.database.parcelles;
                  console.log(this.database.parcelles);
                  this.limiteMax = false;
                }).then(res => {
                  this.computeChart();
                  // this.changeFilter();
                });
                this.presentToast('Parcelle supprimée avec succès!');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }


  public async parcelleInfo(parcelle) {
    const modal = await this.modalController.create({
      component: ParcelleInfoPage,
      componentProps: {
        idUser: this.user.id_utilisateur,
        parcelle: parcelle
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.offset = 0;
      const datasql = [this.user.id_utilisateur, this.offset];
      this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
        this.parcelles = this.database.parcelles;
        console.log('Dissmiss Parcelle Info');
        this.limiteMax = false;
      }).then(res => {
        this.computeChart();
        // this.changeFilter();
      });
      // this.dataReturned = dataReturned.data;
      // alert('Modal Sent Data :'+ dataReturned);
    });
    return await modal.present();
  }

  public async openParcelleApex() {
    const modal = await this.modalController.create({
      component: ParcelleApexPage,
      componentProps: {
        idUser: this.user.id_utilisateur
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.offset = 0;
      const datasql = [this.user.id_utilisateur, this.offset];
      this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
        this.parcelles = this.database.parcelles;
        console.log('Dissmiss Parcelle Apex');
        console.log(this.database.parcelles);
        this.limiteMax = false;
      }).then(res => {
        this.computeChart();
        // this.changeFilter();
      });
      // this.dataReturned = dataReturned.data;
      // alert('Modal Sent Data :'+ dataReturned);
    });
    return await modal.present();
  }

  public async openParcelleInput() {
    const modal = await this.modalController.create({
      component: ParcelleInputPage,
      componentProps: {
        idUser: this.user.id_utilisateur
      }
    });
    modal.onDidDismiss().then((dataReturned) => {
      this.offset = 0;
      const datasql = [this.user.id_utilisateur, this.offset];
      this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
        this.parcelles = this.database.parcelles;
        console.log(this.database.parcelles);
        this.limiteMax = false;
      }).then(res => {
        this.computeChart();
        // this.changeFilter();
      });
    });
    return await modal.present();
  }

  loadless() {
    if (this.offset !== 0) {
      this.offset -= 5;
    }
    const datasql = [this.user.id_utilisateur, this.offset];

    this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
      this.parcelles = this.database.parcelles;
      // console.log(this.database.parcelles);
      console.log(dataParcelle);
    }).then(res => {
      this.computeChart();
      // this.changeFilter();
    });
    this.limiteMax = false;
  }

  loadmore() {
    this.offset += 5;
    const datasql = [this.user.id_utilisateur, this.offset];
    this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
      this.parcelles = this.database.parcelles;
      console.log(this.database.parcelles);
      if (this.parcelles.length === 0) {
        this.limiteMax = true;
      } else {
        this.limiteMax = false;
      }
    }).then(res => {
      this.computeChart();
      // this.changeFilter();
    });
  }

  computeChart() {
    console.log('Compute chart');
    // tslint:disable-next-line:prefer-for-of
    const datasql = [this.user.id_utilisateur, this.offset];
    this.database.dbState().subscribe((res) => {
      if (res) {
        this.database.getSongs(datasql).then(_ => {
          this.database.fetchSongs().subscribe(item => {
            if (item.length > 0) {
              item.forEach(element => {
                this.makeChart(element);
              });
            }
          });
        });
      }
    });

  }

  makeChart(data) {
    const idCanvas = 'cn_' + this.canvasIdIncrement;
    const para = document.createElement('canvas');
    para.id = idCanvas;
    const element = document.getElementById(data.nom_parcelle);
    element.appendChild(para);
    const canvas = document.getElementById(idCanvas) as HTMLCanvasElement;

    // SI ON VEUT REMPLACER LE CHART PAR SON IMAGE
    // const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    // canvas.style.display = 'none';

    const ctx = canvas.getContext('2d');

    const toSave = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [data.apex[0] + '% Pleine croissance', data.apex[1] + '% Croissance ralentie', data.apex[2] + '% Croissance arrétée'],
            datasets: [{
              backgroundColor: [
                '#2C6109',
                '#6E9624',
                '#C5DC68'
              ],
              borderColor: [
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)',
                'rgba(255, 255, 255, 1)'
              ],
              data: data.apex,
              borderWidth: 1
            }]
       },
       options: {
        // suppression info au click
        tooltips: {enabled: false},
        hover: {mode: null},
        // ------------------------
        animation: {
          duration: 0
        },
        title: {
          display: false,
        },
        responsive: true,
        // SI ON VEUT METTRE EN IMAGE, PREFERER :
        // responsive: true,
        // height: 80,
        // width: 150,
        maintainAspectRatio: false,
        legend: {
          position: 'left',
          onClick: (e) => e.stopPropagation()
        }
    }
    });
    canvas.classList.add('dynamiqueChart');
    this.canvasIdIncrement ++;
    // IMAGE A PARTIR DU CHARTJS
    // const x = document.getElementById(data.nom_parcelle);
    // x.setAttribute('src', toSave.toBase64Image());
    // toSave.destroy();
  }

  changeFilter(data) {
      console.log(data);
      // this.filter = ev.target.value;
      if (this.filter === 'date') {
        // tslint:disable-next-line:only-arrow-functions
        data.sort(function(a, b) {
          if (a.date_session > b.date_session) {
              return -1;
          }
          if (b.date_session > a.date_session) {
              return 1;
          }
          return 0;
        });
        console.log('filtre par dates');
    } else {
      // tslint:disable-next-line:only-arrow-functions
      data.sort(function(a, b) {
        if (a.nom_parcelle > b.nom_parcelle) {
            return 1;
        }
        if (b.nom_parcelle > a.nom_parcelle) {
            return -1;
        }
        return 0;
      });
      console.log('filtre par noms');
    }
      this.parcelles = data;
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
