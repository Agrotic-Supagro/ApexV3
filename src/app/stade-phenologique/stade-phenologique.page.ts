import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-stade-phenologique',
  templateUrl: './stade-phenologique.page.html',
  styleUrls: ['./stade-phenologique.page.scss'],
})
export class StadePhenologiquePage implements OnInit {

  public dataList;
  public isSelected = {urlImage: ''};

  constructor(
    private alertCtrl: AlertController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.dataList = [{
      titre: 'Stade A ou BBCH 00 à 03',
      soustitre: 'Début gonflement',
      description: 'Début du gonflement du bourgeon et de la reprise de la végétation.',
      urlImage: 'stade_a.jpg'
    },
    {
      titre: 'Stade B ou BBCH 05',
      soustitre: 'Gonflement des bourgeons',
      description: 'Les écailles s’écartent, la protection cotonneuse ou bourre devient visible.',
      urlImage: 'stade_b.jpg'
    },
    {
      titre: 'Stade C ou BBCH 09',
      soustitre: 'Stade pointe verte',
      description: 'L’extrémité verte de la pousse devient visible.',
      urlImage: 'stade_c.jpg'
    },
    {
      titre: 'Stade D ou BBCH 10',
      soustitre: 'Sortie de feuilles',
      // tslint:disable-next-line:max-line-length
      description: 'Les feuilles rudimentaires sont rassemblées en rosette. Leur base est encore protégée par la bourre qui est rejetée progressivement hors des écailles.',
      urlImage: 'stade_d.jpg'
    },
    {
      titre: 'Stade E ou BBCH 11 à 19',
      soustitre: 'Développement des feuilles',
      // tslint:disable-next-line:max-line-length
      description: 'Les feuilles se dégagent l’une après l’autre et se développent. Les premières feuilles présentent les caractéristiques propres au cépage.',
      urlImage: 'stade_e.jpg'
    },
    {
      titre: 'Stade F ou BBCH 53',
      soustitre: 'Grappe visible',
      // tslint:disable-next-line:max-line-length
      description: 'La grappe rudimentaire est visible à l’extrémité de la pousse. Quatre à six feuilles sont étalées.',
      urlImage: 'stade_f.jpg'
    },
    {
      titre: 'Stade G ou BBCH 55',
      soustitre: 'Boutons floraux agglomérés',
      // tslint:disable-next-line:max-line-length
      description: 'La grappe se développe. Les boutons floraux restent agglomérés.',
      urlImage: 'stade_g.jpg'
    },
    {
      titre: 'Stade H ou BBCH 57',
      soustitre: 'Boutons floraux séparés',
      // tslint:disable-next-line:max-line-length
      description: 'La grappe est bien développée. Les boutons floraux sont nettement séparés.',
      urlImage: 'stade_h.jpg'
    },
    {
      titre: 'Stade I ou BBCH 60 à 69',
      soustitre: 'Floraison',
      // tslint:disable-next-line:max-line-length
      description: 'Les capuchons floraux se détachent puis tombent. Les étamines et le pistil sont visibles.',
      urlImage: 'stade_i.jpg'
    },
    {
      titre: 'Stade J ou BBCH 71',
      soustitre: 'Nouaison',
      // tslint:disable-next-line:max-line-length
      description: 'Les baies commencent à se développer. Les pièces florales chutent.',
      urlImage: 'stade_j.jpg'
    },
    {
      titre: 'Stade K ou BBCH 75',
      soustitre: 'Stade petit pois',
      // tslint:disable-next-line:max-line-length
      description: 'Les baies ont la taille d’un petit pois. Les grappes s’inclinent vers le bas et gagnent leur position finale.',
      urlImage: 'stade_k.jpg'
    },
    {
      titre: 'Stade L ou BBCH 77',
      soustitre: 'Fermeture de la grappe',
      // tslint:disable-next-line:max-line-length
      description: 'Dans la grappe, les baies sont suffisamment grosses pour se toucher.',
      urlImage: 'stade_l.jpg'
    },
    {
      titre: 'Stade M ou BBCH 81 à 85',
      soustitre: 'Véraison',
      // tslint:disable-next-line:max-line-length
      description: 'Pour les cépages blancs, les baies deviennent légèrement translucides. Pour les cépages noirs, les baies prennent une coloration violette.',
      urlImage: 'stade_m.jpg'
    },
    {
      titre: 'Stade N ou BBCH 89',
      soustitre: 'Maturité',
      // tslint:disable-next-line:max-line-length
      description: 'Les baies ont atteint leur maturité pour la vendange.',
      urlImage: 'stade_n.jpg'
    },
    {
      titre: 'Stade O ou BBCH 91',
      soustitre: 'Fin aoûtement du bois',
      // tslint:disable-next-line:max-line-length
      description: 'L’aoûtement du bois est amorcé lorsque la véraison arrive à son terme.',
      urlImage: 'stade_o.jpg'
    }
    ,
    {
      titre: 'Stade P ou BBCH 92 à 97',
      soustitre: 'Chute des feuilles',
      // tslint:disable-next-line:max-line-length
      description: 'Les feuilles se colorent puis tombent. La vigne entre en repos végétatif.',
      urlImage: 'stade_p.jpg'
    }
  ];
  }

  async info(data) {
    const alert = await this.alertCtrl.create({
      header: data.titre,
      message: data.description,
      buttons: ['OK']
    });

    await alert.present();
  }

  selectedStd(data) {
    if (this.isSelected.urlImage === data.urlImage) {
      this.isSelected = {urlImage: ''};
    } else {
      this.isSelected = data;
    }
    console.log(data.urlImage);
  }

  async saveStade() {
    const data = this.isSelected;
    await this.modalController.dismiss(data);
  }
}
