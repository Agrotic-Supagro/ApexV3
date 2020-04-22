import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { DateService } from '../services/dates.service';
import { Chart } from 'chart.js';
import { SessionInfoPage } from '../session-info/session-info.page';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  @ViewChild('lineCanvasCroissance', {static: true}) lineCanvasCroissance;
  @ViewChild('lineCanvasContrainte', {static: true}) lineCanvasContrainte;
  public lineChartContrainte: any;
  public lineChart: any;

  idUser: any;
  parcelle: any;
  infoSession: any;

  isDelete = false;
  isList = false;
  isRename = false;

  newNameParcelle = null;
  public myDate: any = new Date().toISOString();

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private database: DatabaseService,
    private dateformat: DateService
  ) {
    this.plt.ready().then(() => {

      // this.initInfoParcelle();
    });
  }

  ngOnInit() {
  }

}
