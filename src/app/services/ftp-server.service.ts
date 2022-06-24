import { Injectable } from '@angular/core';
import { FTP } from '@awesome-cordova-plugins/ftp/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { GlobalConstants } from '../common/global-constants';
import * as $ from 'jquery';
import { DeviceService } from './device.service';


@Injectable({
  providedIn: 'root'
})
export class FtpServerService {

  constructor(private ftp : FTP, private file : File, private deviceService : DeviceService) { }

  async connectToServer(host : string, username : string, password : string) {
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
  //Return an array of for ex. [true, filename] if we need to update/re-download a file
  async checkUpdatesInServerDirectory(serverDirectoryPATH : string, deviceDirectoryPATH : string, filename? : string) {
    var tabRes : [string, boolean][] = [];
    var serverfileLastModified : Date;
    var localfileLastModified : Date;
    var filenameBis : string;
    return this.ftp.ls(serverDirectoryPATH).then( async result => {
      for(const element of result) {
        console.log("Nom du fichier analysé: "+ element.name);
        //Delete files if not present on the server
        var split = deviceDirectoryPATH.split("/");
        var newPath : string = "";
        var dirName : string = "";
        split.forEach(element => {
          if(split.indexOf(element) != (split.length-2) && split.indexOf(element) != (split.length-1)) {
            newPath += element+"/";
          }
        })
        newPath = newPath.slice(0, newPath.length-1);
        dirName = split[split.length -2]
        await this.file.listDir(newPath, dirName)
        .then( async (res) => {
          for(const entry of res) {
            if(entry.isFile){
              var found = false;
              for(const elem of result) {
                if(elem.name == entry.name) {
                  found = true;
                }
              }
              if(!found){
                console.log("File "+entry.name+" no longer exists on the server");
                if(entry.name.includes(".json")) {
                  var splitBis = entry.name.split(".json");
                  var name = splitBis[0];
                  for (let keyvalue of GlobalConstants.getSupportedLanguages().entries()) {
                    if(keyvalue[1] == name) {
                      GlobalConstants.getSupportedLanguages().delete(keyvalue[0]);
                    }
                  }
                }
                await this.deviceService.removeFile(entry)
                .then( (res) => {
                  console.log("File "+entry.name+" successfully deleted");
                })
                .catch(error => {
                  console.log("Error while deleting file : "+entry.name);
                })
              }
            }
          }
        })
        //Start process
        if(filename){
          if(filename == element.name){
            console.log("Fichier trouvé sur le serveur");
            serverfileLastModified = new Date(element.modifiedDate);
            await this.deviceService.getOrCreateLocalFile(element, deviceDirectoryPATH)
            .then(async (fileEntry) => {
              console.log("get or create file terminé pour : "+element.name);
              await this.deviceService.getMetadata(fileEntry)
              .then(metadata => {
                localfileLastModified = metadata.modificationTime;
                if(localfileLastModified.toISOString() > serverfileLastModified.toISOString() && metadata.size != 0){
                  console.log("Date de modif locale > date serveur pour : "+filename);
                  tabRes.push([filename, false]);
                }
                else{
                  console.log("Date de modif locale < date serveur pour : "+filename+" ou fichier vide");
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
        }
        else{
          serverfileLastModified = new Date(element.modifiedDate);
          filenameBis = element.name;
          await this.deviceService.getOrCreateLocalFile(element, deviceDirectoryPATH)
          .then(async (fileEntry) => {
            console.log("get or create file terminé pour : "+element.name);
            await this.deviceService.getMetadata(fileEntry)
            .then(metadata => {
              localfileLastModified = metadata.modificationTime;
              if(localfileLastModified.toISOString() > serverfileLastModified.toISOString() && metadata.size != 0){
                console.log("Date de modif locale > date serveur pour : "+filenameBis);
                tabRes.push([filenameBis, false]);
              }
              else{
                console.log("Date de modif locale < date serveur pour : "+filenameBis+" ou fichier vide");
                tabRes.push([filenameBis, true]);
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
      }
      console.log("Resultat check updates : "+tabRes);
      return tabRes;
    })
    .catch(error => {
      console.log("Error during check updates : "+error);
      throw error;
    });
  }

  async downloadFile(localPath : string, remotePath : string) {
    return new Promise((resolve, reject) => {
      this.ftp.download(localPath, remotePath).subscribe(percent => {
        if(percent == 1){
          //Download finished
          resolve(percent);
        } else {
          console.log("Download ongoing : "+ percent);
        }
      },
      error => {
        console.log("Error while downloading file at "+remotePath+" : "+error);
        reject(error);
      });
    })
  }

  async disconnect() {
    return this.ftp.disconnect().then(result => {
      console.log("FTP Disconnect result : "+ result);
      return result;
    })
    .catch(error => {
      console.log("Error during FTP disconnection : "+error);
      throw error;
    });
  }

  async downloadTradContent(countryCode : string){
    console.log("Starting downloadTradContent process");
    return this.deviceService.checkOrCreateAssetsDirectories()
    .catch(error => {
      throw error;
    })
    .then( () => {
      var filename = countryCode + ".json";
      return this.deviceService.checkFileExistence(this.file.dataDirectory + "assets/", "i18n", filename);
    })
    .catch(error => {
      throw error;
    })
    .then( () => {
      return this.deviceService.computeSupportedLanguages(countryCode);
    })
    .then( () => {
      if(GlobalConstants.getDeviceLanguageSupported() && !GlobalConstants.getTradFileNeverDownloaded()){
        console.log("entré set language selected:"+countryCode);
        GlobalConstants.setLanguageSelected(countryCode);
      }
      if(!GlobalConstants.getDeviceLanguageSupported()){
        console.log("entré set language selected english:"+countryCode);
        GlobalConstants.setLanguageSelected("en");
      }
      return this.connectToServer(GlobalConstants.getHost(),GlobalConstants.getUsername(), GlobalConstants.getPassword());
    })
    .catch(error => {
      throw error;
    })
    .then( () => {
      return this.checkUpdatesInServerDirectory("/assets/traductionHelper/", this.file.dataDirectory + "assets/traductionHelper/");
    })
    .catch(error => {
      throw error;
    })
    .then( async tab => {
      for(const element of tab) {
        if(element[1]) {
          await this.downloadFile(this.file.dataDirectory + "assets/traductionHelper/"+element[0], "/assets/traductionHelper/"+element[0])
          .then(async (res) => {
            console.log("Download Finished for " +element[0]+" : percent = "+res);
            if(element[0] == "countryCodeConversion.json"){
              const computed = await this.deviceService.computeSupportedLanguages(countryCode);
              if(GlobalConstants.getDeviceLanguageSupported() && !GlobalConstants.getTradFileNeverDownloaded()){
                console.log("entré set language selected :"+countryCode);
                GlobalConstants.setLanguageSelected(countryCode);
              }
            }
          })
          .catch(error => {
            throw error;
          });
        }
      }
     })
    .catch(error => {
      throw error;
    })
    .then( () => {
      var filename : string;
      if(!GlobalConstants.getDeviceLanguageSupported()){
        filename = "en.png";
      }
      else{
        filename = countryCode + ".png";
      }
      console.log("file to check: "+filename);
      return this.checkUpdatesInServerDirectory("/assets/countriesIcons/", this.file.dataDirectory + "assets/countriesIcons/", filename);
    })
    .catch(error => {
      throw error;
    })
    .then( async tab => {
      for(const element of tab) {
        if(element[1]) {
          await this.downloadFile(this.file.dataDirectory + "assets/countriesIcons/"+element[0], "/assets/countriesIcons/"+element[0])
          .then(async (res) => {
            console.log("Download Finished for " +element[0]+" : percent = "+res);
          })
          .catch(error => {
            throw error;
          });
        }
      }
     })
    .catch(error => {
      throw error;
    })
    .then( () => {
      var filename : string;
      if(!GlobalConstants.getDeviceLanguageSupported()){
        filename = "en.json";
      }
      else{
        filename = countryCode + ".json";
      }
      console.log("file to check : "+filename);
      return this.checkUpdatesInServerDirectory(GlobalConstants.getServerTradPATH(), GlobalConstants.getDeviceTradDirectoryPATH(), filename);
    })
    .catch(error => {
      throw error;
    })
    .then( async tab => {
      for(const element of tab) {
        if(element[1]) {
          await this.downloadFile(GlobalConstants.getDeviceTradDirectoryPATH()+element[0], GlobalConstants.getServerTradPATH()+element[0])
          .then(async (res) => {
            console.log("Download Finished for " +element[0]+" : percent = "+res);
          })
          .catch(error => {
            throw error;
          });
        }
      }
      GlobalConstants.setTradFilesNeverDownloaded(false);
    })
    .catch(error => {
      throw error;
    })
    .then( () => {
      return this.disconnect();
    })
    .catch(error => {
      throw error;
    })
  }
}