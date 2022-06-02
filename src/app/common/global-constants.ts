
export class GlobalConstants {

    //Variables globales

    //Langage de l'appli
    private static languageSelected : string;


    //Getters et Setters
    public static setLanguageSelected(newLang : string) {
        this.languageSelected = newLang;
    }

    public static getLanguageSelected() {
         return this.languageSelected;
    }
}