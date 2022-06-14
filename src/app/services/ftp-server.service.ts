import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { File, FileEntry, FileError, Metadata } from '@awesome-cordova-plugins/file/ngx';
import { type } from 'os';


@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(private ftp : FTP, private file : File) { }

  async connectToServer(host : string, username : string, password : string){
    console.log("entré connect");
    return this.ftp.connect(host, username, password).then(result => {
      console.log("FTP Connect result : "+ result)
    })
    .catch(error => {
      console.log("Error during FTP connection : "+error);
    });
  }

  //Compare modification dates (local/distant)
  //Return [true, filename] if we need to update/re-download the trad file
  async checkUpdates(path : string) {
    console.log("entré check update");
    var lastElement = false;
    var tabRes = [];
    var serverfileLastModified : Date;
    var localfileLastModified : Date;
    var filename : string;
    return this.ftp.ls(path).then( async result => {
      console.log("Result : "+result);
      for(const element of result) {
        console.log("Nom du fichier analysé: "+ element.name);
        console.log("Longueur du tableau : "+result.length);
        if(result.indexOf(element) + 1 == result.length){
          console.log("Dernier element : "+element.name);
          lastElement = true;
        }
        await this.getOrCreateLocalFile(element)
        .then(async (fileEntry) => {
          console.log("get or create terminé pour : "+element.name);
          serverfileLastModified = new Date(element.modifiedDate);
          filename = element.name;
          await this.getMetadata(fileEntry)
          .then(metadata => {
            console.log("Server File Last Modif : "+serverfileLastModified);
            console.log("Local File Last Modif : " + metadata.modificationTime);
            localfileLastModified = metadata.modificationTime;
            if(localfileLastModified.toISOString() > serverfileLastModified.toISOString()){
              console.log("date de modif locale > date serveur pour : "+filename);
              tabRes.push([filename, false]);
            }
            else{
              console.log("date de modif locale < date serveur pour : "+filename);
              tabRes.push([filename, true]);
            }
          })
          .catch(error => {
            console.log("Error while getting metadata : "+error);
            throw error;
          });
        })
      }
      console.log("tabres avant return : "+tabRes);
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
    console.log("entre get or create file, element : "+element.name);
    return this.file.resolveDirectoryUrl(this.file.dataDirectory + "assets/i18n/")
    .then( dirEntry => {
      console.log("dir entry : "+dirEntry);
      return this.file.getFile(dirEntry, element.name, null)
      .then( res => {
        console.log("file successfully got : "+res);
        return res;
      })
      .catch(error => {
        console.log("File :" +element.name+" do not exists in assets/i18n/ on the device : "+error);
        return this.file.createFile(this.file.dataDirectory + "assets/i18n/", element.name, true)
        .then( async () => {
          console.log("file "+element.name+" successfully created")
          return this.file.getFile(dirEntry, element.name, null)
          .then( res => {
            console.log("file successfully got : "+res);
            return res;
          })
        })
        .catch(error => {
          console.log("error while creating "+element.name+" file : "+error);
          throw error;
        });
      })
    })
  }

  //Check if there is assets/i18n directories ON THE DEVICE
  async checkOrCreateAssetsDirectories(){
    console.log("entré check or create dir");
    return this.file.checkDir(this.file.dataDirectory, "assets").then( res => {
      console.log("assets existe ? : "+res);
      if(res){
        console.log("assets existe");
        return this.file.checkDir(this.file.dataDirectory+"assets/", "i18n").then( res => {
          console.log("i18n existe ? : "+res);
          if(res){
            console.log("i18n existe");
          }
        })
        .catch(error => {
          console.log("i18n do not exists : "+error);
          return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then( ()  =>  console.log("i18n created"))
          .catch(error => console.log("Error while creating i18n Dir : "+error));
        })
      }
    })
    .catch(error => {
      console.log("assets do not exists : "+error);
      return this.file.createDir(this.file.dataDirectory, "assets", true)
        .then( () => { 
          console.log("assets created");
          return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then( () => console.log("i18n created"))
          .catch(error => console.log("Error while creating i18n Dir : "+error)) 
        })
        .catch(error => console.log("Error while creating assets Dir : "+error));
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
    error => {
      console.log(" Error while downloading file : "+error);
    });
  }

  async disconnect() {
    console.log("entré disconnect");
    return this.ftp.disconnect().then(result => {
      console.log("FTP Disconnect result : "+ result);
    })
    .catch(error => {
      console.log("Error during FTP deconnection : "+error);
    });
  }
}
