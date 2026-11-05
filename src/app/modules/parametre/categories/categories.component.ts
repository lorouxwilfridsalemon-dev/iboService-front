
// import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { MatSort } from '@angular/material/sort';
// import { MatPaginator } from '@angular/material/paginator';
// import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { MatTableDataSource } from '@angular/material/table';
// import { CategoriesService } from './categories.service';
// import { SousCategoriesService } from '../sous-categories/sous-categories.service';
// import { DateAdapter } from '@angular/material/core';
// import { CategoriesFormComponent } from './form/categories-form.component';

// interface CategorieAvecStat {
//   id: number;
//   nom: string;
//   description: string;
//   dateCreation: Date;
//   nombreSousCategories: number;
// }

// @Component({
//   selector: 'categories',
//   templateUrl: './categories.component.html',
//   encapsulation: ViewEncapsulation.None
// })
// export class CategoriesComponent {
//   constructor(
//     public _dialog: MatDialog,
//     private _categoriesService: CategoriesService,
//     // ✅ AJOUT : nécessaire pour compter les sous-catégories par
//     // catégorie (même principe que les cartes de Sous-catégories).
//     private _sousCategoriesService: SousCategoriesService,
//     private _router: Router,
//     private _fuseConfirmationService: FuseConfirmationService,
//     private _adapter: DateAdapter<any>,
//   ) { }

//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort, { static: true }) sort: MatSort;

//   public displayedColumns: string[] = ['libelle', 'description', 'nombreSousCategories', 'dateCreation', 'action'];
//   public categoriesDataSource = new MatTableDataSource<any>([]);
//   public inProgress = false;

//   public searchText = '';
//   public listeCategories: any;

//   // ✅ AJOUT : statistiques pour les cartes du tableau de bord.
//   public categoriesStats: CategorieAvecStat[] = [];
//   public totalCategories = 0;
//   public totalSousCategoriesGlobal = 0;

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
//     this.getListeCategories();
//   }

//   ngAfterViewInit(): void {
//     this.categoriesDataSource.sort = this.sort;
//     this.categoriesDataSource.paginator = this.paginator;
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

//   /**
//    * ✅ AJOUT : charge les catégories, PUIS les sous-catégories pour
//    * compter combien chaque catégorie en a — alimente les cartes de
//    * statistiques et la nouvelle colonne du tableau.
//    */
//   getListeCategories() {
//     this.inProgress = true;
//     this._categoriesService.listeCategories().subscribe({
//       next: (result: any) => {
//         this.listeCategories = result?.data ?? [];
//         this._chargerComptageSousCategories();
//       },
//       error: () => {
//         this.inProgress = false;
//       },
//     });
//   }

//   private _chargerComptageSousCategories(): void {
//     this._sousCategoriesService.getListeSousCategories().subscribe({
//       next: (result: any) => {
//         this.inProgress = false;
//         const sousCategories: any[] = result?.data ?? [];

//         const comptageParCategorie = new Map<number, number>();
//         sousCategories.forEach((sc) => {
//           const idCat = sc?.categorie?.id;
//           if (idCat) {
//             comptageParCategorie.set(idCat, (comptageParCategorie.get(idCat) ?? 0) + 1);
//           }
//         });

//         const listeAvecStats: CategorieAvecStat[] = (this.listeCategories ?? []).map((cat: any) => ({
//           id: cat.id,
//           nom: cat.nom,
//           description: cat.description,
//           dateCreation: cat.dateCreation,
//           nombreSousCategories: comptageParCategorie.get(cat.id) ?? 0,
//         }));

//         this.categoriesStats = listeAvecStats;
//         this.totalCategories = listeAvecStats.length;
//         this.totalSousCategoriesGlobal = sousCategories.length;

//         this.categoriesDataSource.data = listeAvecStats;
//         this.categoriesDataSource.sort = this.sort;
//         this.categoriesDataSource.paginator = this.paginator;
//       },
//       error: () => {
//         this.inProgress = false;
//         // Même en cas d'échec du comptage, on affiche quand même la
//         // liste des catégories (sans le nombre de sous-catégories).
//         const listeSansStats: CategorieAvecStat[] = (this.listeCategories ?? []).map((cat: any) => ({
//           id: cat.id,
//           nom: cat.nom,
//           description: cat.description,
//           dateCreation: cat.dateCreation,
//           nombreSousCategories: 0,
//         }));
//         this.categoriesStats = listeSansStats;
//         this.totalCategories = listeSansStats.length;
//         this.categoriesDataSource.data = listeSansStats;
//       },
//     });
//   }

//   applyFilter(event?: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.categoriesDataSource.filter = filterValue.trim().toLowerCase();

//     if (this.categoriesDataSource.paginator) {
//       this.categoriesDataSource.paginator.firstPage();
//     }
//   }

//   openEditCategoriesForm(categories?: any) {
//     const data = categories === undefined || categories === null ? {} : categories;
//     const dialogRef = this._dialog.open(CategoriesFormComponent, {
//       width: '800px',
//       disableClose: true,
//       data: data,
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.getListeCategories();
//       }
//     });
//   }

//   deleteCategories(categories): void {
//     const confirmation = this._fuseConfirmationService.open({
//       title: 'Supprimer une catégorie',
//       message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action ne peut pas être annulée !',
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
//         this.supprimer(categories);
//       }
//     });
//   }

//   supprimer(categories): void {
//     this.inProgress = true;
//     // ✅ MODIFIÉ : passe par le métier (suppression douce), au lieu de
//     // deleteCategories() qui appelait la route générique en échec.
//     this._categoriesService.supprimerCategories(categories.id).subscribe({
//       next: (result) => {
//         this.inProgress = false;
//         if (result) {
//           this.getListeCategories();
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
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriesService } from './categories.service';
import { SousCategoriesService } from '../sous-categories/sous-categories.service';
import { DateAdapter } from '@angular/material/core';
import { CategoriesFormComponent } from './form/categories-form.component';

interface CategorieAvecStat {
  id: number;
  nom: string;
  description: string;
  dateCreation: Date;
  nombreSousCategories: number;
}

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent {
  constructor(
    public _dialog: MatDialog,
    private _categoriesService: CategoriesService,
    private _sousCategoriesService: SousCategoriesService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private _adapter: DateAdapter<any>,
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public displayedColumns: string[] = ['libelle', 'description', 'nombreSousCategories', 'dateCreation', 'action'];
  public categoriesDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;

  public searchText = '';
  public listeCategories: any;

  public categoriesStats: CategorieAvecStat[] = [];
  public totalCategories = 0;
  public totalSousCategoriesGlobal = 0;

  // Couleurs pour les icônes (on garde pour les icônes)
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
    this.getListeCategories();
  }

  ngAfterViewInit(): void {
    this.categoriesDataSource.sort = this.sort;
    this.categoriesDataSource.paginator = this.paginator;
  }

  // ✅ NOUVELLE MÉTHODE : utilise des classes Tailwind pour les bordures
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

  getListeCategories() {
    this.inProgress = true;
    this._categoriesService.listeCategories().subscribe({
      next: (result: any) => {
        this.listeCategories = result?.data ?? [];
        this._chargerComptageSousCategories();
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }

  private _chargerComptageSousCategories(): void {
    this._sousCategoriesService.getListeSousCategories().subscribe({
      next: (result: any) => {
        this.inProgress = false;
        const sousCategories: any[] = result?.data ?? [];

        const comptageParCategorie = new Map<number, number>();
        sousCategories.forEach((sc) => {
          const idCat = sc?.categorie?.id;
          if (idCat) {
            comptageParCategorie.set(idCat, (comptageParCategorie.get(idCat) ?? 0) + 1);
          }
        });

        const listeAvecStats: CategorieAvecStat[] = (this.listeCategories ?? []).map((cat: any) => ({
          id: cat.id,
          nom: cat.nom,
          description: cat.description,
          dateCreation: cat.dateCreation,
          nombreSousCategories: comptageParCategorie.get(cat.id) ?? 0,
        }));

        this.categoriesStats = listeAvecStats;
        this.totalCategories = listeAvecStats.length;
        this.totalSousCategoriesGlobal = sousCategories.length;

        this.categoriesDataSource.data = listeAvecStats;
        this.categoriesDataSource.sort = this.sort;
        this.categoriesDataSource.paginator = this.paginator;
      },
      error: () => {
        this.inProgress = false;
        const listeSansStats: CategorieAvecStat[] = (this.listeCategories ?? []).map((cat: any) => ({
          id: cat.id,
          nom: cat.nom,
          description: cat.description,
          dateCreation: cat.dateCreation,
          nombreSousCategories: 0,
        }));
        this.categoriesStats = listeSansStats;
        this.totalCategories = listeSansStats.length;
        this.categoriesDataSource.data = listeSansStats;
      },
    });
  }

  applyFilter(event?: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.categoriesDataSource.paginator) {
      this.categoriesDataSource.paginator.firstPage();
    }
  }

  openEditCategoriesForm(categories?: any) {
    const data = categories === undefined || categories === null ? {} : categories;
    const dialogRef = this._dialog.open(CategoriesFormComponent, {
      width: '800px',
      disableClose: true,
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListeCategories();
      }
    });
  }

  deleteCategories(categories): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une catégorie',
      message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action ne peut pas être annulée !',
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
        this.supprimer(categories);
      }
    });
  }

  supprimer(categories): void {
    this.inProgress = true;
    this._categoriesService.supprimerCategories(categories.id).subscribe({
      next: (result) => {
        this.inProgress = false;
        if (result) {
          this.getListeCategories();
        }
      },
      error: () => {
        this.inProgress = false;
      },
    });
  }
} 