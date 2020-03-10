import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  AUTH_SERVER_ADDRESS = 'http://www.agrotic.org/apexv3-sync';

  constructor(
    private  httpClient: HttpClient
  ) { }

  sendEmail(dataEmail): Observable < any > {
    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/contact.php`, dataEmail)
    .pipe(
      tap(async (res: any) => {
        return res;
      })
    );
  }
}
