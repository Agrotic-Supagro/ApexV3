import { File } from '@awesome-cordova-plugins/file/ngx';

export class GlobalConstants {

    private static file : File = new File();
    
    //App's Language
    private static languageSelected : string;

    //FTP connection infos
    private static host : string = "ftp.agrotic.org";
    private static username : string = "apextrad@agrotic.org";
    private static password : string = "?93C+%iV.o0!Ab#^ro";

    //PATH of trad files on the server & on the device
    private static serverPATH : string = "/assets/i18n/";
    private static devicePATH : string = GlobalConstants.file.dataDirectory + "assets/i18n/";

    //First Download of the app (or Download after delete)
    private static firstConnection : boolean = false;

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

    public static setServerPATH(serverPATH : string) {
        this.serverPATH = serverPATH;
    }
    public static getServerPATH() {
         return this.serverPATH;
    }

    public static setDevicePATH(devicePATH : string) {
        this.devicePATH = devicePATH;
    }
    public static getDevicePATH() {
         return this.devicePATH;
    }

    public static setFirstConnection(firstConnection : boolean) {
        this.firstConnection = firstConnection;
    }
    public static getFirstConnection() {
         return this.firstConnection;
    }
}