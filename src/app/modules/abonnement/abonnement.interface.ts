export type TypeFacturation = 'gratuit' | 'mensuel' | 'a_vie';

export type AbonnementStatut =
  | 'en_attente'
  | 'actif'
  | 'expire'
  | 'annule'
  | 'suspendu';

export interface PlanAbonnementInterface {
  id: number;
  code: string;
  nom: string;
  description?: string;
  prix: number;
  devise: string;
  typeFacturation: TypeFacturation;
  avantages: {
    nbAnnoncesMax: number;
    videoAutorisee: boolean;
    badgeActif: boolean;
    nbPhotosMax: number;
  };
  affichage: {
    ordre: number;
    populaire: boolean;
    couleur: string;
  };
}

export interface AbonnementInterface {
  id: number;
  reference: string;
  typeFacturation: TypeFacturation;
  dateDebut: string;
  dateFin?: string | null;
  dateProchainPaiement?: string | null;
  montantPaye: number;
  devise: string;
  statut: AbonnementStatut;
  autoRenouvellement: boolean;
  dateAnnulation?: string | null;
  raisonAnnulation?: string | null;
  compteurs: {
    annoncesUtilisees: number;
    boostsUtilises: number;
  };
  plan?: PlanAbonnementInterface | null;
  dateCreation: string;
}