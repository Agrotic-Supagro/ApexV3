import { User } from './user-service';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

const DATABASE_APEX_NAME = 'dataApexV312.db';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  isOpen = false;
  database: SQLiteObject;
  parcelles = new BehaviorSubject([]);
  user: User;

  constructor(
    private plt: Platform,
    private sqlite: SQLite
  ) {

    this.plt.ready().then(() => {
      this.sqlite.create({
        name: DATABASE_APEX_NAME,
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        console.log('DB created !');
        this.database = db;
        this.createTables();
      })
      .catch(e => console.log(e));
    });

  }

  public open() {
    this.createDatabaseApexV3();
  }

  private createDatabaseApexV3(): void {
    this.sqlite.create({
        name: DATABASE_APEX_NAME,
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        console.log('DB created !');
        this.database = db;
        this.createTables();
      })
      .catch(e => console.log(e));
  }

  private createTables(): void {
    const requete = 'CREATE TABLE IF NOT EXISTS utilisateur ('
    + 'id_utilisateur TEXT NOT NULL PRIMARY KEY UNIQUE,'
    + 'prenom TEXT,'
    + 'nom TEXT,'
    + 'email TEXT,'
    + 'mot_de_passe TEXT,'
    + 'structure TEXT,'
    + 'date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'token TEXT DEFAULT "",'
    + 'model_ifv INTEGER DEFAULT 0,'
    + 'etat INTEGER DEFAULT 0'
    + ')';

    this.database.executeSql(requete, [])
      .then(() => {
        console.log('Success requet create table User');
      })
      .catch(e => console.log('Fail table User | ' + e));
  }

  addUser(userData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(userData).map(function(_) { return userData[_]; });

    return this.database.executeSql('INSERT INTO utilisateur (id_utilisateur, prenom, nom, email, mot_de_passe, structure) '
    + 'VALUES (?, ?, ?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  updateJWT(updateData) {
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(updateData).map(function(_) { return updateData[_]; });
    const requete = 'UPDATE utilisateur SET token = ? WHERE email = ? AND mot_de_passe = ?';
    return this.database.executeSql(requete, dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  droptable() {
    this.database.executeSql('DROP TABLE utilisateur', [])
    .then(() => {
      console.log('Success requet create table User');
    })
    .catch(e => console.log('Fail table User | ' + e));
  }

  getCurrentUser(token): Promise<User> {
    return this.database.executeSql('SELECT * FROM utilisateur WHERE token = ?', [token]).then(data => {
      console.log('>>> ' + data.rows.item(0).email);
      this.user = {
        id_utilisateur: data.rows.item(0).id_utilisateur,
        nom: data.rows.item(0).nom,
        model_ifv: data.rows.item(0).model_ifv,
        token: data.rows.item(0).token
      };
      console.log(this.user);
      return this.user;
    });
  }

  loadParcelles() {
    // TO DO
    // https://devdactic.com/ionic-4-sqlite-queries/
    // Voir sur l'ancien code ce qu'il faut garder
    // tslint:disable-next-line:max-line-length
    const query = 'SELECT parcelle.id_parcelle, parcelle.nom_parcelle, parcelle.id_proprietaire, session.apex0 , session.apex1, session.apex2, session.date_maj, session.id_observateur '
    + 'FROM parcelle JOIN session ON parcelle.id_parcelle = session.id_parcelle '
    + 'WHERE etat = 0 OR etat = 1';
    return this.database.executeSql(query, []).then(data => {
      const parcelles = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          const apex0: number = data.rows.item(i).apexP;
          const apex1: number = data.rows.item(i).apexR;
          const apex2: number = data.rows.item(i).apexC;
          const tauxApex0: number = apex0 / (apex2 + apex0 + apex1) * 100;
          const tauxApex1: number = apex1 / (apex2 + apex0 + apex1) * 100;
          const tauxApex2: number = apex2 / (apex2 + apex0 + apex1) * 100;
          const apexValues = [tauxApex0, tauxApex1, tauxApex2];
          let proprietaire = 0;
          if (data.rows.item(i).id_proprietaire !== data.rows.item(i).id_observateur) {
            proprietaire = 1;
          }
          parcelles.push({
            id_parcelle: data.rows.item(i).id_parcelle,
            nom_parcelle: data.rows.item(i).nom_parcelle,
            date: data.rows.item(i).date_maj,
            apexValues: apexValues,
            proprietaire: proprietaire
           });
        }
      }
      this.parcelles.next(parcelles);
    });
  }

  existEmail(email) {
    console.log(email);
    return this.database.executeSql('SELECT * FROM utilisateur WHERE email = ?', [email]).then(data => {
      // console.log(data.rows.item(0).nom);
      if (data.rows.length > 0) {
        return true;
      } else { return false; }
    });
  }

  updatePassword(updateData) {
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(updateData).map(function(_) { return updateData[_]; });
    const requete = 'UPDATE utilisateur SET mot_de_passe = ? WHERE email = ?';
    return this.database.executeSql(requete, dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }
}
