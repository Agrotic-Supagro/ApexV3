export interface User {
    id_utilisateur: string;
    nom: string;
    prenom: string;
    structure?: string;
    email?: string;
    mdp?: string;
    model_ifv: number;
    token: string;
}
