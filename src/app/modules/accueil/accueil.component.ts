import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AnnonceService } from '../annonce/annonce.service';
import { ReservationService } from '../reservation/reservation.service';
import { CategoriesService } from '../parametre/categories/categories.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';

@Component({
  selector: 'accueil',
  templateUrl: './accueil.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AccueilComponent implements OnInit {

  // Statistiques principales
  public totalAnnonces = 0;
  public totalReservations = 0;
  public totalCategories = 0;
  public totalUtilisateurs = 0;

  // Statistiques secondaires
  public annoncesActives = 0;
  public reservationsConfirmees = 0;
  public reservationsEnAttente = 0;
  public utilisateursActifs = 0;

  public inProgress = false;

  constructor(
    private _annonceService: AnnonceService,
    private _reservationService: ReservationService,
    private _categoriesService: CategoriesService,
    private _utilisateurService: UtilisateurService,
  ) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.inProgress = true;

    // ✅ Total annonces + actives
    this._annonceService.getListeAnnonceAll().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];
        this.totalAnnonces = list.length;
        this.annoncesActives = list.filter(
          (a: any) => a.statut === 'active' || a.statut === 'actif'
        ).length;
      },
      error: () => { this.totalAnnonces = 0; this.annoncesActives = 0; }
    });

    // ✅ Total réservations + confirmées/en attente
    this._reservationService.listeAdmin().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];
        this.totalReservations = list.length;
        this.reservationsConfirmees = list.filter(
          (r: any) => r.statut === 'confirmee' || r.statut === 'confirme'
        ).length;
        this.reservationsEnAttente = list.filter(
          (r: any) => r.statut === 'en_attente'
        ).length;
      },
      error: () => {
        this.totalReservations = 0;
        this.reservationsConfirmees = 0;
        this.reservationsEnAttente = 0;
      }
    });

    // ✅ Total catégories
    this._categoriesService.listeCategories().subscribe({
      next: (res: any) => {
        this.totalCategories = (res?.data ?? []).length;
      },
      error: () => { this.totalCategories = 0; }
    });

    // ✅ Total utilisateurs + actifs
    this._utilisateurService.findAll().subscribe({
      next: (res: any) => {
        const list = res?.data ?? [];
        this.totalUtilisateurs = list.length;
        this.utilisateursActifs = list.filter(
          (u: any) => u.geler === 0 || u.actif === 1
        ).length;
      },
      error: () => { this.totalUtilisateurs = 0; this.utilisateursActifs = 0; }
    });

    // ✅ Fin du chargement après un court délai
    setTimeout(() => { this.inProgress = false; }, 800);
  }

  // ✅ Helper pour calculer un pourcentage
  pourcentage(valeur: number, total: number): number {
    if (!total) return 0;
    return Math.round((valeur / total) * 100);
  }
} 