


import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanAbonnementService } from './plan_abonnement.service';
import { PlanAbonnementFormComponent } from './form/plan_abonnement-form.component';

@Component({
  selector: 'app-plan_abonnement',
  templateUrl: './plan_abonnement.component.html',
  styleUrls: ['./plan_abonnement.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PlanAbonnementComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = [
    'code', 'nom', 'prix', 'duree', 'geler', 'dateCreation', 'action'
  ];

  public profilDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;
  public total = 0;

  /** Liste brute pour filtrer côté client */
  private _allData: any[] = [];

  constructor(
    private _planAbonnementService: PlanAbonnementService,
    private _matDialog: MatDialog,
    private _snackBar: MatSnackBar,   // ✅ AJOUT
  ) { }

  ngOnInit(): void {
    this.getListePlanAbonnement();
  }

  ngAfterViewInit(): void {
    this.profilDataSource.paginator = this.paginator;
    this.profilDataSource.sort = this.sort;
  }

  // ==========================================================================
  // LISTE
  // ==========================================================================
  getListePlanAbonnement(): void {
    this.inProgress = true;

    this._planAbonnementService.listerPlanAbonnements().subscribe({
      next: (response: any) => {
        // ✅ Réponse wrappée : { success, count, data: [...] }
        let list: any[] = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response?.data && Array.isArray(response.data)) {
          list = response.data;
        }

        this._allData = list;
        this.profilDataSource.data = list;
        this.total = list.length;
        this.inProgress = false;

        console.log('📋 Plans chargés :', list.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement plans abonnement :', err);
        this._allData = [];
        this.profilDataSource.data = [];
        this.total = 0;
        this.inProgress = false;

        this._snackBar.open(
          '❌ Erreur de chargement des plans',
          'Fermer',
          { duration: 3000 }
        );
      }
    });
  }

  // ==========================================================================
  // FILTRE
  // ==========================================================================
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.profilDataSource.filter = filterValue.trim().toLowerCase();
  }

  // ==========================================================================
  // OUVRIR LE FORMULAIRE (création / édition)
  // ==========================================================================
  openEditPlanAbonnementForm(data?: any): void {
    const dialogRef = this._matDialog.open(PlanAbonnementFormComponent, {
      width: '600px',
      disableClose: true,
      data: data ? { ...data } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getListePlanAbonnement();
      }
    });
  }

  // ==========================================================================
  // SUPPRESSION — ✅ AMÉLIORÉE
  // ==========================================================================
  deletePlanAbonnement(element: any): void {
    // ✅ 1. Récupère l'id, en supportant id OU id_pab
    const id = element?.id ?? element?.id_pab;

    if (!id) {
      console.warn('⚠️ Aucun id trouvé pour la suppression', element);
      this._snackBar.open(
        '❌ Impossible de supprimer : id manquant',
        'Fermer',
        { duration: 3000, panelClass: 'snackbar-error' }
      );
      return;
    }

    // ✅ 2. Récupère le libellé, en supportant nom OU libelle OU code
    const label =
      element.nom ??
      element.libelle ??
      element.code ??
      `#${id}`;

    // ✅ 3. Confirmation
    if (!confirm(`Confirmer la suppression de "${label}" ?`)) {
      return;
    }

    // ✅ 4. Indicateur de chargement
    this.inProgress = true;

    // ✅ 5. Appel API
    console.log('🗑️ Suppression du plan id =', id);

    this._planAbonnementService.supprimerPlanAbonnement(id).subscribe({
      next: (response) => {
        this.inProgress = false;
        console.log('✅ Suppression réussie :', response);

        // ✅ 6. Notification succès
        this._snackBar.open(
          `✅ "${label}" supprimé avec succès`,
          'Fermer',
          { duration: 3000, panelClass: 'snackbar-success' }
        );

        // ✅ 7. Recharge la liste
        this.getListePlanAbonnement();
      },
      error: (err) => {
        this.inProgress = false;
        console.error('❌ Erreur suppression :', err);
        console.error('📋 Détail erreur :', JSON.stringify(err?.error, null, 2));

        // ✅ 8. Message d'erreur clair
        let message = 'Erreur lors de la suppression';

        if (err?.error?.status?.error) {
          message = err.error.status.error;
        } else if (err?.error?.message) {
          message = err.error.message;
        } else if (err?.status === 500) {
          message = 'Erreur serveur (500) — vérifiez la console NestJS';
        } else if (err?.status === 404) {
          message = 'Plan introuvable (404)';
        } else if (err?.status === 0) {
          message = 'Serveur injoignable — vérifiez que NestJS est démarré';
        }

        this._snackBar.open(
          `❌ ${message}`,
          'Fermer',
          { duration: 5000, panelClass: 'snackbar-error' }
        );
      }
    });
  }
}