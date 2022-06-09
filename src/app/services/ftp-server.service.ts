import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';

@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(private ftp : FTP) { }

  async connectToServer(host : string, username : string, password : string){
    console.log("entré connect");
    return this.ftp.connect(host, username, password).then(result =>
      console.log("FTP Connect result : "+ result))
      .catch(error => console.log("Error during FTP connection : "+error));
  }

  async downloadTradFile(localfile : string, remoteFile : string){
    console.log("entré download");
    return this.ftp.download(localfile, remoteFile).subscribe(percent => {
      if(percent == 1){
        console.log("Download finished");
      } else {
        console.log("Download percent : "+ percent);
      }
    },
    error => console.log(" Error while downloading file : "+error));
  }

  async disconnect() {
    console.log("entré disconnect");
    return this.ftp.disconnect().then(result =>
      console.log("FTP Disconnect result : "+ result))
      .catch(error => console.log("Error during FTP deconnection : "+error));
  }
}
