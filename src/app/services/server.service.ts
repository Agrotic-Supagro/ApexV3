import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  AUTH_SERVER_ADDRESS = 'https://www.agrotic.org/apexv3-sync';

  constructor(
    private  httpClient: HttpClient
  ) { }

  // contact : email envoyé à l'équipe AgroTIC
  sendEmail(dataEmail): Observable < any > {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/contact.php`, dataEmail)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  // envoyé les données à l'utilisateur
  sendData(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/send_data.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

    // EasterEgg qui envoie toutes les données du tel
    sendAllDataEgg(data) {
      return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/send_all_data.php`, data)
      .pipe(
        tap(async (res: any) => {
          return res;
        })
      );
    }

  // télécharger toutes les données du l'utilsateur
  recieveData(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/retrieve_data.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  // partager une parcelle
  shareParcelle(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/share_parcelle.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  // télécharger les parcelles qu'on nous a partagé
  getParcelleShared(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/sync_parcelle_shared.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  // message que l'on enverrait
  getMessage() {
  }

  // syncho des données avec le serveur
  syncData(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/sync_data.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  syncUser(data) {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/sync_data.php`, data)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

  updateStadePheno() {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/update_stade_pheno.php`, [])
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }

}
