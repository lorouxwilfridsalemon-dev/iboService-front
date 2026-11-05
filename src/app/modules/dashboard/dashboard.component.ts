import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from './dashboard.service';

interface PointTendance {
  libelle: string;
  nombre: number;
}

interface RepartitionCategorie {
  nom: string;
  nombre: number;
}

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  constructor(private _dashboardService: DashboardService) { }

  public inProgress = false;

  // =========================================================
  // ANNONCES
  // =========================================================
  public periodicite = { jour: 0, semaine: 0, mois: 0, annee: 0, total: 0 };
  public tendance: PointTendance[] = [];
  public maxTendance = 1;
  public annonces = { total: 0, actives: 0, enAttente: 0, refusees: 0 };

  // =========================================================
  // UTILISATEURS
  // =========================================================
  public utilisateurs = { total: 0, actifs: 0, inactifs: 0 };

  // =========================================================
  // RÉSERVATIONS
  // =========================================================
  public reservations = {
    total: 0,
    enAttente: 0,
    confirmees: 0,
    annulees: 0,
    montantTotalConfirme: 0
  };

  // =========================================================
  // ✅ ABONNEMENTS
  // =========================================================
  public abonnements = {
    total: 0,
    actifs: 0,
    enAttente: 0,
    expires: 0,
    annules: 0,
    montantTotal: 0,
    montantMois: 0,
    tauxActivation: 0,
  };

  // =========================================================
  // CATÉGORIES
  // =========================================================
  public parCategorie: RepartitionCategorie[] = [];
  public maxCategorie = 1;

  // =========================================================
  // FILTRES PÉRIODE
  // =========================================================
  public recensementControle: 'jour' | 'semaine' | 'mois' | 'annee' = 'jour';
  public dateJour: Date = new Date();
  public dateSemaine: Date = new Date();
  public moisSelectionne: number = new Date().getMonth() + 1;
  public anneeSelectionnee: number = new Date().getFullYear();
  public filtreActif = false;
  private _dateDebut: Date | null = null;
  private _dateFin: Date | null = null;

  public readonly periodesDisponibles: {
    valeur: 'jour' | 'semaine' | 'mois' | 'annee';
    libelle: string;
    icone: string;
  }[] = [
    { valeur: 'jour',  libelle: 'Jour',  icone: 'heroicons_outline:calendar'  },
    { valeur: 'mois',  libelle: 'Mois',  icone: 'heroicons_outline:calendar'  },
    { valeur: 'annee', libelle: 'Année', icone: 'heroicons_outline:chart-bar' },
  ];

  public readonly mois = [
    { id: 1,  name: 'Janvier'   }, { id: 2,  name: 'Février'   }, { id: 3,  name: 'Mars'      },
    { id: 4,  name: 'Avril'     }, { id: 5,  name: 'Mai'       }, { id: 6,  name: 'Juin'      },
    { id: 7,  name: 'Juillet'   }, { id: 8,  name: 'Août'      }, { id: 9,  name: 'Septembre' },
    { id: 10, name: 'Octobre'   }, { id: 11, name: 'Novembre'  }, { id: 12, name: 'Décembre'  },
  ];

  public readonly annees: { id: number; name: string }[] = (() => {
    const anneeActuelle = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => ({
      id: anneeActuelle - i,
      name: String(anneeActuelle - i),
    }));
  })();

  public readonly couleursCategories = [
    '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
    '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'
  ];

  // =========================================================
  // LIFE CYCLE
  // =========================================================
  ngOnInit() {
    this.chargerTout();
  }

  chargerTout(): void {
    this.inProgress = true;

    // Annonces par périodicité
    this._dashboardService.annoncesParPeriodicite().subscribe({
      next: (result: any) => { this.periodicite = result?.data ?? this.periodicite; },
    });

    // Tendance 12 mois
    this._dashboardService.annoncesTendance().subscribe({
      next: (result: any) => {
        this.tendance = result?.data ?? [];
        this.maxTendance = Math.max(1, ...this.tendance.map((t) => t.nombre));
      },
    });

    // Abonnements stats
    this._dashboardService.abonnementsStats(this._dateDebut, this._dateFin).subscribe({
      next: (result: any) => {
        const data = result?.data ?? {};
        this.abonnements = {
          total:          data.total          ?? 0,
          actifs:         data.actifs         ?? 0,
          enAttente:      data.enAttente      ?? 0,
          expires:        data.expires        ?? 0,
          annules:        data.annules        ?? 0,
          montantTotal:   data.montantTotal   ?? 0,
          montantMois:    data.montantMois    ?? 0,
          tauxActivation: data.tauxActivation ?? 0,
        };
      },
      error: (err) => console.error('❌ Erreur stats abonnements :', err),
    });

    // Vue d'ensemble
    this._chargerVueEnsemble();
  }

  // =========================================================
  // RECHERCHE PAR PÉRIODE
  // =========================================================
  rechercherParPeriode(): void {
    let debut: Date;
    let fin: Date;

    switch (this.recensementControle) {
      case 'jour': {
        debut = new Date(this.dateJour);
        debut.setHours(0, 0, 0, 0);
        fin = new Date(this.dateJour);
        fin.setHours(23, 59, 59, 999);
        break;
      }
      case 'semaine': {
        const ref = new Date(this.dateSemaine);
        const jourSemaine = ref.getDay();
        const decalage = jourSemaine === 0 ? 6 : jourSemaine - 1;
        debut = new Date(ref);
        debut.setDate(ref.getDate() - decalage);
        debut.setHours(0, 0, 0, 0);
        fin = new Date(debut);
        fin.setDate(debut.getDate() + 6);
        fin.setHours(23, 59, 59, 999);
        break;
      }
      case 'mois': {
        debut = new Date(this.anneeSelectionnee, this.moisSelectionne - 1, 1);
        fin   = new Date(this.anneeSelectionnee, this.moisSelectionne, 0, 23, 59, 59, 999);
        break;
      }
      case 'annee': {
        debut = new Date(this.anneeSelectionnee, 0, 1);
        fin   = new Date(this.anneeSelectionnee, 11, 31, 23, 59, 59, 999);
        break;
      }
    }

    this._dateDebut = debut;
    this._dateFin = fin;
    this.filtreActif = true;
    this.inProgress = true;

    // Recharge les stats abonnements avec le filtre
    this._dashboardService.abonnementsStats(this._dateDebut, this._dateFin).subscribe({
      next: (result: any) => {
        const data = result?.data ?? {};
        this.abonnements = {
          total:          data.total          ?? 0,
          actifs:         data.actifs         ?? 0,
          enAttente:      data.enAttente      ?? 0,
          expires:        data.expires        ?? 0,
          annules:        data.annules        ?? 0,
          montantTotal:   data.montantTotal   ?? 0,
          montantMois:    data.montantMois    ?? 0,
          tauxActivation: data.tauxActivation ?? 0,
        };
      },
    });

    this._chargerVueEnsemble();
  }

  reinitialiserFiltre(): void {
    this._dateDebut = null;
    this._dateFin = null;
    this.filtreActif = false;
    this.inProgress = true;

    // Recharge les stats abonnements sans filtre
    this._dashboardService.abonnementsStats().subscribe({
      next: (result: any) => {
        const data = result?.data ?? {};
        this.abonnements = {
          total:          data.total          ?? 0,
          actifs:         data.actifs         ?? 0,
          enAttente:      data.enAttente      ?? 0,
          expires:        data.expires        ?? 0,
          annules:        data.annules        ?? 0,
          montantTotal:   data.montantTotal   ?? 0,
          montantMois:    data.montantMois    ?? 0,
          tauxActivation: data.tauxActivation ?? 0,
        };
      },
    });

    this._chargerVueEnsemble();
  }

  private _chargerVueEnsemble(): void {
    this._dashboardService.vueEnsemble(this._dateDebut, this._dateFin).subscribe({
      next: (result: any) => {
        this.inProgress = false;
        const data = result?.data;
        if (data) {
          this.annonces = data.annonces;
          this.utilisateurs = data.utilisateurs;
          this.reservations = data.reservations;
          this.parCategorie = data.parCategorie ?? [];
          this.maxCategorie = Math.max(1, ...this.parCategorie.map((c) => c.nombre));
        }
      },
      error: () => { this.inProgress = false; },
    });
  }

  // =========================================================
  // HELPERS
  // =========================================================
  getCouleurCategorie(index: number): string {
    return this.couleursCategories[index % this.couleursCategories.length];
  }

  hauteurBarre(nombre: number): number {
    return this.maxTendance > 0 ? Math.max(4, (nombre / this.maxTendance) * 100) : 4;
  }

  largeurBarreCategorie(nombre: number): number {
    return this.maxCategorie > 0 ? Math.max(4, (nombre / this.maxCategorie) * 100) : 4;
  }

  formatMontant(montant: number): string {
    return (Number(montant) || 0).toLocaleString('fr-FR');
  }

  pourcentage(valeur: number, total: number): number {
    if (!total) return 0;
    return Math.round((valeur / total) * 100);
  }

  getTotalCategories(): number {
  return this.parCategorie.reduce((sum, c) => sum + c.nombre, 0);
}

} 