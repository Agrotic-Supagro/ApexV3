import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import {Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

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
  

  //Trad objects
  nameMand = { key : "nameMand", value : ""};
  nameInd = { key : "nameInd", value : ""};
  surnameMand = { key : "surnameMand", value : ""};
  surnameInd = { key : "surnameInd", value : ""};
  emailMand = { key : "emailMand", value : ""};
  emailInd = { key : "emailInd", value : ""};
  pwdMand = { key : "pwdMand", value : ""};
  pwdInd = { key : "pwdInd", value : ""};
  successRegister = { key : "successRegister", value : ""};
  emailAlreadyExists = { key : "emailAlreadyExists", value : ""};
  tabOfVars = [this.nameMand, this.nameInd, this.surnameMand, this.surnameInd, this.emailMand, this.emailInd, this.pwdMand, 
    this.pwdInd, this.successRegister, this.emailAlreadyExists];

  public errorMessages = {};

  constructor(
              public toastController: ToastController,
              private router: Router,
              private auth: AuthenticationService,
              private formBuilder: FormBuilder,
              private _translate: TranslateService,
              ) {

  }

  ngOnInit(){
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
    for(const elem of this.tabOfVars){
      this._translate.get(elem.key).subscribe( res => {
        elem.value = res;
      })
    }
    this.errorMessages = {
      prenom: [
        { type: 'required', message: this.surnameMand.value },
        { type: 'maxlength', message: this.surnameInd.value }
      ],
      nom: [
        { type: 'required', message: this.nameMand.value },
        { type: 'maxlength', message: this.nameInd.value }
      ],
      email: [
        { type: 'required', message: this.emailMand.value },
        { type: 'pattern', message: this.emailInd.value }
      ],
      mot_de_passe: [
        { type: 'required', message: this.pwdMand.value },
        { type: 'maxlength', message: this.pwdInd.value }
      ]
    };
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
        this.presentToast(this.successRegister.value);
      } else {
        // tslint:disable-next-line:max-line-length
        this.presentToast(this.emailAlreadyExists.value);
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
