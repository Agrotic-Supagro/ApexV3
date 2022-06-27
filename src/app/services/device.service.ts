import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Entry, File, Metadata } from '@awesome-cordova-plugins/file/ngx';
import { GlobalConstants } from '../common/global-constants';
import * as $ from 'jquery';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private file : File) { }

  async getDeviceLanguage() : Promise<string> {
    const language = (await Device.getLanguageCode()).value;
    return language;
  }

  async getMetadata(file : Entry) : Promise<Metadata> {
    return new Promise((resolve, reject) => {
      file.getMetadata(success => resolve(success), fail => reject(fail));
    });
  }

  async getJSONCountrycodeConversionFile() : Promise<any>{
    return new Promise((resolve, reject) => {
      $.getJSON(Capacitor.convertFileSrc(this.file.dataDirectory + "assets/traductionHelper/countryCodeConversion.json"), data => resolve(data))
      .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "getJSON Failed: " + err );
        reject(err);
      });
    });
  }

  async removeFile(file : Entry) {
    return new Promise((resolve, reject) => {
      file.remove(function() {
        // if the file has been successfully removed
        resolve(true);
      }, function(error) {
          // if there was an error removing the file
          reject(error);
      });
    })
  }

  //Check the countryCodeConversion LOCAL FILE to compute the supported languages
  async computeSupportedLanguages(countryCode : string){
    console.log("Trying to compute supported languages");
    try {
      GlobalConstants.resetSupportedLanguages();
      var data = await this.getJSONCountrycodeConversionFile();
      $.each(data, function(key, val) {
        if(!GlobalConstants.getSupportedLanguages().has(key as string)){
          GlobalConstants.setSupportedLanguages(val ,key as string);
        }
        if(key == countryCode){
          console.log("Device language code supported");
          GlobalConstants.setDeviceLanguageSupported(true);
        }
      })
    }
    catch(error){
      console.log("Error during compute supported languages"+error);
    }
  }

  async checkFileExistence(deviceDirectoryPATH : string, directoryToCheck : string, filename : string){
    return this.file.listDir(deviceDirectoryPATH, directoryToCheck)
    .then(async entries => {
      if(entries.length == 0){
        console.log("Dossier "+directoryToCheck +" vide");
        if(directoryToCheck.includes("i18n")){
          GlobalConstants.setTradFilesNeverDownloaded(true);
        }
        return entries;
      }
      else{
        var found = false;
        for(const entry of entries){
          if(entry.isFile){
            if(entry.name == filename){
              found = true;
              var metadata = await this.getMetadata(entry);
              //Fichier vide
              if(metadata.size == 0){
                if(directoryToCheck.includes("i18n")){
                  GlobalConstants.setTradFileNeverDownloaded(true);
                }
              }
              else{
                console.log("Fichier "+filename+".json"+ "dans "+ directoryToCheck +" présent");
              }
            }
          }
        }
        if(!found && directoryToCheck.includes("i18n")){
          GlobalConstants.setTradFileNeverDownloaded(true);
        }
        return entries;
      }
    })
    .catch(error => {
      console.log("Error during checkFilesExistence : "+error);
      throw error;
    })
  }
  
  //Get or create a file ON THE DEVICE
  async getOrCreateLocalFile(element : any, deviceDirectoryPATH : string) {
    return this.file.resolveDirectoryUrl(deviceDirectoryPATH)
    .then( dirEntry => {
      return this.file.getFile(dirEntry, element.name, null)
      .then( res => {
        console.log("File "+element.name+" successfully got");
        return res;
      })
      .catch(error => {
        console.log("File :" +element.name+" do not exists in "+deviceDirectoryPATH+" on the device");
        return this.file.createFile(deviceDirectoryPATH, element.name, true)
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
      console.log("Error while resolving directoring url : "+deviceDirectoryPATH);
      throw error;
    })
  }

  //Creation of assets and in-assets directories ON THE DEVICE to be the same as on the server
  async checkOrCreateAssetsDirectories() {
    return this.file.checkDir(this.file.dataDirectory, "assets")
    .then( async res => {
      if(res){
        console.log("assets directory already created");

        //Checking i18n
        const i18n = await this.file.checkDir(this.file.dataDirectory, "assets/i18n")
        if(i18n){
          console.log("i18n directory already created");
        }
        else{
          await this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then(() => {
            console.log("i18n created");
          })
          .catch(error => {
            console.log("Error while creating i18n Dir : "+error);
            throw error;
          })
        }

        //Checking countriesIcons
        const countriesIcons = await this.file.checkDir(this.file.dataDirectory, "assets/countriesIcons")
        if(countriesIcons){
          console.log("countriesIcons directory already created");
        }
        else{
          await this.file.createDir(this.file.dataDirectory+"assets/", "countriesIcons", true)
          .then(() => {
            console.log("countriesIcons created");
          })
          .catch(error => {
            console.log("Error while creating countriesIcons Dir : "+error);
            throw error;
          })
        }
        //Checking traductionHelper
        const traductionHelper = await this.file.checkDir(this.file.dataDirectory, "assets/traductionHelper")
        if(traductionHelper){
          console.log("traductionHelper directory already created");
        }
        else{
          await this.file.createDir(this.file.dataDirectory+"assets/", "traductionHelper", true)
          .then(() => {
            console.log("traductionHelper created");
          })
          .catch(error => {
            console.log("Error while creating traductionHelper Dir : "+error);
            throw error;
          })
        }
      }
    })
    .catch(error => {
      console.log("assets do not exists : "+error);
      console.log("First connection of the device");
      GlobalConstants.setFirstConnection(true);
      return this.file.createDir(this.file.dataDirectory, "assets", true)
        .then( () => { 
          console.log("assets created");
          return this.file.createDir(this.file.dataDirectory+"assets/", "i18n", true)
          .then( () => {
            console.log("i18n created")
            return this.file.createDir(this.file.dataDirectory+"assets/", "countriesIcons", true)
            .then( () => {
              console.log("countriesIcons created")
              return this.file.createDir(this.file.dataDirectory+"assets/", "traductionHelper", true)
              .then( () => {
                console.log("traductionHelper created")
              })
              .catch(error => {
                console.log("Error while creating traductionHelper Dir : "+error);
                throw error;
              })
            })
            .catch(error => {
              console.log("Error while creating countriesIcons Dir : "+error);
              throw error;
            })
          })
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

}

