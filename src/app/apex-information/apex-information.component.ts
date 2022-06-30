import { Component, OnInit } from '@angular/core';
import { PopoverController, } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';


@Component({
  selector: 'app-apex-information',
  templateUrl: './apex-information.component.html',
  styleUrls: ['./apex-information.component.scss'],
})
export class ApexInformationComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private _translate: TranslateService,
    ) { }

  ngOnInit() {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

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
