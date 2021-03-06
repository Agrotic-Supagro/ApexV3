import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DateService } from '../services/dates.service';
import { Chart } from 'chart.js';
import { SessionInfoPage } from '../session-info/session-info.page';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ServerService } from '../services/server.service';
import { NetworkService } from '../services/network.service';

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

  isDelete = false;
  isList = false;
  isRename = false;
  isShare = false;
  isIFV = true;

  newNameParcelle = null;
  public myDate: any = new Date().toISOString();

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
            this.presentToast('Parcelle partagée avec succès. En attente de validation!');
          } else {
            this.presentToast('Email de partage non reconnu. Etes-vous sur que cet email est associé à un compte existant ?');
          }
        });
      } else {
        this.presentToast('Cette fonctionnalité ne fonctionne qu\'avec du réseau');
      }
    } else {
      this.presentToast('Email de partage est incorrect ou vide. Merci d\'essayer à nouveau');
    }
    this.isShare = false;
  }
  public renameParcelle() {
    if (this.newNameParcelle === '' || this.newNameParcelle === 0 || /^\s*$/.test(this.newNameParcelle) || this.newNameParcelle === null) {
      // mettre une alerte
    } else {
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
          this.presentToast('Parcelle renommée avec succès!');
        }
      });
    }
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
      header: 'Voulez-vous supprimer cette session ?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Supprimer',
          handler: () => {
            console.log('Confirm Okay');
            this.database.updateSessionBeforeDelete(idSession).then(data => {
              if (data) {
                this.initInfoParcelle();
                this.presentToast('Observation supprimée avec succès!');
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
            this.database.updateParcelleBeforeDelete(this.parcelle.id_parcelle).then(async data => {
              if (data) {
                this.router.navigateByUrl('/home');
                this.presentToast('Parcelle supprimée avec succès!');
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
      header: 'Informations',
      message: 'Vous pouvez <b>partager une parcelle</b> avec un <b>destinataire</b> en ajoutant son email. '
      + 'Le destinaire doit déjà être inscrit sur l\'application ApeX-Vigne pour que le partage ait lieu.'
      + '<br /><br />Seuls l\'identifiant et le nom de la parcelle seront partagés. Vos données '
      + 'déjà collectées ne seront pas transmises au destinataire.',
      buttons: ['OK']
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
            label: '% pleine croiss.',
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
            label: '% croiss. ralentie',
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
            label: '% arrêt croiss.',
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
              labelString: 'Indice croiss.',
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
              labelString: '% Apex',
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
            label: 'Niveau contrainte hydrique',
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
                        return 'Absente';
                    case 1:
                        return 'Modérée';
                    case 2:
                        return 'Forte';
                    case 3:
                        return 'Sévère';
                }
            }
            }
          }]
        }
      }
    });
  }
}
