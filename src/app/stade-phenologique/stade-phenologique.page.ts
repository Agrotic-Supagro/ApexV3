import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-stade-phenologique',
  templateUrl: './stade-phenologique.page.html',
  styleUrls: ['./stade-phenologique.page.scss'],
})
export class StadePhenologiquePage implements OnInit {

  public idPhenoDefault = 'st-F-53-53';
  public enter = true;
  public dataList;
  public isSelected = {id_stade: ''};

  constructor(
    private alertCtrl: AlertController,
    private plt: Platform,
    private navParams: NavParams,
    private database: DatabaseService,
    public modalController: ModalController,
  ) {
    this.plt.ready().then(() => {
      this.database.getStadePheno().then( data => {
        if (data === null) {
          console.log(data);
        } else {
          console.log(data);
          this.dataList = data;
          this.dataList = this.dataList.filter(item => item.id_stade !== 'null');

        }
      }).then(() => {
        this.isSelected = {id_stade: this.navParams.data.idStade};
      });
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.isSelected.id_stade !== '') {
      if (this.isSelected.id_stade !== 'null') {
        this.scrollToLabels(this.isSelected.id_stade);
      } else {
        this.scrollToLabels(this.idPhenoDefault);
      }
    } else {
      this.scrollToLabels(this.idPhenoDefault);
    }
  }

  scrollToLabels(id) {
    document.getElementById(id).scrollIntoView();
  }

  async info(data) {
    const alert = await this.alertCtrl.create({
      header: data.nom,
      message: data.descriptif,
      buttons: ['OK']
    });

    await alert.present();
  }

  selectedStd(data) {
    if (this.isSelected.id_stade === data.id_stade) {
      this.isSelected = {id_stade: ''};
    } else {
      this.isSelected = data;
    }
    console.log(data.id_stade);
  }

  async saveStade() {
    let id = 'null';
    if (this.isSelected.id_stade !== '') {
      id = this.isSelected.id_stade;
    }
    await this.modalController.dismiss(id);
  }
}
