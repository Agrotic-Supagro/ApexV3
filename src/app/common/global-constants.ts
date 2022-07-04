import { File } from '@awesome-cordova-plugins/file/ngx';
import { Capacitor } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';

export class GlobalConstants {

    private static file : File = new File();

    private static _translate: TranslateService;
    
    //App's Language
    private static languageSelected : string;

    //For parcelle-info.page.ts contrainte's graph
    public static absent : string;
    public static moderate : string;
    public static strong : string;
    public static strict : string;

    //Based on Server file countryCodeConversion.json
    private static supportedLanguages = new Map<string, string>();

    //FTP connection infos
    private static host : string = "ftp.agrotic.org";
    private static username : string = "apextrad@agrotic.org";
    private static password : string = "?93C+%iV.o0!Ab#^ro";

    //PATH of trad files on the server & on the device
    private static serverTradPATH : string = "/assets/i18n/";
    private static deviceTradDirectoryPATH : string = GlobalConstants.file.dataDirectory + "assets/i18n/";

    private static serverIconsPATH : string = "/assets/countriesIcons/";
    private static deviceIconsDirectoryPATH : string = GlobalConstants.file.dataDirectory + "assets/countriesIcons/";

    private static serverHelperPATH : string = "/assets/traductionHelper/";
    private static deviceHelperDirectoryPATH : string = GlobalConstants.file.dataDirectory + "assets/traductionHelper/";

    //First Download of the app (or Download after delete)
    private static firstConnection : boolean = false;

    private static tradFilesNeverDownloaded : boolean = false;
    private static tradFileNeverDownloaded : boolean = false;
    private static deviceLanguageSupported : boolean = false;

    //Path used by the translate plugin to load the .json trad files
    private static pathForHttpLoader : string = Capacitor.convertFileSrc(GlobalConstants.getDeviceTradDirectoryPATH());

    //Path used by the translate plugin to load the .json trad files
    private static pathForCountryIcons : string = Capacitor.convertFileSrc(GlobalConstants.file.dataDirectory + "assets/countriesIcons/");

    private static elapsedSeconds : number = 0;

    //GETTERS & SETTERS
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

    public static setServerIconsPATH(serverIconsPATH : string) {
        this.serverIconsPATH = serverIconsPATH;
    }
    public static getServerIconsPATH() {
         return this.serverIconsPATH;
    }

    public static setServerHelperPATH(serverHelperPATH : string) {
        this.serverHelperPATH = serverHelperPATH;
    }
    public static getServerHelperPATH() {
         return this.serverHelperPATH;
    }

    public static setDeviceTradDirectoryPATH(deviceTradDirectoryPATH : string) {
        this.deviceTradDirectoryPATH = deviceTradDirectoryPATH;
    }
    public static getDeviceTradDirectoryPATH() {
         return this.deviceTradDirectoryPATH;
    }

    public static setDeviceIconsDirectoryPATH(deviceIconsDirectoryPATH : string) {
        this.deviceIconsDirectoryPATH = deviceIconsDirectoryPATH;
    }
    public static getDeviceIconsDirectoryPATH() {
         return this.deviceIconsDirectoryPATH;
    }

    public static setDeviceHelperDirectoryPATH(deviceHelperDirectoryPATH : string) {
        this.deviceHelperDirectoryPATH = deviceHelperDirectoryPATH;
    }
    public static getDeviceHelperDirectoryPATH() {
         return this.deviceHelperDirectoryPATH;
    }

    public static setFirstConnection(firstConnection : boolean) {
        this.firstConnection = firstConnection;
    }
    public static getFirstConnection() {
         return this.firstConnection;
    }

    public static setDeviceLanguageSupported(deviceLanguageSupported : boolean) {
        this.deviceLanguageSupported = deviceLanguageSupported;
    }
    public static getDeviceLanguageSupported() {
         return this.deviceLanguageSupported;
    }

    public static setTradFilesNeverDownloaded(tradFilesNeverDownloaded : boolean) {
        this.tradFilesNeverDownloaded = tradFilesNeverDownloaded;
    }
    public static getTradFilesNeverDownloaded() {
         return this.tradFilesNeverDownloaded;
    }

    public static setTradFileNeverDownloaded(tradFileNeverDownloaded : boolean) {
        this.tradFileNeverDownloaded = tradFileNeverDownloaded;
    }
    public static getTradFileNeverDownloaded() {
         return this.tradFileNeverDownloaded;
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
    public static resetSupportedLanguages() {
        this.supportedLanguages = new Map<string, string>();
    }
    public static getSupportedLanguages() {
         return this.supportedLanguages;
    }

    public static incrementElapsedSeconds() {
        this.elapsedSeconds += 1;
    }
    public static getElapsedSeconds() {
        return this.elapsedSeconds;
    }
    public static resetElapsedSeconds(){
        this.elapsedSeconds = 0;
    }
}