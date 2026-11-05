// ✅ RECONSTRUIT ENTIÈREMENT — l'ancienne version (libelle, description,
// utilisateurCreation...) était copiée depuis un module "Genre
// Personnes", sans aucun rapport avec une réservation.

export interface ReservationAnnonceInterface {
  readonly id: number;
  readonly titre: string;
}

export interface ReservationPersonneInterface {
  readonly id: number;
  readonly nom: string;
  readonly contact: string;
}

export interface ReservationInterface {
  readonly id: number;
  readonly dateDebut: Date;
  readonly dateFin: Date;
  readonly montantTotal: number;
  readonly montantFormatte: string;
  readonly statut: string;
  readonly description: string | null;
  readonly dateCreation: Date;
  readonly annonce: ReservationAnnonceInterface | null;
  readonly client: ReservationPersonneInterface | null;
  readonly proprietaire: ReservationPersonneInterface | null;
}