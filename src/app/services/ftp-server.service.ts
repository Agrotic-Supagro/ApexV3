import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { File, FileEntry, Metadata } from '@awesome-cordova-plugins/file/ngx';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(private ftp : FTP, private file : File) { }

  async connectToServer(host : string, username : string, password : string){
    return this.ftp.connect(host, username, password).then(result => {
      console.log("FTP Connect result : "+ result);
      return result;
    })
    .catch(error => {
      console.log("Error during FTP connection : "+error);
      throw error;
    });
  }

  //Compare modification dates (local/server)
  //Return [true, filename] if we need to update/re-download the trad file
  async checkUpdates(path : string) {
    var tabRes : [string, boolean][] = [];
    var serverfileLastModified : Date;
    var localfileLastModified : Date;
    var filename : string;
    return this.ftp.ls(path).then( async result => {
      for(const element of result) {
        console.log("Nom du fichier analysé: "+ element.name);
        await this.getOrCreateLocalFile(element)
        .then(async (fileEntry) => {
          console.log("get or create terminé pour : "+element.name);
          serverfileLastModified = new Date(element.modifiedDate);
          filename = element.name;
          await this.getMetadata(fileEntry)
          .then(metadata => {
            localfileLastModified = metadata.modificationTime;
            if(localfileLastModified.toISOString() > serverfileLastModified.toISOString()){
              console.log("Date de modif locale > date serveur pour : "+filename);
              tabRes.push([filename, false]);
            }
            else{
              console.log("Date de modif locale < date serveur pour : "+filename);
              tabRes.push([filename, true]);
            }
          })
          .catch(error => {
            console.log("Error while getting metadata : "+error);
            throw error;
          });
        })
        .catch(error => {
          throw error;
        })
      }
      console.log("Resultat check updates : "+tabRes);
      return tabRes;
    })
    .catch(error => {
      console.log("Error during check updates : "+error);
      throw error;
    });
  }

  async getMetadata(file : FileEntry) : Promise<Metadata> {
    return new Promise((resolve, reject) => {
      file.getMetadata(success => resolve(success), fail => reject(fail));
    });
  }

  async getOrCreateLocalFile(element : any) {
    return this.file.resolveDirectoryUrl(GlobalConstants.getDevicePATH())
    .then( dirEntry => {
      return this.file.getFile(dirEntry, element.name, null)
      .then( res => {
        console.log("File "+element.name+" successfully got");
        return res;
      })
      .catch(error => {
        console.log("File :" +element.name+" do not exists in assets/i18n/ on the device");
        return this.file.createFile(GlobalConstants.getDevicePATH(), element.name, true)
        .then( async () => {
          console.log("File "+element.name+" successfully created");
          return this.file.getFile(dirEntry, element.name, null)
          .then( res => {
            console.log("File "+element.name+" successfully got");
            return res;
          })
          .catch(error => {
            console.log("Error while getting the file "+element.name+" : "+error);
            throw error;
          })
        })
        .catch(error => {
          console.log("Error while creating "+element.name+" file : "+error);
          throw error;
        });
      })
    })
    .catch(error => {
      console.log("Error while resolving directoring url : "+GlobalConstants.getDevicePATH());
      throw error;
    })
  }

  //Check if there is assets & i18n directories ON THE DEVICE
  async checkOrCreateAssetsDirectories() {
    return this.file.checkDir(this.file.dataDirectory, "assets").then( res => {
      if(res){
        console.log("assets existe");
        return this.file.checkDir(this.file.dataDirectory+"assets/", "i18n").then( res => {
          if(res){
            console.log("i18n existe");
          }
        })
        .catch(error => {
          console.log("i18n do not exists : "+error);
          return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then( ()  =>  console.log("i18n created"))
          .catch(error => {
            console.log("Error while creating i18n Dir : "+error);
            throw error;
        });
        })
      }
    })
    .catch(error => {
      console.log("assets do not exists : "+error);
      //First connection of the device
      GlobalConstants.setFirstConnection(true);
      return this.file.createDir(this.file.dataDirectory, "assets", true)
        .then( () => { 
          console.log("assets created");
          return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then( () => console.log("i18n created"))
          .catch(error => {
            console.log("Error while creating i18n Dir : "+error);
            throw error;
          }) 
        })
        .catch(error => {
          console.log("Error while creating assets Dir : "+error)
          throw error;
        });
    })
  }

  async downloadFile(localPath : string, remotePath : string){
    return this.ftp.download(localPath, remotePath).subscribe(percent => {
      if(percent == 1){
        console.log("Download finished");
        return percent;
      } else {
        console.log("Download ongoing : "+ percent);
      }
    },
    error => {
      console.log("Error while downloading file at "+remotePath+" : "+error);
      throw error;
    });
  }

  async disconnect() {
    return this.ftp.disconnect().then(result => {
      console.log("FTP Disconnect result : "+ result);
      return result;
    })
    .catch(error => {
      console.log("Error during FTP deconnection : "+error);
      throw error;
    });
  }
}