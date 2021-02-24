import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';

@Component({
  selector: 'app-apex-information',
  templateUrl: './apex-information.component.html',
  styleUrls: ['./apex-information.component.scss'],
})
export class ApexInformationComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    ) { }

  ngOnInit() {}

  stadePheno() {
    this.popoverController.dismiss('stadePheno');
  }
  commentaire() {
    this.popoverController.dismiss('commentaire');
  }
  ecimee() {
    this.popoverController.dismiss('ecimee');
  }
  deleteLastObs() {
    this.popoverController.dismiss('deleteLastObs');
  }
}
