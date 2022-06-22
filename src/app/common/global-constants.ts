import { File } from '@awesome-cordova-plugins/file/ngx';
import { Capacitor } from '@capacitor/core';

export class GlobalConstants {

    private static file : File = new File();
    
    //App's Language
    private static languageSelected : string;

    private static supportedLanguages = new Map<string, string>();

    //FTP connection infos
    private static host : string = "ftp.agrotic.org";
    private static username : string = "apextrad@agrotic.org";
    private static password : string = "?93C+%iV.o0!Ab#^ro";

    //PATH of trad files on the server & on the device
    private static serverTradPATH : string = "/assets/i18n/";
    private static deviceTradDirectoryPATH : string = GlobalConstants.file.dataDirectory + "assets/i18n/";

    //First Download of the app (or Download after delete)
    private static firstConnection : boolean = false;

    private static tradFilesNeverDownloaded : boolean = false;

    //Path used by the translate plugin to load the .json trad files
    private static pathForHttpLoader : string = Capacitor.convertFileSrc(GlobalConstants.getDeviceTradDirectoryPATH());

    //Path used by the translate plugin to load the .json trad files
    private static pathForCountryIcons : string = Capacitor.convertFileSrc(GlobalConstants.file.dataDirectory + "assets/countriesIcons/");

    //Getters & Setters
    public static setLanguageSelected(newLang : string) {
        this.languageSelected = newLang;
    }
    public static getLanguageSelected() {
         return this.languageSelected;
    }

    public static setHost(host : string) {
        this.host = host;
    }
    public static getHost() {
         return this.host;
    }

    public static setUsername(username : string) {
        this.username = username;
    }
    public static getUsername() {
         return this.username;
    }

    public static setPassword(password : string) {
        this.password = password;
    }
    public static getPassword() {
         return this.password;
    }

    public static setServerTradPATH(serverTradPATH : string) {
        this.serverTradPATH = serverTradPATH;
    }
    public static getServerTradPATH() {
         return this.serverTradPATH;
    }

    public static setDeviceTradDirectoryPATH(deviceTradDirectoryPATH : string) {
        this.deviceTradDirectoryPATH = deviceTradDirectoryPATH;
    }
    public static getDeviceTradDirectoryPATH() {
         return this.deviceTradDirectoryPATH;
    }

    public static setFirstConnection(firstConnection : boolean) {
        this.firstConnection = firstConnection;
    }
    public static getFirstConnection() {
         return this.firstConnection;
    }

    public static setTradFilesNeverDownloaded(tradFilesNeverDownloaded : boolean) {
        this.tradFilesNeverDownloaded = tradFilesNeverDownloaded;
    }
    public static getTradFilesNeverDownloaded() {
         return this.tradFilesNeverDownloaded;
    }

    public static setPathForHttpLoader(pathForHttpLoader : string) {
        this.pathForHttpLoader = pathForHttpLoader;
    }
    public static getPathForHttpLoader() {
         return this.pathForHttpLoader;
    }

    public static setPathForCountryIcons(pathForCountryIcons : string) {
        this.pathForCountryIcons = pathForCountryIcons;
    }
    public static getPathForCountryIcons() {
         return this.pathForCountryIcons;
    }

    public static setSupportedLanguages(key : string, value  : string) {
        this.supportedLanguages.set(key, value);
    }
    public static loadSupportedLanguaged(array : ArrayBuffer) {
        
    }
    public static resetSupportedLanguages() {
        this.supportedLanguages = new Map<string, string>();
    }
    public static getSupportedLanguages() {
         return this.supportedLanguages;
    }
}