import { Parcelle } from './../services/parcelle-service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Platform, MenuController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ParcelleInputPage } from '../parcelle-input/parcelle-input.page';
import { Chart } from 'chart.js';
import { ParcelleApexPage } from '../parcelle-apex/parcelle-apex.page';
import { ParcelleInfoPage } from '../parcelle-info/parcelle-info.page';
import { UserConfigurationService } from '../services/user-configuration.service';
import { ServerService } from '../services/server.service';
import { NetworkService } from '../services/network.service';
import { LocationTrackerService } from '../services/location-tracker.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

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
  jwt: any;

  //Trad objects
  recvPacelData = { key : "recvPacelData", value : ""};
  onEmail = { key : "onEmail", value : ""};
  cancel  = { key : "cancel", value : ""};
  send = { key : "send", value : ""};
  dataSent  = { key : "dataSent", value : ""};
  dataNotSent  = { key : "dataNotSent", value : ""};
  needNetwork  = { key : "needNetwork", value : ""};
  shareParcel  = { key : "shareParcel", value : ""};
  byEmail  = { key : "byEmail", value : ""};
  email  = { key : "email", value : ""};
  share  = { key : "share", value : ""};
  sucessShare  = { key : "sucessShare", value : ""};
  emailForShareError  = { key : "emailForShareError", value : ""};
  deleteParcelQst  = { key : "deleteParcelQst", value : ""};
  warningDelete  = { key : "warningDelete", value : ""};
  noBtn  = { key : "noBtn", value : ""};
  delete  = { key : "delete", value : ""};
  parcelDeleted  = { key : "parcelDeleted", value : ""};
  activateLoc  = { key : "activateLoc", value : ""};
  gpsMsg  = { key : "gpsMsg", value : ""};
  activateLocRights  = { key : "activateLocRights", value : ""};
  rightsMsg  = { key : "activateLocRights", value : ""};
  graphFullGrowth  = { key : "graphFullGrowth", value : ""};
  graphSlowedGrowth  = { key : "graphSlowedGrowth", value : ""};
  graphGrowthArrest  = { key : "graphGrowthArrest", value : ""};
  comment  = { key : "comment", value : ""};
  okBtn  = { key : "okBtn", value : ""};
  tabOfVars = [ this.recvPacelData, this.onEmail, this.cancel, this.send, this.dataSent, this.dataNotSent, this.needNetwork, this.shareParcel, 
    this.byEmail, this.email, this.share, this.sucessShare, this.emailForShareError, this.deleteParcelQst, this.warningDelete, this.noBtn, this.delete, this.parcelDeleted, 
    this.activateLoc, this.gpsMsg, this.activateLocRights, this.rightsMsg, this.graphFullGrowth, this.graphSlowedGrowth, this.graphGrowthArrest, this.comment, this.okBtn];

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    public modalController: ModalController,
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private router: Router,
    private serveur: ServerService,
    private networkService: NetworkService,
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private database: DatabaseService,
    private conf: UserConfigurationService,
    private trakcerService: LocationTrackerService,
    private _translate: TranslateService,
    ) {
      setInterval(() => {
        if (this.networkService.getCurrentNetworkStatus() === 0) {
          this.database.syncData();
        }
     }, 20000);
    }

  ngOnInit(){
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(var elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
  }

  ionViewWillEnter() {
    this._translateLanguage();
    this.menuCtrl.enable(true);
    this.storage.get('TOKEN_KEY')
    .then(val => {
      return val;
    })
    .then(token => {
      if (token != null) {
        this.database.getCurrentUser(token).then(data => {
          this.user = data;
          console.log(this.user);
          console.log('>> Homepage - Info User : ' + this.user.id_utilisateur + ' | ' + this.user.nom);
          console.log('>> Homepage - IFV : ' + this.user.model_ifv);
        })
        .then(_ => {
          const datasql = [this.user.id_utilisateur, this.offset];
          this.database.getAllParcelle(datasql, this.filter).then( data => {
            // this.parcelles = this.changeFilter(this.database.parcelles);
            this.parcelles = this.database.parcelles;
            console.log(this.parcelles);
          });
        })
        .then(res => {
          this.computeChart();
          if (this.networkService.getCurrentNetworkStatus() === 0) {
            this.database.recieveParcelleShared(this.user);
            this.database.syncData();
          }
        });
      }
    });
  }

  ionViewDidEnter() {
  }

  public async sendParcelle(parcelle, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: this.recvPacelData.value + parcelle.nom_parcelle + this.onEmail.value,
      buttons: [
        {
          text: this.cancel.value,
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.send.value,
          handler: (alertData) => {
            const data = { email: this.user.email, method: 'parcelle', idParcelle: parcelle.id_parcelle, userName: this.user.nom};
            if (this.networkService.getCurrentNetworkStatus() === 0) {
              this.serveur.sendData(data).subscribe(async res => {
                if (res.status) {
                  this.presentToast(this.dataSent);
                } else {
                  this.presentToast(this.dataNotSent.value);
                }
            });
            } else {
            this.presentToast(this.needNetwork.value);
            }
            slidingItem.close();
          }
        }
      ]
    });
    await alert.present();
  }

  public async shareParcelle(parcelle, slidingItem) {
    const alert = await this.alertCtrl.create({
      header: this.shareParcel.value + parcelle.nom_parcelle + this.byEmail.value,
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: this.email.value
        }
      ],
      buttons: [
        {
          text: this.cancel.value,
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.share.value,
          handler: (alertData) => {
            const dataShare = {
              idOwner: this.user.id_utilisateur,
              nomUser: this.user.nom,
              idParcelle: parcelle.id_parcelle,
              nomParcelle: parcelle.nom_parcelle,
              email: alertData.email
            };
            if (this.networkService.getCurrentNetworkStatus() === 0) {
              this.serveur.shareParcelle(dataShare).subscribe(res => {
                if (res.status) {
                  this.presentToast(this.sucessShare.value);
                } else {
                  this.presentToast(this.emailForShareError.value);
                }
              });
            } else {
              this.presentToast(this.needNetwork.value);
            }

            slidingItem.close();
          }
        }
      ]
    });
    await alert.present();
  }

  public async deleteParcelle(idParcelle) {
    const alert = await this.alertCtrl.create({
      header: this.deleteParcelQst.value,
      message: this.warningDelete.value,
      buttons: [
        {
          text: this.noBtn.value,
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.delete.value,
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
                this.presentToast(this.parcelDeleted.value);
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

  public async parcelleInfoPage(parcelle) {
    const navigationExtras: NavigationExtras = {
      state: {
        user: this.user,
        // idUser: this.user.id_utilisateur,
        parcelle: parcelle
      }
    };
    this.router.navigate(['parcelle-info'], navigationExtras);
  }

  public async openParcelleInputPage() {
    const navigationExtras: NavigationExtras = {
      state: {
        idUser: this.user.id_utilisateur
      }
    };
    this.router.navigate(['/parcelle-input'], navigationExtras);
  }

  public async openParcelleApexPage() {
    this.trakcerService.askToTurnOnGPS().then(async gps => {
      console.log('GPS : ' + gps.locationServicesEnabled);
      console.log('Auth : ' + gps.authorization);
      if (gps.locationServicesEnabled && (gps.authorization == 1 || gps.authorization == 2)) {
        const navigationExtras: NavigationExtras = {
          state: {
            idUser: this.user.id_utilisateur
          }
        };
        this.router.navigate(['/parcelle-apex'], navigationExtras);
      } else if(!gps.locationServicesEnabled){
        const alert = await this.alertCtrl.create({
          header: this.activateLoc.value,
          // tslint:disable-next-line:max-line-length
          message: this.gpsMsg.value,
          buttons: [this.okBtn.value]
        });
        await alert.present();
      }
      else if(gps.authorization == 0) {
        const alert = await this.alertCtrl.create({
          header: this.activateLocRights.value,
          // tslint:disable-next-line:max-line-length
          message: this.rightsMsg.value,
          buttons: [this.okBtn.value]
        });
        await alert.present();
      }
    });

  }

  public async openParcelleApex() {
    console.log(this.user);
    this.trakcerService.askToTurnOnGPS().then(async gps => {
      console.log('GPS : ' + gps.locationServicesEnabled);
      console.log('Auth : ' + gps.authorization);
      if (gps.locationServicesEnabled && (gps.authorization == 1 || gps.authorization == 2)) {
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
      } else if(!gps.locationServicesEnabled) {
        const alert = await this.alertCtrl.create({
          header: this.activateLoc.value,
          // tslint:disable-next-line:max-line-length
          message: this.gpsMsg.value,
          buttons: [this.okBtn.value]
        });
        await alert.present();
      }
      else if(gps.authorization == 0) {
        const alert = await this.alertCtrl.create({
          header: this.activateLocRights.value,
          // tslint:disable-next-line:max-line-length
          message: this.rightsMsg.value,
          buttons: [this.okBtn.value]
        });
        await alert.present();
      }
    });


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

  reloadData() {
    const datasql = [this.user.id_utilisateur, this.offset];
    this.database.getAllParcelle(datasql, this.filter).then( dataParcelle => {
      this.parcelles = this.database.parcelles;
    }).then(res => {
      this.computeChart();
    });
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
    this.database.getAllParcelle(datasql, this.filter).then( (dataParcelle: any) => {
      this.parcelles = this.database.parcelles;
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
        this.database.getSongs(datasql, this.filter).then(_ => {
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
    if (data.ifv_classe !== 4) {
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
              // tslint:disable-next-line:max-line-length
              labels: [data.apex[0] + this.graphFullGrowth.value, data.apex[1] + this.graphSlowedGrowth.value, data.apex[2] + this.graphGrowthArrest.value],
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

    this.database.getStadePhenobyId(data.id_parcelle).then(res => {
      console.log('Résultat Stade : ', res);
      this.parcelles.find(item => item.nom_parcelle === data.nom_parcelle).stade = res;
    });
    this.database.getCommentaireId(data.id_parcelle).then(res => {
      console.log('Résultat Commentaire : ', res);
      if (res) {
        this.parcelles.find(item => item.nom_parcelle === data.nom_parcelle).commentaire = res;
      }
    });
  }

  async showCommentaire(parcelle) {
    const alert = await this.alertCtrl.create({
      header: this.comment.value,
      // tslint:disable-next-line:max-line-length
      message: parcelle.commentaire,
      buttons: [this.okBtn.value]
    });
    await alert.present();
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
