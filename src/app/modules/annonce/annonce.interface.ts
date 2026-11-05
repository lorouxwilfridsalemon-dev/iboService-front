export interface ProprietaireInterface {
  readonly id: number;
  readonly nom: string;
  readonly contact: string;
  readonly email?: string;
}

export interface SousCategorieInterface {
  readonly id: number;
  readonly nom: string;
}

export interface ConditionsLocationInterface {
  readonly cautionMois: string | null;
  readonly avanceMois: string | null;
  readonly fraisVisite: number | null;
}

export interface AnnonceImageInterface {
  readonly id: number;
  readonly nom: string;
  readonly ordre: number;
}

export interface AnnonceVideoInterface {
  readonly id: number;
  readonly nom: string;
  readonly description: string;
  readonly cheminVideo: string;
}

export interface AnnonceAvisInterface {
  readonly id: number;
  readonly nom: string;
  readonly description: string;
  readonly dateCreation: Date;
}

export interface AnnonceCaracteristiqueInterface {
  readonly id: number;
  readonly caracteristiqueId: number;
  readonly nom: string;
  readonly valeur: string;
}

export interface AnnonceInterface {
  readonly id: number;
  readonly titre: string;
  readonly description: string;
  readonly prix: number;
  readonly typePrix?: string;
  readonly sansPrix: boolean;
  readonly prixFormatte: string | null;
  readonly statut: string;
  readonly adresse: string;
  readonly dateCreation: Date;
  readonly longitude: number | null;
  readonly latitude: number | null;
  readonly typeLocation: string | null;
  readonly conditionsLocation: ConditionsLocationInterface;
  readonly categorie: SousCategorieInterface | null;
  readonly sousCategorie: SousCategorieInterface | null;
  readonly proprietaire: ProprietaireInterface | null;

  // ✅ AJOUT : champs enrichis du détail (inspirés du mobile).
  readonly images?: AnnonceImageInterface[];
  readonly videos?: AnnonceVideoInterface[];
  readonly avis?: AnnonceAvisInterface[];
  readonly nombreAvis?: number;
  readonly caracteristiques?: AnnonceCaracteristiqueInterface[];
  readonly nombreChambres?: number;
  readonly nombreDouches?: number;
  readonly nombreSalon?: number;
  readonly estMeuble?: boolean;
  readonly estAutomatique?: boolean;
  readonly aGps?: boolean;
  readonly docCv?: string | null;
  readonly piece?: string | null;
}