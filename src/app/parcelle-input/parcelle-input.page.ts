import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parcelle-input',
  templateUrl: './parcelle-input.page.html',
  styleUrls: ['./parcelle-input.page.scss'],
})
export class ParcelleInputPage implements OnInit {

  public isList = false;
  public categorie;
  public nomParcelle;
  public selectParcelle;
  public numberof0value;
  public numberof1value;
  public numberof2value;
  public myDate;
  public dateDay: any = new Date().toLocaleDateString('fr-FR');

  constructor() { }

  ngOnInit() {
  }

  public closeRognee() {
    // todo
  }

  public closeModal() {
    // todo
  }

  public resetNomParcelle() {
    // todo
  }

  public changeClass() {
    // todo
  }

  public addParcelle() {
    // todo
  }

  public onCancel() {
    // todo
  }
}
