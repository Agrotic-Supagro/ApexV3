import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DateService } from '../services/dates.service';
import { Chart } from 'chart.js';
import { SessionInfoPage } from '../session-info/session-info.page';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ServerService } from '../services/server.service';
import { NetworkService } from '../services/network.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-parcelle-info',
  templateUrl: './parcelle-info.page.html',
  styleUrls: ['./parcelle-info.page.scss'],
})
export class ParcelleInfoPage implements OnInit {
  @ViewChild('lineCanvasCroissance', {static: true}) lineCanvasCroissance;
  @ViewChild('lineCanvasContrainte', {static: true}) lineCanvasContrainte;
  public lineChartContrainte: any;
  public lineChart: any;

  idUser: any;
  parcelle: any;
  infoSession: any;
  user: any;
  emailForShare: any = null;
  public selectParcelle = [];

  isDelete = false;
  isRename = false;
  isShare = false;
  isIFV = true;

  newNameParcelle = null;
  public myDate: any = new Date().toISOString();

  //Trad objects
  error = { key : "error", value : ""};
  sameNameMsg = { key : "sameNameMsg", value : ""};
  sucessShare = { key : "sucessShare", value : ""};
  emailForShareError = { key : "emailForShareError", value : ""};
  needNetwork = { key : "needNetwork", value : ""};
  nullEmailForShare = { key : "nullEmailForShare", value : ""};
  successRenameParcel = { key : "successRenameParcel", value : ""};
  deleteSessionQst = { key : "deleteSessionQst", value : ""};
  noBtn = { key : "noBtn", value : ""};
  delete = { key : "delete", value : ""};
  successDeleteObs = { key : "successDeleteObs", value : ""};
  deleteParcelQst = { key : "deleteParcelQst", value : ""};
  warningDelete = { key : "warningDelete", value : ""};
  parcelDeleted = { key : "parcelDeleted", value : ""};
  infoHeader = { key : "infoHeader", value : ""};
  okBtn = { key : "okBtn", value : ""};
  shareParcelInfo = { key : "shareParcelInfo", value : ""};
  graphFullGrowth = { key : "graphFullGrowth", value : ""};
  graphSlowedGrowth = { key : "graphSlowedGrowth", value : ""};
  graphGrowthArrest = { key : "graphGrowthArrest", value : ""};
  growthInd = { key : "growthInd", value : ""};
  percentApex = { key : "percentApex", value : ""};
  waterStressLvl = { key : "waterStressLvl", value : ""};
  absent = { key : "absent", value : ""};
  moderate = { key : "moderate", value : ""};
  strong = { key : "strong", value : ""};
  strict = { key : "strict", value : ""};
  tabOfVars = [ this.sameNameMsg, this.error, this.sucessShare, this.emailForShareError, this.needNetwork, this.nullEmailForShare, this.successRenameParcel, this.deleteSessionQst,
    this.noBtn, this.delete, this.successDeleteObs, this.deleteParcelQst, this.warningDelete, this.parcelDeleted, this.infoHeader, this.okBtn, 
    this.shareParcelInfo, this.graphFullGrowth, this.graphSlowedGrowth, this.graphGrowthArrest, this.growthInd, this.percentApex, this.waterStressLvl,
    this.absent, this.moderate, this.strong, this.strict];

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private serveur: ServerService,
    private networkService: NetworkService,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private dateformat: DateService,
    private _translate: TranslateService,
    // private navParams: NavParams
  ) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        // this.user = this.router.getCurrentNavigation().extras.state.user;
        this.user = this.router.getCurrentNavigation().extras.state.user;
        console.log('## Parcelle info. User :', this.user);
        this.idUser = this.router.getCurrentNavigation().extras.state.user.id_utilisateur;

        if (this.user.model_ifv === 0) {
          this.isIFV = true;
        } else {
          this.isIFV = false;
        }

        this.parcelle = this.router.getCurrentNavigation().extras.state.parcelle;
        this.database.getInfoParcelle(this.parcelle.id_parcelle).then( data => {
          if (data === null) {
            console.log(data);
          } else {
            console.log('InfoParcelle : ', data);
            this.infoSession = data;
            this.makeChartCroissance(data);
            if (this.isIFV) {
              this.makeChartContrainte(data);
            }
          }
        });
      }
    });

    /*this.plt.ready().then(() => {
      this.initInfoParcelle();
    });*/
  }

  ngOnInit() {
    this.selectParcelle = [];
    this._translateLanguage();
    this.database.getListParcelle().then( data => {
      if (data === null) {
        console.log(data);
      } else {
        console.log(data);
        this.selectParcelle = data;
      }
    });
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(const elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
    GlobalConstants.absent = this.absent.value;
    GlobalConstants.moderate = this.moderate.value;
    GlobalConstants.strong = this.strong.value;
    GlobalConstants.strict = this.strict.value;
  }

  public initInfoParcelle() {
    /*console.log('init info parcelle');
    this.idUser = this.navParams.data.idUser;
    this.parcelle = this.navParams.data.parcelle;
    this.database.getInfoParcelle(this.parcelle.id_parcelle).then( data => {
      if (data === null) {
        console.log(data);
      } else {
        console.log(data);
        this.infoSession = data;
        console.log(this.infoSession);
        this.makeChartCroissance(data);
        this.makeChartContrainte(data);
      }
    });*/
    this.database.getInfoParcelle(this.parcelle.id_parcelle).then( data => {
      if (data === null) {
        console.log(data);
      } else {
        console.log(data);
        this.infoSession = data;
        console.log(this.infoSession);
        this.makeChartCroissance(data);
        this.makeChartContrainte(data);
      }
    });
  }

  public async shareParcelle() {
    if (this.emailForShare !== null && this.emailForShare !== '') {
      const dataShare = {
        idOwner: this.user.id_utilisateur,
        nomUser: this.user.nom,
        idParcelle: this.parcelle.id_parcelle,
        nomParcelle: this.parcelle.nom_parcelle,
        email: this.emailForShare
        // parcelle: this.parcelle
      };
      if (this.networkService.getCurrentNetworkStatus() === 0) {
        console.log(dataShare);
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
    } else {
      this.presentToast(this.nullEmailForShare.value);
    }
    this.isShare = false;
  }
  public renameParcelle() {
    let sameNameFound = false;
    if (this.newNameParcelle === '' || this.newNameParcelle === 0 || /^\s*$/.test(this.newNameParcelle) || this.newNameParcelle === null) {
      // mettre une alerte
    }
    for(const parcel of this.selectParcelle ){
      if (parcel.nom_parcelle.toLowerCase() == this.newNameParcelle.toLowerCase()){
        sameNameFound = true;
      }
    }
    if(!sameNameFound){
      const dataUpdateParcelle = {
        nom_parcelle: this.newNameParcelle,
        date_maj: this.dateformat.getDatetime(this.myDate),
        etat: 0,
        id_parcelle: this.parcelle.id_parcelle
      };
      this.database.updateParcelle(dataUpdateParcelle).then(data => {
        if (data) {
          this.parcelle.nom_parcelle = this.newNameParcelle;
          this.newNameParcelle = null;
          this.isRename = false;
          this.presentToast(this.successRenameParcel.value);
        }
      });
    } 
    else {
      this.sameNameAlert();
    }
  }

  public async sameNameAlert() {
    const alert = await this.alertCtrl.create({
      header: this.error.value,
      message: this.sameNameMsg.value,
      buttons: [this.okBtn.value]
    });
    await alert.present();
  }

  public async openEditSessionPage(idSession) {
    const navigationExtras: NavigationExtras = {
      state: {
        user: this.user,
        idSession: idSession,
        parcelle: this.parcelle
      }
    };
    console.log('Data send to edit-sessin ', navigationExtras);
    this.router.navigate(['/session-info'], navigationExtras);
  }

  public async editSession(idSession) {
    const modal = await this.modalController.create({
      component: SessionInfoPage,
      componentProps: {
        idUser: this.idUser,
        idSession: idSession
      },
      backdropDismiss: true
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log('close modal edit parcelle');
      this.initInfoParcelle();
    })
    .catch(e => console.log(e));
    return await modal.present();
  }

  public async deleteSession(idSession) {
    const alert = await this.alertCtrl.create({
      header: this.deleteSessionQst.value,
      buttons: [
        {
          text: this.noBtn.value,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.delete.value,
          handler: () => {
            console.log('Confirm Okay');
            this.database.updateSessionBeforeDelete(idSession).then(data => {
              if (data) {
                this.initInfoParcelle();
                this.presentToast(this.successDeleteObs.value);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  public async deleteParcelle() {
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
            this.database.updateParcelleBeforeDelete(this.parcelle.id_parcelle).then(async data => {
              if (data) {
                this.router.navigateByUrl('/home');
                this.presentToast(this.parcelDeleted.value);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  public closePage() {
    this.router.navigateByUrl('/home');
  }

  async help() {
    const alert = await this.alertCtrl.create({
      header: this.infoHeader.value,
      message: this.shareParcelInfo.value,
      buttons: [this.okBtn.value]
    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  public makeChartCroissance(dataSession) {
    this.lineChart = new Chart(this.lineCanvasCroissance.nativeElement, {
      type: 'line',
      data: {
        labels: dataSession.dateSession,
        datasets: [{
            label: 'iC-Apex',
            yAxisID: 'A',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(242, 142, 146, 0.2)',
            borderColor: 'rgb(242, 142, 146)',
            borderCapStyle: 'square',
            borderDash: [], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: 'white',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(242, 142, 146)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: dataSession.ica
          },
          {
            label: this.graphFullGrowth.value,
            yAxisID: 'B',
            fill: true,
            hidden: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(247, 201, 161, 0.2)',
            borderColor: 'rgb(247, 201, 161)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: 'white',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(247, 201, 161)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: dataSession.purcentApex0
          },
          {
            label: this.graphSlowedGrowth.value,
            yAxisID: 'B',
            fill: true,
            hidden: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(144, 190, 184, 0.2)',
            borderColor: 'rgb(144, 190, 184)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: 'white',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(144, 190, 184)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: dataSession.purcentApex1
          },
          {
            label: this.graphGrowthArrest.value,
            yAxisID: 'B',
            fill: true,
            hidden: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(105, 134, 143, 0.2)',
            borderColor: 'rgb(105, 134, 143)', // The main line color
            borderCapStyle: 'square',
            borderDash: [5, 5], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: 'white',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(105, 134, 143)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: dataSession.purcentApex2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            ticks: {
              suggestedMax: 5
            }
          }],
          yAxes: [{
            id: 'A',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: this.growthInd.value,
              fontSize: 15
            },
            ticks: {
              max: 1,
              min: 0,
              stepSize: 0.2
            }
          }, {
            id: 'B',
            type: 'linear',
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: this.percentApex.value,
              fontSize: 15
            },
            ticks: {
              max: 100,
              min: 0,
              stepSize: 20
            }
          }]
        }
      }
    });
  }

  public makeChartContrainte(dataSession) {
    this.lineChartContrainte = new Chart(this.lineCanvasContrainte.nativeElement, {
      type: 'line',
      data: {
        labels: dataSession.dateSession,
        datasets: [{
            label: this.waterStressLvl.value,
            yAxisID: 'CH',
            fill: true,
            steppedLine: 'middle',
            lineTension: 0.1,
            backgroundColor: 'rgba(151, 162, 191, 0.2)',
            borderColor: 'rgb(151, 162, 191)',
            borderCapStyle: 'square',
            borderDash: [], // try [5, 15] for instance
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'black',
            pointBackgroundColor: 'white',
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgb(151, 162, 191)',
            pointHoverBorderColor: 'white',
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            data: dataSession.ifv
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            ticks: {
              suggestedMax: 5
            }
          }],
          yAxes: [{
            id: 'CH',
            type: 'linear',
            position: 'left',
            /*scaleLabel: {
              display: true,
              labelString: 'Classes',
              fontSize: 15
            },*/
            ticks: {
              max: 3,
              min: 0,
              stepSize: 1,
              // tslint:disable-next-line:only-arrow-functions
              callback: function(label, index, labels) {   
                switch (label) {
                  case 0:
                      return GlobalConstants.absent;
                  case 1:
                      return GlobalConstants.moderate;
                  case 2:
                      return GlobalConstants.strong;
                  case 3:
                      return GlobalConstants.strict;
                }
              }
            },
          }]
        }
      }
    });
  }
}
