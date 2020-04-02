import { Component, OnInit } from '@angular/core';
import { Platform, ToastController, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { DatabaseService } from '../services/database.service';
import { Storage } from '@ionic/storage';
import { ServerService } from '../services/server.service';
import {Validators, FormBuilder } from '@angular/forms';
import { DateService } from '../services/dates.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: any = {};
  isEdit = false;
  isPwd = false;
  isIfv = true;

  public registrationForm = this.formBuilder.group({
    prenom: ['', [Validators.required, Validators.maxLength(256)]],
    nom: ['', [Validators.required, Validators.maxLength(256)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    structure: ['', [Validators.required, Validators.maxLength(256)]]
    }
  );
  public errorMessages = {
    prenom: [
      { type: 'required', message: 'Le prénom est obligatoire ' },
      { type: 'maxlength', message: 'Le prénom ne peut pas comporter plus de 40 caractères' }
    ],
    nom: [
      { type: 'required', message: 'Le nom est obligatoire ' },
      { type: 'maxlength', message: 'Le nom ne peut pas comporter plus de 40 caractères' }
    ],
    email: [
      { type: 'required', message: 'L\'email est obligatoire ' },
      { type: 'pattern', message: 'Veuillez saisir une adresse électronique valide' }
    ]
  };

  constructor(
    private plt: Platform,
    public toastController: ToastController,
    private storage: Storage,
    public modalController: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
    private dateformat: DateService,
    private serveur: ServerService,
    private auth: AuthenticationService,
    private database: DatabaseService,
    private formBuilder: FormBuilder
  ) {

   }

  ngOnInit() {
    this.storage.get('TOKEN_KEY')
    .then(val => {
      return val;
    })
    .then(email => {
      this.database.getCurrentUser(email).then(data => {
        this.user = data;
        this.registrationForm.value.nom = this.user.nom;
        console.log(this.registrationForm);
        console.log('>> Compte - Info User : ' + this.user.id_utilisateur + ' | ' + this.user.nom);
        if (this.user.model_ifv === 0) {
          this.isIfv = true;
        } else {
          this.isIfv = false;
        }
      });
    });
  }

  async sendData() {
    const data = { email: this.user.email, method: 'all'};
    this.serveur.sendAllData(data).subscribe(async res => {
        if (res.status) {
          this.presentToast('Vos données vous ont été envoyées. Veuillez vérifier votre boite mail.');
        } else {
          this.presentToast('Erreur. Veuillez vérifier que votre email est correct et réessayez.');
        }
    });
  }

  updateUser() {
    const today = this.dateformat.getDatetime(new Date().toISOString());
    const dataUpdate = {
      prenom: this.registrationForm.value.prenom,
      nom: this.registrationForm.value.nom,
      email: this.registrationForm.value.email,
      structure: this.registrationForm.value.structure,
      date_maj: today,
      etat: 0,
      id_utilisateur: this.user.id_utilisateur
    };
    this.database.updateUser(dataUpdate).then(data => {
      if (data) {
        this.presentToast('Informations mises à jours !');
        this.isEdit = false;
      }
    });
  }

  receiveData() {

  }

  updateIFV() {
    let modelIfv = 0;
    if (!this.isIfv) {
      modelIfv = 1;
    }
    const dataUpdate = [modelIfv, this.user.id_utilisateur];
    this.database.updateIFV(dataUpdate).then(data => {
      if (data) {
        if (this.isIfv) {
          this.presentToast('Modèle IFV activé !');
        } else {
          this.presentToast('Modèle IFV désactivé !');
        }
      }
    });
  }

  get prenom() {
    return this.registrationForm.get('prenom');
  }
  get nom() {
    return this.registrationForm.get('nom');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get mot_de_passe() {
    return this.registrationForm.get('mot_de_passe');
  }
  get structure() {
    return this.registrationForm.get('structure');
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
