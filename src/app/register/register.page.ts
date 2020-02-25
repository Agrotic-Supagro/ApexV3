import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  public registrationForm = this.formBuilder.group({
    id_utilisateur: [this.create_UUID()],
    prenom: ['', [Validators.required, Validators.maxLength(256)]],
    nom: ['', [Validators.required, Validators.maxLength(256)]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
      ]
    ],
    mot_de_passe: ['', [Validators.required, Validators.maxLength(256)]],
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
    ],
    mot_de_passe: [
      { type: 'required', message: 'Le mot de passe est obligatoire ' },
      { type: 'maxlength', message: 'Le nom ne peut pas comporter plus de 40 caractères' }
    ]
  };


  constructor(
              public toastController: ToastController,
              private router: Router,
              private auth: AuthenticationService,
              private formBuilder: FormBuilder
              ) {

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

  registerForm() {
    this.auth.register(this.registrationForm.value).subscribe(async res => {
      console.log('in register return: ', res);
      if (res.status) {
        this.router.navigateByUrl('/login');
      } else {
        this.presentToast('Erreur. L\'email existe déjà.');
        this.registrationForm.controls.email.setValue('');
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  create_UUID() {
    let dt = new Date().getTime();
    // tslint:disable-next-line:only-arrow-functions
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // tslint:disable-next-line:no-bitwise
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
