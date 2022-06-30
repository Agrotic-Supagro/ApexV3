import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GlobalConstants } from '../common/global-constants';

@Component({
  selector: 'app-commentaires-session',
  templateUrl: './commentaires-session.page.html',
  styleUrls: ['./commentaires-session.page.scss'],
})
export class CommentairesSessionPage implements OnInit {

  public commentairetext = '';

  constructor(
    private plt: Platform,
    private navParams: NavParams,
    public modalController: ModalController,
    private _translate: TranslateService,
  ) {
    this.plt.ready().then(() => {
      this.commentairetext = this.navParams.data.commentairetext;
    });
  }

  ngOnInit() {
    this._translateLanguage();
  }

  _translateLanguage(): void {
    this._translate.use(GlobalConstants.getLanguageSelected());
  }

  async saveCommentaire() {
    const data = {
      commentaire: this.commentairetext
    };
    await this.modalController.dismiss(data);
  }
}
