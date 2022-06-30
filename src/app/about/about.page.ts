import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private _translate: TranslateService,) { }

  ngOnInit() {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

}
