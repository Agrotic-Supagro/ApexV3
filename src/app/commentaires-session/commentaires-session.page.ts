import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';

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
  ) {
    this.plt.ready().then(() => {
      this.commentairetext = this.navParams.data.commentairetext;
    });
  }

  ngOnInit() {
  }

  async saveCommentaire() {
    const data = {
      commentaire: this.commentairetext
    };
    await this.modalController.dismiss(data);
  }
}
