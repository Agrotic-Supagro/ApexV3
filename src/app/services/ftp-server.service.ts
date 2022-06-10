import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { File, MetadataCallback, Metadata } from '@awesome-cordova-plugins/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(private ftp : FTP, private file : File) { }

  async connectToServer(host : string, username : string, password : string){
    console.log("entré connect");
    return this.ftp.connect(host, username, password).then(result =>
      console.log("FTP Connect result : "+ result))
      .catch(error => console.log("Error during FTP connection : "+error));
  }

  //Compare modification dates (local/distant)
  //Return [true, filename] if we need to update=download the trad file
  async checkUpdates(path : string) : Promise<any> {
    console.log("entré check update");
    var tabRes = [];
    var localfileLastModified : Date;
    var serverfileLastModified : Date;
    var lastElementDone = false;
    var filename : string;
    this.ftp.ls(path).then(  result => {
      console.log("Result : "+result);
       result.forEach( async element => {
        console.log("Nom du fichier analysé: "+ element.name);
        console.log("Longueur du tableau : "+result.length);
        console.log("Index de l'element courant : "+result.indexOf(element));
        if(result.indexOf(element) + 1 == result.length){
          console.log("Dernier element : "+element.name);
          lastElementDone = true;
        }
        this.file.getFile(await this.file.resolveDirectoryUrl(this.file.dataDirectory+"assets/i18n/"), element.name, null)
        .then( res => {
          serverfileLastModified = element.modifiedDate;
          filename = element.name;
          res.getMetadata(success, fail);
        })
      })
    })
    .catch(error => console.log("Error during check updates : "+error));

    function success(metadata : Metadata) {
      console.log("Server File Last Modified : "+serverfileLastModified);
      console.log("Local File Last Modified : " + metadata.modificationTime);
      localfileLastModified = metadata.modificationTime;
      if(localfileLastModified == serverfileLastModified){
        console.log("dates de modif égales pour : "+filename);
        tabRes.push([false, filename]);
      }
      else{
        console.log("dates de modif pas égales : "+filename);
        tabRes.push([true,filename]);
      }

      if(lastElementDone){
        console.log("Tab Res : "+tabRes);
        return tabRes;
      }
    }

    function fail(error) {
      console.log("Error in metadata callback : "+error.code);
    }
  }

  //Check if there is assets directories ON THE DEVICE
  async checkOrCreateAssetsDirectories(){
    console.log("entré check or create dir");
    this.file.checkDir(this.file.dataDirectory, "assets").then( res => {
      console.log("assets existe ? : "+res);
      if (!res) {
        this.file.createDir(this.file.dataDirectory, "assets", true)
        .then( () => { return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .catch(error => console.log("Error while creating i18n Dir : "+error)) 
        })
        .catch(error => console.log("Error while creating assets Dir : "+error));
      }
      else{
        console.log("assets existe");
        this.file.checkDir(this.file.dataDirectory+"assets/", "i18n").then( res => {
          console.log("i18n existe ? : "+res);
          if (!res) {
            return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
              .catch(error => console.log("Error while creating i18n Dir : "+error));
          }
          else{
            console.log("i18n existe");
          }
        })
      }
    })
  }

  async downloadFile(localfile : string, remoteFile : string){
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
