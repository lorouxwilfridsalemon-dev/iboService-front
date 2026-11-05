// import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { SousCategoriesService } from './sous-categories.service';
// import { SousCategoriesFormComponent } from './form/sous-categories-form.component';
// import { DateAdapter } from '@angular/material/core';

// interface CategorieStat {
//   nomCategorie: string;
//   idCategorie: number;
//   nombre: number;
// }

// @Component({
//   selector: 'sous-categories',
//   templateUrl: './sous-categories.component.html',
//   encapsulation: ViewEncapsulation.None
// })
// export class SousCategoriesComponent {

//   constructor(
//     public _dialog: MatDialog,
//     private _sousCategoriesService: SousCategoriesService,
//     private _router: Router,
//     private _fuseConfirmationService: FuseConfirmationService,
//     private _adapter: DateAdapter<any>,
//   ) { }

//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort, { static: true }) sort: MatSort;

//   public displayedColumns: string[] = ['libelle', 'categorie', 'dateCreation', 'action'];
//   public sousCategoriesDataSource = new MatTableDataSource<any>([]);
//   public inProgress = false;

//   public searchText = '';
//   public listeSousCategories: any;

//   // ✅ CORRIGÉ : categoriesStats ne contient plus que les VRAIES
//   // catégories — les non-assignées sont comptées à part dans
//   // _nonAssigneesCount. Avant, l'entrée idCategorie:-1 était incluse
//   // dans ce tableau ET affichée séparément par la carte dédiée
//   // "Non assignées" plus bas, provoquant un doublon visuel.
//   public categoriesStats: CategorieStat[] = [];
//   public totalSousCategories: number = 0;
//   private _nonAssigneesCount: number = 0;

//   private borderColors = [
//     '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
//     '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'
//   ];

//   private iconBgColors = [
//     'rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.1)',
//     'rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)',
//     'rgba(245, 158, 11, 0.1)', 'rgba(6, 182, 212, 0.1)',
//     'rgba(239, 68, 68, 0.1)', 'rgba(99, 102, 241, 0.1)'
//   ];

//   private iconColors = [
//     '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
//     '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'
//   ];

//   ngOnInit() {
//     this.getListeSousCategories();
//   }

//   ngAfterViewInit(): void {
//     this.sousCategoriesDataSource.sort = this.sort;
//     this.sousCategoriesDataSource.paginator = this.paginator;
//   }

//   getBorderColor(index: number): string {
//     return this.borderColors[index % this.borderColors.length];
//   }

//   getIconBgColor(index: number): string {
//     return this.iconBgColors[index % this.iconBgColors.length];
//   }

//   getIconColor(index: number): string {
//     return this.iconColors[index % this.iconColors.length];
//   }

//   // ✅ CORRIGÉ : lit maintenant le compteur dédié _nonAssigneesCount,
//   // au lieu de chercher idCategorie === -1 dans categoriesStats (qui ne
//   // contient plus cette entrée).
//   getNonAssigneesCount(): number {
//     return this._nonAssigneesCount;
//   }

//   private calculerStatsParCategorie(sousCategories: any[]): void {
//     this.categoriesStats = [];
//     this.totalSousCategories = 0;
//     this._nonAssigneesCount = 0;

//     if (!sousCategories || sousCategories.length === 0) {
//       return;
//     }

//     const statsMap = new Map<number, { nomCategorie: string; nombre: number }>();

//     sousCategories.forEach(item => {
//       this.totalSousCategories++;

//       const categorie = item?.categorie;
//       if (categorie && categorie.id) {
//         if (statsMap.has(categorie.id)) {
//           statsMap.get(categorie.id)!.nombre++;
//         } else {
//           statsMap.set(categorie.id, {
//             nomCategorie: categorie.nom || 'Catégorie sans nom',
//             nombre: 1
//           });
//         }
//       } else {
//         // ✅ CORRIGÉ : les non-assignées sont comptées ici, à part —
//         // plus jamais ajoutées à statsMap (donc plus jamais dans
//         // categoriesStats, donc plus de doublon dans la boucle *ngFor).
//         this._nonAssigneesCount++;
//       }
//     });

//     this.categoriesStats = Array.from(statsMap.entries())
//       .map(([idCategorie, stat]) => ({
//         idCategorie,
//         nomCategorie: stat.nomCategorie,
//         nombre: stat.nombre
//       }))
//       .sort((a, b) => a.nomCategorie.localeCompare(b.nomCategorie));
//   }

//   getListeSousCategories() {
//     this.inProgress = true;
//     this._sousCategoriesService.getListeSousCategories().subscribe({
//       next: (result: any) => {
//         this.inProgress = false;
//         this.listeSousCategories = result?.data ?? [];
//         this.sousCategoriesDataSource.data = this.listeSousCategories;
//         this.sousCategoriesDataSource.sort = this.sort;
//         this.sousCategoriesDataSource.paginator = this.paginator;

//         this.calculerStatsParCategorie(this.listeSousCategories);
//       },
//       error: () => {
//         this.inProgress = false;
//       },
//     });
//   }

//   applyFilter(event?: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.sousCategoriesDataSource.filter = filterValue.trim().toLowerCase();

//     if (this.sousCategoriesDataSource.paginator) {
//       this.sousCategoriesDataSource.paginator.firstPage();
//     }
//   }

//   openEditSousCategoriesForm(sousCategories?: any) {
//     const data = sousCategories === undefined || sousCategories === null ? {} : sousCategories;
//     const dialogRef = this._dialog.open(SousCategoriesFormComponent, {
//       width: '800px',
//       disableClose: true,
//       data: data,
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.getListeSousCategories();
//       }
//     });
//   }

//   deleteSousCategories(sousCategories): void {
//     const confirmation = this._fuseConfirmationService.open({
//       title: 'Supprimer une sous-catégorie',
//       message: 'Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action ne peut pas être annulée !',
//       icon: {
//         show: true,
//         name: 'mat_solid:delete_forever',
//         color: 'warn',
//       },
//       actions: {
//         confirm: {
//           label: 'Supprimer',
//           color: 'warn',
//         },
//         cancel: {
//           show: true,
//           label: 'Annuler',
//         },
//       },
//       dismissible: false,
//     });

//     confirmation.afterClosed().subscribe((result) => {
//       if (result === 'confirmed') {
//         this.supprimer(sousCategories);
//       }
//     });
//   }

//   supprimer(sousCategories): void {
//     this.inProgress = true;
//     // ✅ MODIFIÉ : passe par le métier (suppression douce), au lieu de
//     // deleteSousCategories() qui appelait la route générique en
//     // suppression physique — bloquée par la contrainte de clé
//     // étrangère dès qu'une annonce référence encore cette
//     // sous-catégorie.
//     this._sousCategoriesService.supprimerSousCategories(sousCategories.id).subscribe({
//       next: (result) => {
//         this.inProgress = false;
//         if (result) {
//           this.getListeSousCategories();
//         }
//       },
//       error: () => {
//         this.inProgress = false;
//       },
//     });
//   }
// } 


import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SousCategoriesService } from './sous-categories.service';
import { SousCategoriesFormComponent } from './form/sous-categories-form.component';
import { DateAdapter } from '@angular/material/core';

interface CategorieStat {
  nomCategorie: string;
  idCategorie: number;
  nombre: number;
}

@Component({
  selector: 'sous-categories',
  templateUrl: './sous-categories.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SousCategoriesComponent {

  constructor(
    public _dialog: MatDialog,
    private _sousCategoriesService: SousCategoriesService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _adapter: DateAdapter<any>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = ['libelle', 'categorie', 'dateCreation', 'action'];
  public sousCategoriesDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;

  public searchText = '';
  public listeSousCategories: any;

  public categoriesStats: CategorieStat[] = [];
  public totalSousCategories: number = 0;
  private _nonAssigneesCount: number = 0;

  // Couleurs pour les icônes (on garde)
  private iconBgColors = [
    'rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.1)',
    'rgba(139, 92, 246, 0.1)', 'rgba(236, 72, 153, 0.1)',
    'rgba(245, 158, 11, 0.1)', 'rgba(6, 182, 212, 0.1)',
    'rgba(239, 68, 68, 0.1)', 'rgba(99, 102, 241, 0.1)'
  ];
  private iconColors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#EC4899',
    '#F59E0B', '#06B6D4', '#EF4444', '#6366F1'
  ];

  ngOnInit() {
    this.getListeSousCategories();
  }

  ngAfterViewInit(): void {
    this.sousCategoriesDataSource.sort = this.sort;
    this.sousCategoriesDataSource.paginator = this.paginator;
  }

  // ✅ NOUVELLE MÉTHODE pour les bordures Tailwind
  getBorderClass(index: number): string {
    const classes = [
      'border-blue-500',
      'border-green-500',
      'border-purple-500',
      'border-pink-500',
      'border-yellow-500',
      'border-cyan-500',
      'border-red-500',
      'border-indigo-500'
    ];
    return classes[index % classes.length];
  }

  // On garde ces méthodes pour les icônes
  getIconBgColor(index: number): string {
    return this.iconBgColors[index % this.iconBgColors.length];
  }

  getIconColor(index: number): string {
    return this.iconColors[index % this.iconColors.length];
  }

  getNonAssigneesCount(): number {
    return this._nonAssigneesCount;
  }

  private calculerStatsParCategorie(sousCategories: any[]): void {
    this.categoriesStats = [];
    this.totalSousCategories = 0;
    this._nonAssigneesCount = 0;

    if (!sousCategories || sousCategories.length === 0) {
      return;
    }

    const statsMap = new Map<number, { nomCategorie: string; nombre: number }>();

    sousCategories.forEach(item => {
      this.totalSousCategories++;

      const categorie = item?.categorie;
      if (categorie && categorie.id) {
        if (statsMap.has(categorie.id)) {
          statsMap.get(categorie.id)!.nombre++;
        } else {
          statsMap.set(categorie.id, {
            nomCategorie: categorie.nom || 'Catégorie sans nom',
            nombre: 1
          });
        }
      } else {
        this._nonAssigneesCount++;
      }
    });

    this.categoriesStats = Array.from(statsMap.entries())
      .map(([idCategorie, stat]) => ({
        idCategorie,
        nomCategorie: stat.nomCategorie,
        nombre: stat.nombre
      }))
      .sort((a, b) => a.nomCategorie.localeCompare(b.nomCategorie));
  }

  getListeSousCategories() {
    this.inProgress = true;
    this._sousCategoriesService.getListeSousCategories().subscribe({
      next: (result: any) => {
        this.inProgress = false;
        this.listeSousCategories = result?.data ?? [];
        this.sousCategoriesDataSource.data = this.listeSousCategories;
        this.sousCategoriesDataSource.sort = this.sort;
        this.sousCategoriesDataSource.paginator = this.paginator;

        this.calculerStatsParCategorie(this.listeSousCategories);
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }

  applyFilter(event?: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sousCategoriesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.sousCategoriesDataSource.paginator) {
      this.sousCategoriesDataSource.paginator.firstPage();
    }
  }

  openEditSousCategoriesForm(sousCategories?: any) {
    const data = sousCategories === undefined || sousCategories === null ? {} : sousCategories;
    const dialogRef = this._dialog.open(SousCategoriesFormComponent, {
      width: '800px',
      disableClose: true,
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListeSousCategories();
      }
    });
  }

  deleteSousCategories(sousCategories): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une sous-catégorie',
      message: 'Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action ne peut pas être annulée !',
      icon: {
        show: true,
        name: 'mat_solid:delete_forever',
        color: 'warn',
      },
      actions: {
        confirm: {
          label: 'Supprimer',
          color: 'warn',
        },
        cancel: {
          show: true,
          label: 'Annuler',
        },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(sousCategories);
      }
    });
  }

  supprimer(sousCategories): void {
    this.inProgress = true;
    this._sousCategoriesService.supprimerSousCategories(sousCategories.id).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.getListeSousCategories();
        }
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }
} 