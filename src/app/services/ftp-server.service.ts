import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(public ftp: FTP) { }

  connectToServer(host : string, username : string, password : string){
    this.ftp.connect(host, username, password)
    .then((res : any) => console.log('Login to ftp server successful', res))
    .catch((error : any) => console.log(error));
  }

  downloadTradFile(localfile : string, remoteFile : string){
    this.ftp.download(localfile, remoteFile).subscribe(
      (resDL : any) => {
        if(resDL == 1) {
          console.log("Download of trad file completed");
        }
      },
      err => console.log(err)
    )
  }


}
