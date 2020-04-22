import { ParcelleName } from './parcelle-name.service';
import { User } from './user-service';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { Device } from '@ionic-native/device/ngx';
import { Parcelle } from './parcelle-service';
import { DateService } from './dates.service';

const DATABASE_APEX_NAME = 'dataApexV312.db';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  isOpen = false;
  database: SQLiteObject;
  parcelles: any = [];
  user: User;
  parcelleList: ParcelleName[];
  listId: any = [];

  private storage: SQLiteObject;
  songsList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private plt: Platform,
    private device: Device,
    private dateformat: DateService,
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



dbState() {
  return this.isDbReady.asObservable();
}

fetchSongs(): Observable<Parcelle[]> {
  return this.songsList.asObservable();
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
    + 'date_session TIMESTAMP,'
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

    this.isDbReady.next(true);
  }

  // ADD METHODS
  addUser(userData) {
    console.log('AddUser data : ', userData);
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(userData).map(function(_) { return userData[_]; });

    return this.database.executeSql('INSERT OR IGNORE INTO utilisateur (id_utilisateur, prenom, nom, email, mot_de_passe, structure) '
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

    // tslint:disable-next-line:max-line-length
    return this.database.executeSql('INSERT OR IGNORE INTO session (id_session, date_session, apex0, apex1, apex2, id_observateur, id_parcelle, etat) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?)', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  addObservation(listOfObservation) {
    console.log('>> Save Observation');
    listOfObservation.forEach(observationData => {
      // console.log(observationData);
      // tslint:disable-next-line:only-arrow-functions
      const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });
      this.database.executeSql('INSERT OR IGNORE INTO observation '
      + '(apex_value, latitude, longitude, id_session, id_observateur, etat) '
      + 'VALUES (?, ?, ?, ?, ?, ?)', dataTosql)
      .then(data => {
        // this.loadDevelopers();
      });
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
    console.log('>> Update Session');
    return this.database.executeSql('UPDATE session SET '
    + 'date_maj= ?, '
    + 'date_session= ?, '
    + 'apex0= ?, '
    + 'apex1= ?, '
    + 'apex2= ?, '
    + 'etat= ? '
    + 'WHERE id_session= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
      console.log('Succes ! Session updated !');
    }).catch(e => console.log(e));
  }

  updateParcelle(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });
    console.log(dataTosql);
    return this.database.executeSql('UPDATE parcelle SET '
    + 'nom_parcelle= ?, '
    + 'date_maj= ?, '
    + 'etat= ? '
    + 'WHERE id_parcelle = ?', dataTosql)
    .then(data => {
      return true;
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

  updateIFV(dataUpdate) {
    return this.database.executeSql('UPDATE utilisateur SET '
    + 'model_ifv= ? '
    + 'WHERE id_utilisateur = ?', dataUpdate)
    .then(data => {
      return true;
    });
  }

  updateUser(observationData) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(observationData).map(function(_) { return observationData[_]; });
    console.log('>> Fonction UpdateUser :');
    console.log(dataTosql);
    return this.database.executeSql('UPDATE utilisateur SET '
    + 'prenom= ?, '
    + 'nom= ?, '
    + 'email= ?, '
    + 'structure= ?, '
    + 'date_maj= ?, '
    + 'etat= ? '
    + 'WHERE id_utilisateur= ?', dataTosql)
    .then(data => {
      return true;
    });
  }

  updateSessionBeforeDelete(idSession: any) {
    return this.database.executeSql('UPDATE session SET '
    + 'etat= 2 '
    + 'WHERE id_session = ?', [idSession])
    .then(data => {
      return true;
    });
  }
  updateParcelleBeforeDelete(idParcelle: any) {
    return this.database.executeSql('UPDATE parcelle SET '
    + 'etat= 2 '
    + 'WHERE id_parcelle = ?', [idParcelle])
    .then(data => {
      this.database.executeSql('UPDATE utilisateur_parcelle SET '
      + 'etat= 2 '
      + 'WHERE id_parcelle = ?', [idParcelle]).then(_ => {
        return true;
      }).then(_ => {
        this.database.executeSql('UPDATE session SET '
        + 'etat= 2 '
        + 'WHERE id_parcelle = ?', [idParcelle]).then(res => {
          return true;
        });
      });
      return true;
    });
  }
  // DELETE METHODS
  deleteUserParcelle(dataSql) {
    // Methode pour recuperer les valeurs dans un json simple
    // tslint:disable-next-line:only-arrow-functions
    const dataTosql = Object.keys(dataSql).map(function(_) { return dataSql[_]; });

    return this.database.executeSql('DELETE FROM utilisateur_parcelle '
    + 'WHERE id_utilisateur= ? AND id_parcelle= ?', dataTosql)
    .then(data => {
      // this.loadDevelopers();
    });
  }

  deleteParcelle(id) {
    return this.database.executeSql('DELETE FROM parcelle '
    + 'WHERE id_parcelle= ?', [id])
    .then(data => {
      // this.loadDevelopers();
    });
  }

  deleteObservation(id) {
    return this.database.executeSql('DELETE FROM observation '
    + 'WHERE id_observation= ?', [id])
    .then(data => {
      // this.loadDevelopers();
    });
  }

  deleteSession(id) {
    return this.database.executeSql('DELETE FROM session '
    + 'WHERE id_session= ?', [id])
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
        prenom: data.rows.item(0).prenom,
        structure: data.rows.item(0).structure,
        email: data.rows.item(0).email,
        mdp: data.rows.item(0).mot_de_passe,
        model_ifv: data.rows.item(0).model_ifv,
        token: data.rows.item(0).token
      };
      this.addDeviceInfo(data.rows.item(0).id_utilisateur);
      return this.user;
    });
  }


  getAllParcelleTest(dataSql) {
    return this.getListId(dataSql).then(data => {
      this.parcelles = [];
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < data.length; k++) {
        this.getSession(data[k]);
      }
    })
    .then(_ => {
      console.log(this.parcelles);
      return this.parcelles;
    });
  }

  getSession(idParcelle) {
    const parcelleTemp = [];
    return this.database.executeSql(
      'SELECT * FROM session '
    + 'JOIN parcelle '
    + 'ON parcelle.id_parcelle = session.id_parcelle '
    + 'WHERE parcelle.id_parcelle = ? '
    + 'AND session.etat != 2 '
    + 'AND parcelle.etat != 2 '
    + 'ORDER BY session.date_session DESC LIMIT 2'
    , [idParcelle]).then(dataParcelle => {
      if (dataParcelle.rows.length > 0) {
        const apex0: number = dataParcelle.rows.item(0).apex0;
        const apex1: number = dataParcelle.rows.item(0).apex1;
        const apex2: number = dataParcelle.rows.item(0).apex2;
        const moyenne = ((apex0) + (apex1 / 2)) / (apex0 + apex1 + apex2);
        const tauxApex0: number = apex0 / (apex2 + apex0 + apex1) * 100;
        const tauxApex1: number = apex1 / (apex2 + apex0 + apex1) * 100;
        const tauxApex2: number = apex2 / (apex2 + apex0 + apex1) * 100;
        const apexValues = [Math.round(tauxApex0), Math.round(tauxApex1), Math.round(tauxApex2)];

        // GESTION DYNAMIQUE CROISSANCE
        // dynamique : 0 = stable, 1 = croissance, -1 = decroissance, neutre =2
        let dynamique = 2;
        if (dataParcelle.rows.length === 2) {
          dynamique = 0;
          const apex0Old = dataParcelle.rows.item(1).apex0;
          const apex1Old = dataParcelle.rows.item(1).apex1;
          const apex2Old = dataParcelle.rows.item(1).apex2;
          const moyenneOld = ((apex0Old) + (apex1Old / 2)) / (apex0Old + apex1Old + apex2Old);
          const diffMoyenne = moyenneOld - moyenne;
          if (diffMoyenne > 0.2) {
            dynamique = -1;
          } else {
            if (diffMoyenne < -0.2) {
              dynamique = 1;
            }
          }
        }

        // GESTION DES CLASSES DE CONTRAINTE HYDRIQUE ET ECIMAGE
        // Classe IFV : 0 = absente, 1 = moderee, 2 = importante, 3 = forte, 4 = ecimee
        let ifvClasse = 3;
        if (apex0 === 999) {
          ifvClasse = 4;
          dynamique = 2;
        } else {
          // GESTION DES CLASSES
          if (moyenne >= 0.75) {
            ifvClasse = 0;
          } else {
            if (tauxApex0 >= 5) {
              ifvClasse = 1;
            } else {
              if (tauxApex2 <= 90) {
                ifvClasse = 2;
              }
            }
          }
        }

        parcelleTemp.push({
          id_parcelle: dataParcelle.rows.item(0).id_parcelle,
          nom_parcelle: dataParcelle.rows.item(0).nom_parcelle,
          date_session: dataParcelle.rows.item(0).date_session,
          apex: apexValues,
          dynamique: dynamique,
          ifv_classe: ifvClasse,
          ic_apex: moyenne,
          proprietaire: dataParcelle.rows.item(0).id_proprietaire
        });
      }
      this.songsList.next(parcelleTemp);
    });
  }

  getListId(dataSql) {
    return this.database.executeSql(
      'SELECT * FROM utilisateur_parcelle '
    + 'JOIN parcelle '
    + 'ON parcelle.id_parcelle = utilisateur_parcelle.id_parcelle '
    + 'JOIN session '
    + 'ON parcelle.id_parcelle = session.id_parcelle '
    + 'WHERE id_utilisateur = ? '
    + 'AND utilisateur_parcelle.statut !=0 '
    + 'AND utilisateur_parcelle.etat != 2 '
    + 'GROUP BY session.id_parcelle '
    + 'ORDER BY session.date_session ASC LIMIT 5 OFFSET ?'
    , dataSql).then(dataUserParcelle => {
      for (let i = 0; i < dataUserParcelle.rows.length; i++) {
        console.log(dataUserParcelle.rows.item(i).id_parcelle);
        this.listId.push(dataUserParcelle.rows.item(i).id_parcelle);
      }
      return this.listId;
    });
  }

   // Get list
 getSongs(dataSql, filter) {
  console.log('Get parcelle by', filter);
  let orderby = 'ORDER BY newDate DESC LIMIT 5 OFFSET ?';
  if (filter === 'nom') {
    orderby = 'ORDER BY parcelle.nom_parcelle COLLATE NOCASE ASC LIMIT 5 OFFSET ?';
  }
  this.songsList = new BehaviorSubject([]);
  // this.parcelles = [];
  return this.database.executeSql(
    'SELECT *, MAX(session.date_session) As newDate FROM utilisateur_parcelle '
    + 'JOIN parcelle '
    + 'ON parcelle.id_parcelle = utilisateur_parcelle.id_parcelle '
    + 'JOIN session '
    + 'ON parcelle.id_parcelle = session.id_parcelle '
    + 'WHERE id_utilisateur = ? '
    + 'AND utilisateur_parcelle.statut !=0 '
    + 'AND utilisateur_parcelle.etat != 2 '
    + 'GROUP BY session.id_parcelle '
    + orderby
    , dataSql).then(res => {
    const idParcelle = [];
    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        console.log(res.rows.item(i).id_parcelle);
        idParcelle.push(res.rows.item(i).id_parcelle);
      }
    }
    return idParcelle;
  })
  .then(res => {
    console.log(res);
    // tslint:disable-next-line:prefer-for-of
    for (let k = 0; k < res.length; k++) {
      this.getSession(res[k]);
    }
  });
}
  getAllParcelle(dataSql, filter) {
    console.log('Get parcelle by', filter);
    let orderby = 'ORDER BY newDate DESC LIMIT 5 OFFSET ?';
    if (filter === 'nom') {
      orderby = 'ORDER BY parcelle.nom_parcelle COLLATE NOCASE ASC LIMIT 5 OFFSET ?';
    }
    this.parcelles = [];
    return this.database.executeSql(
      'SELECT *, MAX(session.date_session) As newDate FROM utilisateur_parcelle '
    + 'JOIN parcelle '
    + 'ON parcelle.id_parcelle = utilisateur_parcelle.id_parcelle '
    + 'JOIN session '
    + 'ON parcelle.id_parcelle = session.id_parcelle '
    + 'WHERE id_utilisateur = ? '
    + 'AND utilisateur_parcelle.statut !=0 '
    + 'AND utilisateur_parcelle.etat != 2 '
    + 'GROUP BY session.id_parcelle '
    + orderby
    , dataSql).then(dataUserParcelle => {
      if (dataUserParcelle.rows.length > 0) {
        for (let i = 0; i < dataUserParcelle.rows.length; i++) {
          // console.log(dataUserParcelle.rows.item(i));
          const idParcelle = dataUserParcelle.rows.item(i).id_parcelle;

          this.database.executeSql(
            'SELECT * FROM session '
          + 'JOIN parcelle '
          + 'ON parcelle.id_parcelle = session.id_parcelle '
          + 'WHERE parcelle.id_parcelle = ? '
          + 'AND session.etat != 2 '
          + 'AND parcelle.etat != 2 '
          + 'ORDER BY session.date_session DESC LIMIT 2'
          , [idParcelle]).then(dataParcelle => {
            if (dataParcelle.rows.length > 0) {
              const apex0: number = dataParcelle.rows.item(0).apex0;
              const apex1: number = dataParcelle.rows.item(0).apex1;
              const apex2: number = dataParcelle.rows.item(0).apex2;
              const moyenne = ((apex0) + (apex1 / 2)) / (apex0 + apex1 + apex2);
              const tauxApex0: number = apex0 / (apex2 + apex0 + apex1) * 100;
              const tauxApex1: number = apex1 / (apex2 + apex0 + apex1) * 100;
              const tauxApex2: number = apex2 / (apex2 + apex0 + apex1) * 100;
              const apexValues = [Math.round(tauxApex0), Math.round(tauxApex1), Math.round(tauxApex2)];
                // GESTION DES CLASSES DE CONTRAINTE HYDRIQUE ET ECIMAGE
                // Classe IFV : 0 = absente, 1 = moderee, 2 = importante, 3 = forte, 4 = ecimee
              let ifvClasse = 3;
              if (apex0 === 999) {
                ifvClasse = 4;
              } else {
                // GESTION DES CLASSES
                if (moyenne >= 0.75) {
                  ifvClasse = 0;
                } else {
                  if (tauxApex0 >= 5) {
                    ifvClasse = 1;
                  } else {
                    if (tauxApex2 <= 90) {
                      ifvClasse = 2;
                    }
                  }
                }
              }
              // GESTION DYNAMIQUE CROISSANCE
              // dynamique : 0 = stable, 1 = croissance, -1 = decroissance, neutre =2
              let dynamique = 2;
              if (dataParcelle.rows.length === 2) {
                dynamique = 0;
                const apex0Old = dataParcelle.rows.item(1).apex0;
                const apex1Old = dataParcelle.rows.item(1).apex1;
                const apex2Old = dataParcelle.rows.item(1).apex2;
                const moyenneOld = ((apex0Old) + (apex1Old / 2)) / (apex0Old + apex1Old + apex2Old);
                const diffMoyenne = moyenneOld - moyenne;
                if (diffMoyenne > 0.2) {
                  dynamique = -1;
                } else {
                  if (diffMoyenne < -0.2) {
                    dynamique = 1;
                  }
                }
              }
              this.parcelles.push({
                id_parcelle: dataParcelle.rows.item(0).id_parcelle,
                nom_parcelle: dataParcelle.rows.item(0).nom_parcelle,
                date_session: dataParcelle.rows.item(0).date_session,
                apex: apexValues,
                dynamique: dynamique,
                ifv_classe: ifvClasse,
                ic_apex: moyenne.toFixed(2),
                proprietaire: dataParcelle.rows.item(0).id_proprietaire,
              });
            }
          });
        }
        return this.parcelles;
      }
    });
  }

  getListParcelle() {
    return this.database.executeSql('SELECT * FROM parcelle LEFT JOIN utilisateur_parcelle '
    + 'ON parcelle.id_parcelle = utilisateur_parcelle.id_parcelle '
    + 'WHERE utilisateur_parcelle.id_utilisateur = ? '
    + 'AND utilisateur_parcelle.statut != 0 '
    + 'AND utilisateur_parcelle.etat != 2 '
    + 'ORDER BY  parcelle.nom_parcelle ASC', [this.user.id_utilisateur]).then(data => {
      console.log ('>> Nb Parcelle (current user) :' + data.rows.length);
      const parcelleList = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          parcelleList.push({
            id_parcelle: data.rows.item(i).id_parcelle,
            nom_parcelle: data.rows.item(i).nom_parcelle,
            id_proprietaire: data.rows.item(i).id_proprietaire
           });
        }
        this.parcelleList = parcelleList;
        return this.parcelleList;
      } else {
        return null;
      }
    });
  }

  getInfoSession(idSession: any) {
    return this.database.executeSql(
      'SELECT * FROM session '
    + 'WHERE session.id_session = ?'
    , [idSession]).then(data => {
      if (data.rows) {
        return {
          idSession: data.rows.item(0).id_session,
          date_session: data.rows.item(0).date_session,
          apex0: data.rows.item(0).apex0,
          apex1: data.rows.item(0).apex1,
          apex2: data.rows.item(0).apex2
        };
      }
    });
  }

  getInfoParcelle(idParcelle: any) {
    let infoParcelle: any = null;
    const dataSession = [];
    const dateSession = [];
    const ica = [];
    const ifv = [];
    const purcentApex0 = [];
    const purcentApex1 = [];
    const purcentApex2 = [];

    return this.database.executeSql(
      'SELECT * FROM session '
    + 'WHERE session.id_parcelle = ? '
    + 'AND session.etat != 2 '
    + 'ORDER BY session.date_session DESC LIMIT 5'
    , [idParcelle]).then(data => {
      if (data.rows) {
        for (let i = 0; i < data.rows.length; i++) {
          console.log(data.rows.item(i).id_session);
          const apex0 = data.rows.item(i).apex0;
          const apex1 = data.rows.item(i).apex1;
          const apex2 = data.rows.item(i).apex2;
          let moyenne: number;
          let tauxApex0;
          let tauxApex1;
          let tauxApex2;
          let ifvClasse;
          let rognee = false;
          // PARCELLE ROGNEE
          if (apex0 === 999) {
            rognee = true;
            moyenne = null;
            tauxApex0 = null;
            tauxApex1 = null;
            tauxApex2 = null;
            ifvClasse = null;
          } else {
            moyenne = ((apex0) + (apex1 / 2)) / (apex0 + apex1 + apex2);
            tauxApex0 = (apex0 / (apex2 + apex0 + apex1) * 100).toFixed(1);
            tauxApex1 = (apex1 / (apex2 + apex0 + apex1) * 100).toFixed(1);
            tauxApex2 = (apex2 / (apex2 + apex0 + apex1) * 100).toFixed(1);
            ifvClasse = '3';

            // GESTION DES CLASSES
            if (moyenne >= 0.75) {
              ifvClasse = '0';
            } else {
              if (tauxApex0 >= 5) {
                ifvClasse = '1';
              } else {
                if (tauxApex2 <= 90) {
                  ifvClasse = '2';
                }
              }
            }
          }
          // PUSH
          dataSession.push({idSession: data.rows.item(i).id_session, dateSession: data.rows.item(i).date_session, rognee: rognee});
          dateSession.push(this.dateformat.setDateFr(data.rows.item(i).date_session));
          ica.push(moyenne);
          ifv.push(ifvClasse);
          purcentApex0.push(tauxApex0);
          purcentApex1.push(tauxApex1);
          purcentApex2.push(tauxApex2);
        }
      }
      infoParcelle = {
        dataSession: dataSession,
        dateSession: dateSession.reverse(),
        ica: ica.reverse(),
        ifv: ifv.reverse(),
        purcentApex0: purcentApex0.reverse(),
        purcentApex1: purcentApex1.reverse(),
        purcentApex2: purcentApex2.reverse()
      };
      return infoParcelle;
    });
  }

  getUser() {
    return this.user;
  }

  // SPECIFIC UPDATE
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
    console.log(dataTosql);
    const requete = 'UPDATE utilisateur SET mot_de_passe = ? WHERE email = ? AND id_utilisateur = ?';
    return this.database.executeSql(requete, dataTosql)
    .then(data => {
      console.log('Success update password');
      // this.loadDevelopers();
    })
    .catch(e => console.log('Fail drop table  | ' + e));
  }

  // DROP TABLE
  droptable() {
    this.database.executeSql('DELETE FROM \'session\'', [])
    .then(() => {
      console.log('Success requet drop table session');
    })
    .catch(e => console.log('Fail drop table  | ' + e));

    this.database.executeSql('DELETE FROM \'observation\'', [])
    .then(() => {
      console.log('Success requet drop table observation');
    })
    .catch(e => console.log('Fail drop table  | ' + e));

    this.database.executeSql('DELETE FROM \'parcelle\'', [])
    .then(() => {
      console.log('Success requet drop table parcelle');
    })
    .catch(e => console.log('Fail drop table  | ' + e));

    this.database.executeSql('DELETE FROM \'utilisateur_parcelle\'', [])
    .then(() => {
      console.log('Success requet drop table utilisateur_parcelle');
    })
    .catch(e => console.log(e));

    this.database.executeSql('DELETE FROM \'utilisateur\'', [])
    .then(() => {
      console.log('Success requet drop table utilisateur');
    })
    .catch(e => console.log(e));
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
            apex: apexValues,
            dynamique: '',
            ifv_classe: this.user.model_ifv,
            proprietaire: proprietaire
           });
        }
      }
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

    // syncho des données
    syncData() {

    }

}
