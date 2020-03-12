import { User } from './user-service';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';

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
    private device: Device,
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
    const requeteUserTable = 'CREATE TABLE IF NOT EXISTS utilisateur ('
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
    const requeteDeviceTable = 'CREATE TABLE IF NOT EXISTS device_info ('
    + 'id_config INTEGER PRIMARY KEY AUTOINCREMENT,'
    + 'device_model TEXT,'
    + 'device_platform TEXT,'
    + 'device_uuid TEXT,'
    + 'device_version TEXT,'
    + 'device_manufacturer TEXT,'
    + 'device_serial TEXT,'
    + 'id_utilisateur TEXT'
    + ')';
    const requeteUtilisateurParcelleTable = 'CREATE TABLE IF NOT EXISTS utilisateur_parcelle ('
    + 'id_utilisateur TEXT NOT NULL,'
    + 'id_parcelle TEXT NOT NULL,'
    + 'statut INTEGER,'
    + 'etat INTEGER,'
    + 'PRIMARY KEY(id_utilisateur, id_parcelle)'
    + ')';

    const requeteParcelleTable = 'CREATE TABLE IF NOT EXISTS parcelle ('
    + 'id_parcelle TEXT PRIMARY KEY UNIQUE,'
    + 'nom_parcelle TEXT,'
    + 'date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'id_proprietaire TEXT,'
    + 'etat INTEGER'
    + ')';

    const requeteSessionTable = 'CREATE TABLE IF NOT EXISTS session ('
    + 'id_session TEXT PRIMARY KEY UNIQUE,'
    + 'date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'date_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP,'
    + 'apex0 INTEGER,'
    + 'apex1 INTEGER,'
    + 'apex2 INTEGER,'
    + 'id_observateur TEXT,'
    + 'id_parcelle TEXT,'
    + 'etat INTEGER'
    + ')';

    const requeteObservationTable = 'CREATE TABLE IF NOT EXISTS observation ('
    + 'id_observation INTEGER PRIMARY KEY AUTOINCREMENT,'
    + 'apex_value INTEGER,'
    + 'latitude REAL,'
    + 'longitude REAL,'
    + 'id_session TEXT,'
    + 'id_observateur TEXT,'
    + 'etat INTEGER'
    + ')';

    this.database.executeSql(requeteUserTable, [])
      .then(() => {
        console.log('Success requet create table User');
      })
      .catch(e => console.log('Fail table User | ' + e));

    this.database.executeSql(requeteDeviceTable, [])
      .then(() => {
        console.log('Success requet create table Device Info');
      })
      .catch(e => console.log('Fail table Device Info | ' + e));

    this.database.executeSql(requeteUtilisateurParcelleTable, [])
      .then(() => {
        console.log('Success requet create table utilisateur_parcelle');
      })
      .catch(e => console.log('Fail table utilisateur_parcelle | ' + e));

    this.database.executeSql(requeteParcelleTable, [])
      .then(() => {
        console.log('Success requet create table Parcelle');
      })
      .catch(e => console.log('Fail table Parcelle | ' + e));

    this.database.executeSql(requeteSessionTable, [])
      .then(() => {
        console.log('Success requet create table Session');
      })
      .catch(e => console.log('Fail table Session | ' + e));

    this.database.executeSql(requeteObservationTable, [])
      .then(() => {
        console.log('Success requet create table Observation');
      })
      .catch(e => console.log('Fail table Observation | ' + e));
  }

  // ADD METHODS
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

  addUserParcelle(dataSql) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(dataSql).map(function(_) { return dataSql[_]; });

    return this.database.executeSql('INSERT OR IGNORE INTO utilisateur_parcelle (id_utilisateur, id_parcelle, statut, etat) '
    + 'VALUES (?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  addParcelle(parcelleData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(parcelleData).map(function(_) { return parcelleData[_]; });

    return this.database.executeSql('INSERT OR IGNORE INTO parcelle (id_parcelle, nom_parcelle, id_proprietaire, etat) '
    + 'VALUES (?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  addSession(sessionData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(sessionData).map(function(_) { return sessionData[_]; });

    return this.database.executeSql('INSERT OR IGNORE INTO session (id_session, apex0, apex1, apex2, id_observateur, id_parcelle, etat) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  addObservation(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('INSERT OR IGNORE INTO observation (apex_value, latitude, longitude, id_session, id_observateur, etat) '
    + 'VALUES (?, ?, ?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  addDeviceInfo(idUser) {
    console.log('>>> Méthode AddDiviceInfo | IdUser : ' + idUser);
    // tslint:disable-next-line:max-line-length
    return this.database.executeSql('INSERT INTO device_info (device_model, device_platform, device_uuid, device_version, device_manufacturer, device_serial, id_utilisateur)  '
    + 'SELECT ?, ?, ?, ?, ?, ?, ? '
    + 'WHERE NOT EXISTS ('
    // tslint:disable-next-line:max-line-length
    + 'SELECT 1 FROM device_info WHERE id_utilisateur = ?)', [this.device.model, this.device.platform, this.device.uuid, this.device.version, this.device.manufacturer, this.device.serial, idUser, idUser])
    .then(data => {
      this.getDevicesInfos();
      console.log('Success insert Device Info');
    })
    .catch(e => console.log('Fail insert Device Info | ' + e));
  }

  // UPDATE METHDODS
  updateObservation(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('UPDATE observation SET '
    + 'apex_value= ?, '
    + 'latitude= ?, '
    + 'longitude= ?, '
    + 'id_session= ?, '
    + 'id_observateur= ?, '
    + 'etat= ? '
    + 'WHERE id_observation= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  updateSession(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('UPDATE session SET '
    + 'date_maj= ?, '
    + 'apex0= ?, '
    + 'apex1= ?, '
    + 'apex2= ?, '
    + 'id_parcelle= ?, '
    + 'etat= ? '
    + 'WHERE id_session= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  updateParcelle(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('UPDATE parcelle SET '
    + 'nom_parcelle= ?, '
    + 'date_maj= ?, '
    + 'etat= ?, '
    + 'WHERE id_parcelle= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  updateUserParcelle(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('UPDATE utilisateur_parcelle SET '
    + 'statut= ?, '
    + 'etat= ?, '
    + 'WHERE id_utilisateur= ? AND id_parcelle=?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  updateUser(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });

    return this.database.executeSql('UPDATE utilisateur SET '
    + 'prenom= ?, '
    + 'nom= ?, '
    + 'email= ?, '
    + 'mot_de_passe= ?, '
    + 'structure= ?, '
    + 'date_maj= ?, '
    + 'token= ?, '
    + 'model_ifv= ?, '
    + 'etat= ?, '
    + 'WHERE id_utilisateur= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  // GET METHODS
  getDevicesInfos() {
    return this.database.executeSql('SELECT * FROM device_info', [ ]).then(data => {
      console.log ('>> Nb enregistrement device info (tout opérateur) :' + data.rows.length);
      return data.rows.length;
    });
  }

  getCurrentUser(token): Promise<User> {
    return this.database.executeSql('SELECT * FROM utilisateur WHERE token = ?', [token]).then(data => {
      console.log('>>> ' + data.rows.item(0).email);
      this.user = {
        id_utilisateur: data.rows.item(0).id_utilisateur,
        nom: data.rows.item(0).nom,
        email: data.rows.item(0).email,
        model_ifv: data.rows.item(0).model_ifv,
        token: data.rows.item(0).token
      };
      this.addDeviceInfo(data.rows.item(0).id_utilisateur);
      return this.user;
    });
  }

  getListParcelle() {
    return this.database.executeSql('SELECT * FROM parcelle LEFT JOIN utilisateur_parcelle '
    + 'ON parcelle.id_parcelle = utilisateur_parcelle.id_parcelle '
    + 'WHERE utilisateur_parcelle.id_utilisateur = ? ', [this.user.id_utilisateur]).then(data => {
      console.log ('>> Nb Parcelle (current user) :' + data.rows.length);
      return data.rows.length;
    });
  }

  getUser() {
    return this.user;
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

  updatePassword(updateData) {
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(updateData).map(function(_) { return updateData[_]; });
    const requete = 'UPDATE utilisateur SET mot_de_passe = ? WHERE email = ?';
    return this.database.executeSql(requete, dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  droptable() {
    this.database.executeSql('DROP TABLE device_info', [])
    .then(() => {
      console.log('Success requet drop table device_info');
    })
    .catch(e => console.log('Fail drop table User | ' + e));
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



}
