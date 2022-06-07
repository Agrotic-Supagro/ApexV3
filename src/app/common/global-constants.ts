
export class GlobalConstants {

    //Variables globales

    //Langage de l'appli
    private static languageSelected : string;

    //Infos connexion FTP
    private static host : string = "ftp.agrotic.org";
    private static username : string = "apextrad@agrotic.org";
    private static password : string = "?93C+%iV.o0!Ab#^ro";

    //PATH des local files de traduction pour download FTP
    private static frPATH : string = "./assets/i18n/fr.json";
    private static enPATH : string = "./assets/i18n/en.json";

    //PATH des distant files de traduction pour download FTP
    private static frDistPATH : string = "/assets/i18n/fr.json";
    private static enDistPATH : string = "/assets/i18n/en.json";


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

    public static setFrPATH(frPATH : string) {
        this.frPATH = frPATH;
    }
    public static getFrPATH() {
         return this.frPATH;
    }

    public static setEnPATH(enPATH : string) {
        this.enPATH = enPATH;
    }
    public static getEnPATH() {
         return this.enPATH;
    }

    public static setFrDistPATH(frDistPATH : string) {
        this.frDistPATH = frDistPATH;
    }
    public static getFrDistPATH() {
         return this.frDistPATH;
    }

    public static setEnDistPATH(enDistPATH : string) {
        this.enDistPATH = enDistPATH;
    }
    public static getEnDistPATH() {
         return this.enDistPATH;
    }
}