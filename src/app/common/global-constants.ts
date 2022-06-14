
export class GlobalConstants {
    
    //Langage de l'appli
    private static languageSelected : string;

    //Infos connexion FTP
    private static host : string = "ftp.agrotic.org";
    private static username : string = "apextrad@agrotic.org";
    private static password : string = "?93C+%iV.o0!Ab#^ro";

    //PATH des fichiers de traduction sur le serveur distant
    private static distPATH : string = "/assets/i18n/";


    //Getters et Setters
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

    public static setDistPATH(distPATH : string) {
        this.distPATH = distPATH;
    }
    public static getDistPATH() {
         return this.distPATH;
    }
}