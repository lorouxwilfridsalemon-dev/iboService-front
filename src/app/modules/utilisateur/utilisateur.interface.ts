// utilisateur.interface.ts
export interface UtilisateurInterface {
  readonly id: number;
  readonly nom: string;
  readonly prenom: string;
  readonly pseudo: string;
  readonly email: string;
  readonly contact: string;
  readonly description: string;
  readonly language: string;
  readonly devise: string;
  readonly photo: string;
  readonly geler: number;
  readonly dateCreation: Date;
  readonly idusrcreation: number;
  readonly profil?: any;
  readonly annonces?: any[];
  readonly notifications?: any[];
}