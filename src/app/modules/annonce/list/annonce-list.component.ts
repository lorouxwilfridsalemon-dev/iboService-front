
// import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { DateAdapter } from '@angular/material/core';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// import * as moment from 'moment';

// import { AnnonceService } from '../annonce.service';
// import { AnnonceInterface } from '../annonce.interface';
// import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { AnnonceModalListComponent } from '../modal/list/annonce-modal-list.component';
// import { environment } from 'environments/environment';

// interface CategorieStat {
//   id: number;
//   nom: string;
//   nombre: number;
// }

// @Component({
//   selector: 'app-annonce-list',
//   templateUrl: './annonce-list.component.html',
//   styleUrls: ['./annonce-list.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })

// export class AnnonceListComponent implements OnInit, AfterViewInit, OnDestroy {

//   private _unsubscribeAll: Subject<any> = new Subject<any>();

//   constructor(
//     public _dialog: MatDialog,
//     private _annonceService: AnnonceService,
//     private _fuseConfirmationService: FuseConfirmationService,
//     private _formBuilder: FormBuilder,
//     private _adapter: DateAdapter<any>,
//     public router: Router,
//   ) {
//     this._adapter.setLocale('fr');
//   }

//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort, { static: true }) sort: MatSort;

//   // =========================================================
//   // PROPRIÉTÉS
//   // =========================================================

//   searchForm: FormGroup;
//   recensementPeriode: string = 'jour';
//   searchControl = new FormControl('');

//   public displayedColumns: string[] = [
//     'photo',
//     'titre', 
//     'categorie', 
//     'sousCategorie', 
//     'prix', 
//     'proprietaire', 
//     'contact', 
//     'statut', 
//     'dateCreation', 
//     'action'
//   ];

//   public annonceDataSource = new MatTableDataSource<any>([]);
//   public inProgress = false;
//   public searchText = '';
//   public listeAnnonce: AnnonceInterface[] = [];
//   public allData: AnnonceInterface[] = [];
//   public total = 0;

//   // ✅ Cartes de statistiques par catégorie
//   public categoriesStats: CategorieStat[] = [];

//   // ✅ Données pour les filtres
//   mois: any[] = [
//     { id: 1, name: 'Janvier' },
//     { id: 2, name: 'Février' },
//     { id: 3, name: 'Mars' },
//     { id: 4, name: 'Avril' },
//     { id: 5, name: 'Mai' },
//     { id: 6, name: 'Juin' },
//     { id: 7, name: 'Juillet' },
//     { id: 8, name: 'Août' },
//     { id: 9, name: 'Septembre' },
//     { id: 10, name: 'Octobre' },
//     { id: 11, name: 'Novembre' },
//     { id: 12, name: 'Décembre' }
//   ];

//   annees: any[] = [];
//   ListeSemaineGeneral: any[] = [];
//   currentWeek: number;

//   private initializing = true;

//   // Couleurs pour les icônes et fonds d'icônes
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

//   // =========================================================
//   // LIFE CYCLE
//   // =========================================================

//   ngOnInit() {
//     this.initAnnees();
//     this.initSemaines();
//     this.initForm();
//     this.loadAnnonces();
//     this.setupSearchFilter();
//   }

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       this.annonceDataSource.paginator = this.paginator;
//       this.annonceDataSource.sort = this.sort;
//     });
//   }

//   ngOnDestroy(): void {
//     this._unsubscribeAll.next(null);
//     this._unsubscribeAll.complete();
//   }

//   // =========================================================
//   // INITIALISATION
//   // =========================================================

//   initAnnees(): void {
//     const currentYear = new Date().getFullYear();
//     this.annees = [];
//     for (let i = currentYear - 5; i <= currentYear + 1; i++) {
//       this.annees.push({ id: i, name: `${i}` });
//     }
//   }

//   initSemaines(): void {
//     this.ListeSemaineGeneral = [];
//     const currentYear = new Date().getFullYear();

//     for (let week = 1; week <= 52; week++) {
//       const startDate = this.getDateOfWeek(currentYear, week);
//       const endDate = moment(startDate).add(6, 'days');
//       this.ListeSemaineGeneral.push({
//         IdSemaine: week,
//         NomSemaine: `${week} (${moment(startDate).format('DD/MM')} - ${endDate.format('DD/MM')})`
//       });
//     }
//   }

//   initForm(): void {
//     const today = moment();
//     const currentYear = today.year();
//     const currentMonth = today.month() + 1;
//     const currentWeek = this.getWeekNumber(today.toDate());

//     this.searchForm = this._formBuilder.group({
//       dateJour: [today.format('YYYY-MM-DD')],
//       dateDebut: [null],
//       dateFin: [null],
//       semaine: [currentWeek],
//       mois: [currentMonth],
//       annee: [currentYear],
//       periodicite: [this.recensementPeriode]
//     });
//   }

//   // =========================================================
//   // PHOTO
//   // =========================================================

//   /**
//    * ✅ CORRIGÉ : construit l'URL complète de la photo de l'annonce
//    * Même convention que dans le détail : environment.api + '/files/annonces/' + nomFichier
//    */
//   urlPhoto(nomFichier: string): string {
//     if (!nomFichier) return '';
//     // ✅ Vérifier si l'URL est déjà complète
//     if (nomFichier.startsWith('http://') || nomFichier.startsWith('https://')) {
//       return nomFichier;
//     }
//     return `${environment.api}/files/annonces/${nomFichier}`;
//   }

//   /**
//    * ✅ AMÉLIORÉ : récupère la première image de l'annonce
//    * Gère uniquement le format images[] de l'interface AnnonceInterface
//    */
//   getPremiereImage(annonce: any): string | null {
//     if (!annonce) return null;

//     // ✅ Utiliser uniquement images[] qui est défini dans l'interface
//     if (annonce.images && Array.isArray(annonce.images) && annonce.images.length > 0) {
//       const imagesTriees = [...annonce.images].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
//       return imagesTriees[0]?.nom || null;
//     }

//     return null;
//   }

//   /**
//    * ✅ AMÉLIORÉ : gère les erreurs de chargement d'image
//    */
//   handleImageError(event: any): void {
//     const imgElement = event.target;
//     imgElement.style.display = 'none';
    
//     // Afficher l'icône de remplacement
//     const parent = imgElement.parentElement;
//     if (parent) {
//       // Vérifier si l'icône n'existe pas déjà
//       if (!parent.querySelector('.fallback-icon')) {
//         const iconContainer = document.createElement('div');
//         iconContainer.className = 'w-full h-full flex items-center justify-center fallback-icon';
//         iconContainer.innerHTML = '<mat-icon class="text-gray-400" style="font-size: 24px; width: 24px; height: 24px;">broken_image</mat-icon>';
//         parent.appendChild(iconContainer);
//       }
//     }
//   }

//   /**
//    * ✅ AJOUT : gère le chargement réussi de l'image
//    */
//   handleImageLoad(event: any): void {
//     const imgElement = event.target;
//     imgElement.style.display = 'block';
    
//     // Supprimer l'icône de remplacement si elle existe
//     const parent = imgElement.parentElement;
//     if (parent) {
//       const fallback = parent.querySelector('.fallback-icon');
//       if (fallback) {
//         fallback.remove();
//       }
//     }
//   }

//   /**
//    * ✅ AJOUT : récupère le nombre total d'images
//    */
//   getNombreImages(annonce: any): number {
//     if (!annonce?.images || !Array.isArray(annonce.images)) {
//       return 0;
//     }
//     return annonce.images.length;
//   }

//   // =========================================================
//   // LOAD DATA
//   // =========================================================

//   // loadAnnonces(): void {
//   //   this.inProgress = true;
//   //   const params = this.buildRequestParams();

//   //   this._annonceService.getListeAnnonceAll()
//   //     .pipe(takeUntil(this._unsubscribeAll))
//   //     .subscribe({
//   //       next: (result: any) => {
//   //         this.inProgress = false;
//   //         this.listeAnnonce = result?.data ?? [];
          
//   //         // ✅ DEBUG : Vérifier si les images sont incluses (corrigé)
//   //         console.log('📊 Données reçues:', this.listeAnnonce);
          
//   //         // Vérifier la structure des images
//   //         if (this.listeAnnonce.length > 0) {
//   //           const premiereAnnonce: any = this.listeAnnonce[0];
//   //           console.log('🖼️ Première annonce:', premiereAnnonce);
//   //           console.log('🖼️ Images de la première annonce:', premiereAnnonce?.images);
//   //           console.log('🖼️ Type des images:', typeof premiereAnnonce?.images);
//   //           console.log('🖼️ Images est un tableau:', Array.isArray(premiereAnnonce?.images));
            
//   //           // Vérifier toutes les propriétés de la première annonce
//   //           console.log('🔍 Propriétés disponibles:', Object.keys(premiereAnnonce || {}));
//   //         }
          
//   //         this.allData = [...this.listeAnnonce];
//   //         this.total = this.listeAnnonce.length;

//   //         // ✅ Filtrer selon la périodicité
//   //         const filteredData = this.filterDataByPeriod(this.allData);
//   //         this.annonceDataSource.data = filteredData;
//   //         this.total = filteredData.length;

//   //         this.annonceDataSource.paginator = this.paginator;
//   //         this.annonceDataSource.sort = this.sort;

//   //         this._calculerStatsParCategorie(filteredData);

//   //         setTimeout(() => {
//   //           this.initializing = false;
//   //         }, 100);
//   //       },
//   //       error: (error) => {
//   //         this.inProgress = false;
//   //         console.error('Erreur lors du chargement des annonces:', error);
//   //       }
//   //     });
//   // }
 
//   loadAnnonces(): void {
//     this.inProgress = true;
//     const params = this.buildRequestParams();

//     // ✅ Passer les paramètres à l'API pour le filtrage serveur
//     this._annonceService.getListeAnnonceAll(params)
//       .pipe(takeUntil(this._unsubscribeAll))
//       .subscribe({
//         next: (result: any) => {
//           this.inProgress = false;
//           this.listeAnnonce = result?.data ?? [];
//           this.allData = [...this.listeAnnonce];
//           this.total = this.listeAnnonce.length;

//           // ✅ Plus besoin de filtrer côté client car le serveur a déjà filtré
//           this.annonceDataSource.data = this.listeAnnonce;
//           this.total = this.listeAnnonce.length;

//           this.annonceDataSource.paginator = this.paginator;
//           this.annonceDataSource.sort = this.sort;

//           this._calculerStatsParCategorie(this.listeAnnonce);

//           setTimeout(() => {
//             this.initializing = false;
//           }, 100);
//         },
//         error: (error) => {
//           this.inProgress = false;
//           console.error('Erreur lors du chargement des annonces:', error);
//         }
//       });
// }

//   buildRequestParams(): any {
//     const formValue = this.searchForm.value;
//     const params: any = {
//       periodicite: this.recensementPeriode,
//       statut: "tous"
//     };

//     switch (this.recensementPeriode) {
//       case 'jour':
//         if (formValue.dateJour) {
//           params.dateJour = moment(formValue.dateJour).format('YYYY-MM-DD');
//         }
//         break;
//       case 'semaine':
//         if (formValue.semaine && formValue.annee) {
//           params.semaine = parseInt(formValue.semaine, 10);
//           params.annee = parseInt(formValue.annee, 10);
//           const weekDates = this.getWeekDates(formValue.annee, formValue.semaine);
//           params.dateDebut = weekDates.dateDebut;
//           params.dateFin = weekDates.dateFin;
//         }
//         break;
//       case 'mois':
//         if (formValue.mois && formValue.annee) {
//           params.mois = parseInt(formValue.mois, 10);
//           params.annee = parseInt(formValue.annee, 10);
//         }
//         break;
//       case 'annee':
//         if (formValue.annee) {
//           params.annee = parseInt(formValue.annee, 10);
//         }
//         break;
//     }
//     return params;
//   }

//   filterDataByPeriod(data: any[]): any[] {
//     if (!data || !data.length) return [];

//     const formValue = this.searchForm.value;
//     const periodicite = this.recensementPeriode;
//     let filteredData = [...data];

//     switch (periodicite) {
//       case 'jour':
//         if (formValue.dateJour) {
//           const dateFilter = moment(formValue.dateJour).format('YYYY-MM-DD');
//           filteredData = filteredData.filter(item =>
//             moment(item.dateCreation).format('YYYY-MM-DD') === dateFilter
//           );
//         }
//         break;
//       case 'semaine':
//         if (formValue.semaine && formValue.annee) {
//           const weekDates = this.getWeekDates(formValue.annee, formValue.semaine);
//           const dateDebut = moment(weekDates.dateDebut);
//           const dateFin = moment(weekDates.dateFin);
//           filteredData = filteredData.filter(item =>
//             moment(item.dateCreation).isBetween(dateDebut, dateFin, 'day', '[]')
//           );
//         }
//         break;
//       case 'mois':
//         if (formValue.mois && formValue.annee) {
//           filteredData = filteredData.filter(item => {
//             const dateItem = moment(item.dateCreation);
//             return dateItem.month() + 1 === parseInt(formValue.mois) &&
//                    dateItem.year() === parseInt(formValue.annee);
//           });
//         }
//         break;
//       case 'annee':
//         if (formValue.annee) {
//           filteredData = filteredData.filter(item =>
//             moment(item.dateCreation).year() === parseInt(formValue.annee)
//           );
//         }
//         break;
//     }

//     return filteredData;
//   }

//   // =========================================================
//   // STATISTIQUES
//   // =========================================================

//   private _calculerStatsParCategorie(data?: any[]): void {
//     const sourceData = data || this.annonceDataSource.filteredData;
//     const statsMap = new Map<number, CategorieStat>();

//     sourceData.forEach((a: any) => {
//       const cat = a?.categorie;
//       if (cat?.id) {
//         if (statsMap.has(cat.id)) {
//           statsMap.get(cat.id)!.nombre++;
//         } else {
//           statsMap.set(cat.id, { id: cat.id, nom: cat.nom, nombre: 1 });
//         }
//       }
//     });

//     this.categoriesStats = Array.from(statsMap.values())
//       .sort((a, b) => a.nom.localeCompare(b.nom));
//   }

//   // =========================================================
//   // FILTRES
//   // =========================================================

//   setupSearchFilter(): void {
//     this.searchControl.valueChanges
//       .pipe(
//         debounceTime(300),
//         distinctUntilChanged(),
//         takeUntil(this._unsubscribeAll)
//       )
//       .subscribe(() => {
//         this.applyFilters();
//       });
//   }

//   applyFilter(event?: Event): void {
//     if (event) {
//       const filterValue = (event.target as HTMLInputElement).value;
//       this.searchControl.setValue(filterValue);
//     }
//   }

//   applyFilters(): void {
//     const searchText = this.searchControl.value?.toLowerCase() || '';

//     this.annonceDataSource.filterPredicate = (data: any, filter: string) => {
//       const searchTerms = filter.toLowerCase();
//       const searchableFields = [
//         data.titre,
//         data.categorie?.nom,
//         data.sousCategorie?.nom,
//         data.proprietaire?.nom,
//         data.proprietaire?.contact,
//         data.statut
//       ];

//       return searchableFields.some(field =>
//         field && field.toString().toLowerCase().includes(searchTerms)
//       );
//     };

//     this.annonceDataSource.filter = searchText;

//     if (this.annonceDataSource.paginator) {
//       this.annonceDataSource.paginator.firstPage();
//     }

//     this._calculerStatsParCategorie();
//   }

//   onPeriodChange(): void {
//     const now = moment();
//     const currentYear = now.year();
//     const currentMonth = now.month() + 1;
//     const currentWeek = this.getWeekNumber(now.toDate());
//     const patchValues: any = { dateJour: null, dateDebut: null, dateFin: null, semaine: null, mois: null, annee: null };

//     if (this.recensementPeriode === 'jour') {
//       patchValues.dateJour = now.format('YYYY-MM-DD');
//     } else if (this.recensementPeriode === 'semaine') {
//       patchValues.semaine = currentWeek;
//       patchValues.annee = currentYear;
//     } else if (this.recensementPeriode === 'mois') {
//       patchValues.mois = currentMonth;
//       patchValues.annee = currentYear;
//     } else if (this.recensementPeriode === 'annee') {
//       patchValues.annee = currentYear;
//     }

//     this.searchForm.patchValue(patchValues, { emitEvent: false });

//     if (this.recensementPeriode === 'semaine') {
//       this.onSemaineChange();
//     }

//     if (this.paginator) {
//       this.paginator.firstPage();
//     }

//     this.loadAnnonces();
//   }

//   onSemaineChange(): void {
//     const annee = this.searchForm.get('annee')?.value;
//     const semaine = this.searchForm.get('semaine')?.value;
//     if (annee && semaine) {
//       const weekDates = this.getWeekDates(annee, semaine);
//       this.searchForm.patchValue({
//         dateDebut: weekDates.dateDebut,
//         dateFin: weekDates.dateFin
//       }, { emitEvent: false });
//     }
//   }

//   applyPeriodFilter(): void {
//     if (this.paginator) {
//       this.paginator.firstPage();
//     }
//     this.loadAnnonces();
//   }

//   // =========================================================
//   // HELPERS SEMAINE
//   // =========================================================

//   private getWeekNumber(date: Date): number {
//     const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
//     tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
//     const yearStart: any = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
//     return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
//   }

//   getDateOfWeek(year: number, week: number): Date {
//     const date = new Date(year, 0, 1);
//     const dayOfWeek = date.getDay();
//     const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
//     date.setDate(date.getDate() + daysToAdd);
//     return date;
//   }

//   getWeekDates(year: number, week: number): { dateDebut: string, dateFin: string } {
//     const startDate = this.getDateOfWeek(year, week);
//     const endDate = moment(startDate).add(6, 'days');
//     return {
//       dateDebut: moment(startDate).format('YYYY-MM-DD'),
//       dateFin: endDate.format('YYYY-MM-DD')
//     };
//   }

//   // =========================================================
//   // EXPORT
//   // =========================================================

//   exportExcel(): void {
//     const dataToExport = this.annonceDataSource.filteredData;

//     if (!dataToExport || dataToExport.length === 0) {
//       console.warn('Aucune donnée à exporter');
//       return;
//     }

//     const formatMontantExport = (montant: number): string => {
//       if (!montant && montant !== 0) return '0 FCFA';
//       return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
//     };

//     const formatDateExport = (date: any): string => {
//       if (!date) return '-';
//       try {
//         const dateObj = moment(date);
//         if (!dateObj.isValid()) return date.toString();
//         return dateObj.format('DD/MM/YYYY HH:mm');
//       } catch (error) {
//         return date.toString();
//       }
//     };

//     const getPrixExport = (row: any): string => {
//       if (row.sansPrix) {
//         return 'Non défini';
//       }
//       return row.prixFormatte || formatMontantExport(row.prix) || '0 FCFA';
//     };

//     const getStatutExport = (statut: string): string => {
//       switch (statut) {
//         case 'Actives': return 'Active';
//         case 'En attente': return 'En attente';
//         case 'Réfusées': return 'Refusée';
//         default: return statut || 'Active';
//       }
//     };

//     let html = `
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <style>
//             table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
//             th { background-color: #4472C4; color: white; font-weight: bold; padding: 12px; border: 1px solid black; text-align: center; vertical-align: middle; }
//             td { padding: 8px; border: 1px solid #D3D3D3; text-align: center; vertical-align: middle; }
//             .total-row { background-color: #E7E6E6; font-weight: bold; }
//             .total-row td { border: 1px solid black; text-align: center; }
//             h2, h3 { text-align: center; }
//             .statut-active { color: #10B981; font-weight: bold; }
//             .statut-attente { color: #F59E0B; font-weight: bold; }
//             .statut-refusee { color: #EF4444; font-weight: bold; }
//         </style>
//     </head>
//     <body>
//         <h2>LISTE DES ANNONCES</h2>
//         <h3>Période: ${this.getPeriodeTexte()}</h3>
//         <table>
//             <thead>
//                 <tr>
//                     <th>TITRE</th>
//                     <th>CATÉGORIE</th>
//                     <th>SOUS-CATÉGORIE</th>
//                     <th>PRIX</th>
//                     <th>PROPRIÉTAIRE</th>
//                     <th>CONTACT</th>
//                     <th>STATUT</th>
//                     <th>DATE ANNONCE</th>
//                 </tr>
//             </thead>
//             <tbody>
// `;

//     let totalAnnonces = 0;
//     let totalAvecPrix = 0;
//     let totalSansPrix = 0;

//     dataToExport.forEach(row => {
//       totalAnnonces++;
//       if (row.sansPrix) {
//         totalSansPrix++;
//       } else {
//         totalAvecPrix++;
//       }

//       const titre = row.titre && row.titre !== 'Non spécifié' ? row.titre : '-';
//       const categorie = row.categorie?.nom && row.categorie?.nom !== 'Non spécifié' ? row.categorie.nom : '-';
//       const sousCategorie = row.sousCategorie?.nom && row.sousCategorie?.nom !== 'Non spécifié' ? row.sousCategorie.nom : '-';
//       const prix = getPrixExport(row);
//       const proprietaire = row.proprietaire?.nom && row.proprietaire?.nom !== 'Non spécifié' ? row.proprietaire.nom : '-';
//       const contact = row.proprietaire?.contact && row.proprietaire?.contact !== 'Non spécifié' ? row.proprietaire.contact : '-';
//       const statut = getStatutExport(row.statut);
//       const dateCreation = row.dateCreation ? formatDateExport(row.dateCreation) : '-';

//       let statutClass = '';
//       if (statut === 'Active') statutClass = 'statut-active';
//       else if (statut === 'En attente') statutClass = 'statut-attente';
//       else if (statut === 'Refusée') statutClass = 'statut-refusee';

//       html += `
//         <tr>
//             <td>${this.escapeHtml(titre)}</td>
//             <td>${this.escapeHtml(categorie)}</td>
//             <td>${this.escapeHtml(sousCategorie)}</td>
//             <td>${this.escapeHtml(prix)}</td>
//             <td>${this.escapeHtml(proprietaire)}</td>
//             <td>${this.escapeHtml(contact)}</td>
//             <td class="${statutClass}">${statut}</td>
//             <td>${dateCreation}</td>
//         </tr>
//     `;
//     });

//     html += `
//             <tr class="total-row">
//                 <td colspan="6"><strong>TOTAL</strong></td>
//                 <td><strong>${totalAnnonces} annonce(s)</strong></td>
//                 <td></td>
//             </tr>
//             <tr class="total-row">
//                 <td colspan="6"><strong>RÉPARTITION</strong></td>
//                 <td colspan="2"><strong>Avec prix: ${totalAvecPrix} | Sans prix: ${totalSansPrix}</strong></td>
//             </tr>
//         </tbody>
//     </table>
//     </body>
//     </html>
// `;

//     const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.href = url;
//     link.download = `LISTE_ANNONCES_${moment().format('DD-MM-YYYY_HH-mm-ss')}.xls`;
//     link.click();
//     URL.revokeObjectURL(url);
//   }

//   exportPdf(): void {
//     const dataToExport = this.annonceDataSource.filteredData;

//     if (!dataToExport || dataToExport.length === 0) {
//       console.warn('Aucune donnée à exporter');
//       return;
//     }

//     const formatMontantExport = (montant: number): string => {
//       if (!montant && montant !== 0) return '0 FCFA';
//       return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
//     };

//     const formatDateExport = (date: any): string => {
//       if (!date) return '-';
//       try {
//         const dateObj = moment(date);
//         if (!dateObj.isValid()) return date.toString();
//         return dateObj.format('DD/MM/YYYY HH:mm');
//       } catch (error) {
//         return date.toString();
//       }
//     };

//     const getPrixExport = (row: any): string => {
//       if (row.sansPrix) {
//         return 'Non défini';
//       }
//       return row.prixFormatte || formatMontantExport(row.prix) || '0 FCFA';
//     };

//     const getStatutExport = (statut: string): string => {
//       switch (statut) {
//         case 'Actives': return 'Active';
//         case 'En attente': return 'En attente';
//         case 'Réfusées': return 'Refusée';
//         default: return statut || 'Active';
//       }
//     };

//     let totalAnnonces = 0;
//     let totalAvecPrix = 0;
//     let totalSansPrix = 0;

//     let printContent = `
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <title>Liste des annonces</title>
//         <style>
//             @media print {
//                 body { margin: 20mm; }
//                 .no-print { display: none; }
//             }
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             h2 { text-align: center; color: #333; margin-bottom: 5px; }
//             h3 { text-align: center; color: #666; margin-top: 0; margin-bottom: 20px; }
//             table { border-collapse: collapse; width: 100%; }
//             th { background-color: #4472C4; color: white; font-weight: bold; padding: 12px; border: 1px solid black; text-align: center; }
//             td { padding: 8px; border: 1px solid #D3D3D3; text-align: center; }
//             .total-row { background-color: #E7E6E6; font-weight: bold; }
//             .total-row td { border: 1px solid black; }
//             .statut-active { color: #10B981; font-weight: bold; }
//             .statut-attente { color: #F59E0B; font-weight: bold; }
//             .statut-refusee { color: #EF4444; font-weight: bold; }
//             button { 
//                 display: block; 
//                 margin: 20px auto; 
//                 padding: 10px 20px; 
//                 background-color: #4472C4; 
//                 color: white; 
//                 border: none; 
//                 border-radius: 4px; 
//                 cursor: pointer; 
//                 font-size: 14px;
//             }
//             button:hover { background-color: #3461a1; }
//         </style>
//     </head>
//     <body>
//         <h2>LISTE DES ANNONCES</h2>
//         <h3>Période: ${this.getPeriodeTexte()}</h3>
        
//         <table>
//             <thead>
//                 <tr>
//                     <th>TITRE</th>
//                     <th>CATÉGORIE</th>
//                     <th>SOUS-CATÉGORIE</th>
//                     <th>PRIX</th>
//                     <th>PROPRIÉTAIRE</th>
//                     <th>CONTACT</th>
//                     <th>STATUT</th>
//                     <th>DATE ANNONCE</th>
//                 </tr>
//             </thead>
//             <tbody>
// `;

//     dataToExport.forEach(row => {
//       totalAnnonces++;
//       if (row.sansPrix) {
//         totalSansPrix++;
//       } else {
//         totalAvecPrix++;
//       }

//       const titre = row.titre && row.titre !== 'Non spécifié' ? row.titre : '-';
//       const categorie = row.categorie?.nom && row.categorie?.nom !== 'Non spécifié' ? row.categorie.nom : '-';
//       const sousCategorie = row.sousCategorie?.nom && row.sousCategorie?.nom !== 'Non spécifié' ? row.sousCategorie.nom : '-';
//       const prix = getPrixExport(row);
//       const proprietaire = row.proprietaire?.nom && row.proprietaire?.nom !== 'Non spécifié' ? row.proprietaire.nom : '-';
//       const contact = row.proprietaire?.contact && row.proprietaire?.contact !== 'Non spécifié' ? row.proprietaire.contact : '-';
//       const statut = getStatutExport(row.statut);
//       const dateCreation = row.dateCreation ? formatDateExport(row.dateCreation) : '-';

//       let statutClass = '';
//       if (statut === 'Active') statutClass = 'statut-active';
//       else if (statut === 'En attente') statutClass = 'statut-attente';
//       else if (statut === 'Refusée') statutClass = 'statut-refusee';

//       printContent += `
//                 <tr>
//                     <td>${this.escapeHtml(titre)}</td>
//                     <td>${this.escapeHtml(categorie)}</td>
//                     <td>${this.escapeHtml(sousCategorie)}</td>
//                     <td>${this.escapeHtml(prix)}</td>
//                     <td>${this.escapeHtml(proprietaire)}</td>
//                     <td>${this.escapeHtml(contact)}</td>
//                     <td class="${statutClass}">${statut}</td>
//                     <td>${dateCreation}</td>
//                 </tr>
//         `;
//     });

//     printContent += `
//                 <tr class="total-row">
//                     <td colspan="6"><strong>TOTAL</strong></td>
//                     <td><strong>${totalAnnonces} annonce(s)</strong></td>
//                     <td></td>
//                 </tr>
//                 <tr class="total-row">
//                     <td colspan="6"><strong>RÉPARTITION</strong></td>
//                     <td colspan="2"><strong>Avec prix: ${totalAvecPrix} | Sans prix: ${totalSansPrix}</strong></td>
//                 </tr>
//             </tbody>
//         </table>
        
//         <button class="no-print" onclick="window.print()">🖨️ Imprimer le document</button>
//     </body>
//     </html>
// `;

//     const printWindow = window.open('', '_blank', 'width=1200,height=800');
//     if (printWindow) {
//       printWindow.document.write(printContent);
//       printWindow.document.close();
      
//       setTimeout(() => {
//         printWindow.print();
//       }, 500);
//     }
//   }

//   private escapeHtml(str: string): string {
//     if (!str) return '';
//     return str
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#39;');
//   }

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   getPeriodeTexte(): string {
//     if (!this.searchForm) return 'Toutes périodes';
//     const vals = this.searchForm.value;

//     if (this.recensementPeriode === 'jour' && vals.dateJour) {
//       return `le ${moment(vals.dateJour).format('DD/MM/YYYY')}`;
//     }
//     if (this.recensementPeriode === 'semaine' && vals.dateDebut && vals.dateFin) {
//       return `du ${moment(vals.dateDebut).format('DD/MM/YYYY')} au ${moment(vals.dateFin).format('DD/MM/YYYY')}`;
//     }
//     if (this.recensementPeriode === 'mois' && vals.mois) {
//       return `du mois de ${this.getMoisNom(vals.mois - 1)} ${vals.annee}`;
//     }
//     if (this.recensementPeriode === 'annee' && vals.annee) {
//       return `de l'année ${vals.annee}`;
//     }
//     return 'Toutes périodes';
//   }

//   getMoisNom(index: number): string {
//     const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
//     return months[index] || '';
//   }

//   get totalFilteredItems(): number {
//     return this.annonceDataSource.filteredData.length;
//   }

//   // =========================================================
//   // STYLES
//   // =========================================================

//   getBorderClass(index: number): string {
//     const classes = [
//       'border-blue-500',
//       'border-green-500',
//       'border-purple-500',
//       'border-pink-500',
//       'border-yellow-500',
//       'border-cyan-500',
//       'border-red-500',
//       'border-indigo-500'
//     ];
//     return classes[index % classes.length];
//   }

//   getIconBgColor(index: number): string {
//     return this.iconBgColors[index % this.iconBgColors.length];
//   }

//   getIconColor(index: number): string {
//     return this.iconColors[index % this.iconColors.length];
//   }

//   // =========================================================
//   // ACTIONS
//   // =========================================================

//   valider(annonce: any): void {
//     this.inProgress = true;
//     this._annonceService.valider(annonce.id).subscribe({
//       next: () => { this.inProgress = false; this.loadAnnonces(); },
//       error: () => { this.inProgress = false; },
//     });
//   }

//   refuser(annonce: any): void {
//     this.inProgress = true;
//     this._annonceService.refuser(annonce.id).subscribe({
//       next: () => { this.inProgress = false; this.loadAnnonces(); },
//       error: () => { this.inProgress = false; },
//     });
//   }

//   voirDetail(annonce: any): void {
//     this._annonceService.findById(annonce.id).subscribe({
//       next: (result: any) => {
//         this._dialog.open(AnnonceModalListComponent, {
//           width: '600px',
//           disableClose: false,
//           data: result?.data,
//         });
//       },
//     });
//   }

//   modifier(annonce: any): void {
//     this.router.navigate(['/annonce/modifier', annonce.id]);
//   }

//   deleteElement(annonce: any): void {
//     const confirmation = this._fuseConfirmationService.open({
//       title: 'Supprimer une annonce',
//       message: 'Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action ne peut pas être annulée !',
//       icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
//       actions: {
//         confirm: { label: 'Supprimer', color: 'warn' },
//         cancel: { show: true, label: 'Annuler' },
//       },
//       dismissible: false,
//     });

//     confirmation.afterClosed().subscribe((result) => {
//       if (result === 'confirmed') {
//         this.supprimer(annonce);
//       }
//     });
//   }

//   supprimer(annonce: any): void {
//     this.inProgress = true;
//     this._annonceService.supprimer(annonce.id).subscribe({
//       next: () => { this.inProgress = false; this.loadAnnonces(); },
//       error: () => { this.inProgress = false; },
//     });
//   }
// } 

import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';

import { AnnonceService } from '../annonce.service';
import { AnnonceInterface } from '../annonce.interface';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AnnonceModalListComponent } from '../modal/list/annonce-modal-list.component';
import { environment } from 'environments/environment';

interface CategorieStat {
  id: number;
  nom: string;
  nombre: number;
}

@Component({
  selector: 'app-annonce-list',
  templateUrl: './annonce-list.component.html',
  styleUrls: ['./annonce-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnonceListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    public _dialog: MatDialog,
    private _annonceService: AnnonceService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
    public router: Router,
  ) {
    this._adapter.setLocale('fr');
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // =========================================================
  // PROPRIÉTÉS
  // =========================================================

  searchForm: FormGroup;
  recensementPeriode: string = 'jour';
  searchControl = new FormControl('');

  public displayedColumns: string[] = [
    'photo',
    'titre',
    'categorie',
    'sousCategorie',
    'prix',
    'proprietaire',
    'contact',
    'statut',
    'dateCreation',
    'action'
  ];

  public annonceDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;
  public searchText = '';
  public listeAnnonce: AnnonceInterface[] = [];
  public allData: AnnonceInterface[] = [];
  public total = 0;

  public categoriesStats: CategorieStat[] = [];

  mois: any[] = [
    { id: 1,  name: 'Janvier'   },
    { id: 2,  name: 'Février'   },
    { id: 3,  name: 'Mars'      },
    { id: 4,  name: 'Avril'     },
    { id: 5,  name: 'Mai'       },
    { id: 6,  name: 'Juin'      },
    { id: 7,  name: 'Juillet'   },
    { id: 8,  name: 'Août'      },
    { id: 9,  name: 'Septembre' },
    { id: 10, name: 'Octobre'   },
    { id: 11, name: 'Novembre'  },
    { id: 12, name: 'Décembre'  }
  ];

  annees: any[] = [];
  ListeSemaineGeneral: any[] = [];
  currentWeek: number;

  private initializing = true;

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

  // =========================================================
  // LIFE CYCLE
  // =========================================================

  ngOnInit() {
    this.initAnnees();
    this.initSemaines();
    this.initForm();
    this.loadAnnonces();
    this.setupSearchFilter();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.annonceDataSource.paginator = this.paginator;
      this.annonceDataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // =========================================================
  // INITIALISATION
  // =========================================================

  initAnnees(): void {
    const currentYear = new Date().getFullYear();
    this.annees = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      this.annees.push({ id: i, name: `${i}` });
    }
  }

  initSemaines(): void {
    this.ListeSemaineGeneral = [];
    const currentYear = new Date().getFullYear();

    for (let week = 1; week <= 52; week++) {
      const startDate = this.getDateOfWeek(currentYear, week);
      const endDate = moment(startDate).add(6, 'days');
      this.ListeSemaineGeneral.push({
        IdSemaine: week,
        NomSemaine: `${week} (${moment(startDate).format('DD/MM')} - ${endDate.format('DD/MM')})`
      });
    }
  }

  initForm(): void {
    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;
    const currentWeek = this.getWeekNumber(today.toDate());

    this.searchForm = this._formBuilder.group({
      dateJour: [today.format('YYYY-MM-DD')],
      dateDebut: [null],
      dateFin: [null],
      semaine: [currentWeek],
      mois: [currentMonth],
      annee: [currentYear],
      periodicite: [this.recensementPeriode]
    });
  }

  // =========================================================
  // PHOTO
  // =========================================================

  urlPhoto(nomFichier: string): string {
    if (!nomFichier) return '';
    if (nomFichier.startsWith('http://') || nomFichier.startsWith('https://')) {
      return nomFichier;
    }
    return `${environment.api}/files/annonces/${nomFichier}`;
  }

  getPremiereImage(annonce: any): string | null {
    if (!annonce) return null;
    if (annonce.images && Array.isArray(annonce.images) && annonce.images.length > 0) {
      const imagesTriees = [...annonce.images].sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
      return imagesTriees[0]?.nom || null;
    }
    return null;
  }

  handleImageError(event: any): void {
    const imgElement = event.target;
    imgElement.style.display = 'none';

    const parent = imgElement.parentElement;
    if (parent) {
      if (!parent.querySelector('.fallback-icon')) {
        const iconContainer = document.createElement('div');
        iconContainer.className = 'w-full h-full flex items-center justify-center fallback-icon';
        iconContainer.innerHTML = '<mat-icon class="text-gray-400" style="font-size: 24px; width: 24px; height: 24px;">broken_image</mat-icon>';
        parent.appendChild(iconContainer);
      }
    }
  }

  handleImageLoad(event: any): void {
    const imgElement = event.target;
    imgElement.style.display = 'block';

    const parent = imgElement.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.fallback-icon');
      if (fallback) {
        fallback.remove();
      }
    }
  }

  getNombreImages(annonce: any): number {
    if (!annonce?.images || !Array.isArray(annonce.images)) {
      return 0;
    }
    return annonce.images.length;
  }

  // =========================================================
  // LOAD DATA
  // =========================================================

  loadAnnonces(): void {
    this.inProgress = true;
    const params = this.buildRequestParams();

    this._annonceService.getListeAnnonceAll(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (result: any) => {
          this.inProgress = false;
          this.listeAnnonce = result?.data ?? [];
          this.allData = [...this.listeAnnonce];
          this.total = this.listeAnnonce.length;

          this.annonceDataSource.data = this.listeAnnonce;
          this.total = this.listeAnnonce.length;

          this.annonceDataSource.paginator = this.paginator;
          this.annonceDataSource.sort = this.sort;

          this._calculerStatsParCategorie(this.listeAnnonce);

          setTimeout(() => {
            this.initializing = false;
          }, 100);
        },
        error: (error) => {
          this.inProgress = false;
          console.error('Erreur lors du chargement des annonces:', error);
        }
      });
  }

  buildRequestParams(): any {
    const formValue = this.searchForm.value;
    const params: any = {
      periodicite: this.recensementPeriode,
      statut: "tous"
    };

    switch (this.recensementPeriode) {
      case 'jour':
        if (formValue.dateJour) {
          params.dateJour = moment(formValue.dateJour).format('YYYY-MM-DD');
        }
        break;
      case 'semaine':
        if (formValue.semaine && formValue.annee) {
          params.semaine = parseInt(formValue.semaine, 10);
          params.annee = parseInt(formValue.annee, 10);
          const weekDates = this.getWeekDates(formValue.annee, formValue.semaine);
          params.dateDebut = weekDates.dateDebut;
          params.dateFin = weekDates.dateFin;
        }
        break;
      case 'mois':
        if (formValue.mois && formValue.annee) {
          params.mois = parseInt(formValue.mois, 10);
          params.annee = parseInt(formValue.annee, 10);
        }
        break;
      case 'annee':
        if (formValue.annee) {
          params.annee = parseInt(formValue.annee, 10);
        }
        break;
    }
    return params;
  }

  filterDataByPeriod(data: any[]): any[] {
    if (!data || !data.length) return [];

    const formValue = this.searchForm.value;
    const periodicite = this.recensementPeriode;
    let filteredData = [...data];

    switch (periodicite) {
      case 'jour':
        if (formValue.dateJour) {
          const dateFilter = moment(formValue.dateJour).format('YYYY-MM-DD');
          filteredData = filteredData.filter(item =>
            moment(item.dateCreation).format('YYYY-MM-DD') === dateFilter
          );
        }
        break;
      case 'semaine':
        if (formValue.semaine && formValue.annee) {
          const weekDates = this.getWeekDates(formValue.annee, formValue.semaine);
          const dateDebut = moment(weekDates.dateDebut);
          const dateFin = moment(weekDates.dateFin);
          filteredData = filteredData.filter(item =>
            moment(item.dateCreation).isBetween(dateDebut, dateFin, 'day', '[]')
          );
        }
        break;
      case 'mois':
        if (formValue.mois && formValue.annee) {
          filteredData = filteredData.filter(item => {
            const dateItem = moment(item.dateCreation);
            return dateItem.month() + 1 === parseInt(formValue.mois) &&
                   dateItem.year() === parseInt(formValue.annee);
          });
        }
        break;
      case 'annee':
        if (formValue.annee) {
          filteredData = filteredData.filter(item =>
            moment(item.dateCreation).year() === parseInt(formValue.annee)
          );
        }
        break;
    }

    return filteredData;
  }

  // =========================================================
  // STATISTIQUES
  // =========================================================

  private _calculerStatsParCategorie(data?: any[]): void {
    const sourceData = data || this.annonceDataSource.filteredData;
    const statsMap = new Map<number, CategorieStat>();

    sourceData.forEach((a: any) => {
      const cat = a?.categorie;
      if (cat?.id) {
        if (statsMap.has(cat.id)) {
          statsMap.get(cat.id)!.nombre++;
        } else {
          statsMap.set(cat.id, { id: cat.id, nom: cat.nom, nombre: 1 });
        }
      }
    });

    this.categoriesStats = Array.from(statsMap.values())
      .sort((a, b) => a.nom.localeCompare(b.nom));
  }

  // =========================================================
  // FILTRES
  // =========================================================

  setupSearchFilter(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilter(event?: Event): void {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchControl.setValue(filterValue);
    }
  }

  applyFilters(): void {
    const searchText = this.searchControl.value?.toLowerCase() || '';

    this.annonceDataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const searchableFields = [
        data.titre,
        data.categorie?.nom,
        data.sousCategorie?.nom,
        data.proprietaire?.nom,
        data.proprietaire?.contact,
        data.statut
      ];

      return searchableFields.some(field =>
        field && field.toString().toLowerCase().includes(searchTerms)
      );
    };

    this.annonceDataSource.filter = searchText;

    if (this.annonceDataSource.paginator) {
      this.annonceDataSource.paginator.firstPage();
    }

    this._calculerStatsParCategorie();
  }

  onPeriodChange(): void {
    const now = moment();
    const currentYear = now.year();
    const currentMonth = now.month() + 1;
    const currentWeek = this.getWeekNumber(now.toDate());
    const patchValues: any = { dateJour: null, dateDebut: null, dateFin: null, semaine: null, mois: null, annee: null };

    if (this.recensementPeriode === 'jour') {
      patchValues.dateJour = now.format('YYYY-MM-DD');
    } else if (this.recensementPeriode === 'semaine') {
      patchValues.semaine = currentWeek;
      patchValues.annee = currentYear;
    } else if (this.recensementPeriode === 'mois') {
      patchValues.mois = currentMonth;
      patchValues.annee = currentYear;
    } else if (this.recensementPeriode === 'annee') {
      patchValues.annee = currentYear;
    }

    this.searchForm.patchValue(patchValues, { emitEvent: false });

    if (this.recensementPeriode === 'semaine') {
      this.onSemaineChange();
    }

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.loadAnnonces();
  }

  onSemaineChange(): void {
    const annee = this.searchForm.get('annee')?.value;
    const semaine = this.searchForm.get('semaine')?.value;
    if (annee && semaine) {
      const weekDates = this.getWeekDates(annee, semaine);
      this.searchForm.patchValue({
        dateDebut: weekDates.dateDebut,
        dateFin: weekDates.dateFin
      }, { emitEvent: false });
    }
  }

  applyPeriodFilter(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadAnnonces();
  }

  // =========================================================
  // HELPERS SEMAINE
  // =========================================================

  private getWeekNumber(date: Date): number {
    const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
    const yearStart: any = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  getDateOfWeek(year: number, week: number): Date {
    const date = new Date(year, 0, 1);
    const dayOfWeek = date.getDay();
    const daysToAdd = (week - 1) * 7 - dayOfWeek + 1;
    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  getWeekDates(year: number, week: number): { dateDebut: string, dateFin: string } {
    const startDate = this.getDateOfWeek(year, week);
    const endDate = moment(startDate).add(6, 'days');
    return {
      dateDebut: moment(startDate).format('YYYY-MM-DD'),
      dateFin: endDate.format('YYYY-MM-DD')
    };
  }

  // =========================================================
  // EXPORT EXCEL
  // =========================================================

  exportExcel(): void {
    const dataToExport = this.annonceDataSource.filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

    const formatMontantExport = (montant: number): string => {
      if (!montant && montant !== 0) return '0 FCFA';
      return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
    };

    const formatDateExport = (date: any): string => {
      if (!date) return '-';
      try {
        const dateObj = moment(date);
        if (!dateObj.isValid()) return date.toString();
        return dateObj.format('DD/MM/YYYY HH:mm');
      } catch (error) {
        return date.toString();
      }
    };

    const getPrixExport = (row: any): string => {
      if (row.sansPrix) {
        return 'Non défini';
      }
      return row.prixFormatte || formatMontantExport(row.prix) || '0 FCFA';
    };

    const getStatutExport = (statut: string): string => {
      switch (statut) {
        case 'Actives': return 'Active';
        case 'En attente': return 'En attente';
        case 'Réfusées': return 'Refusée';
        default: return statut || 'Active';
      }
    };

    let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
            th { background-color: #4472C4; color: white; font-weight: bold; padding: 12px; border: 1px solid black; text-align: center; vertical-align: middle; }
            td { padding: 8px; border: 1px solid #D3D3D3; text-align: center; vertical-align: middle; }
            .total-row { background-color: #E7E6E6; font-weight: bold; }
            .total-row td { border: 1px solid black; text-align: center; }
            h2, h3 { text-align: center; }
            .statut-active { color: #10B981; font-weight: bold; }
            .statut-attente { color: #F59E0B; font-weight: bold; }
            .statut-refusee { color: #EF4444; font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>LISTE DES ANNONCES</h2>
        <h3>Période: ${this.getPeriodeTexte()}</h3>
        <table>
            <thead>
                <tr>
                    <th>TITRE</th>
                    <th>CATÉGORIE</th>
                    <th>SOUS-CATÉGORIE</th>
                    <th>PRIX</th>
                    <th>PROPRIÉTAIRE</th>
                    <th>CONTACT</th>
                    <th>STATUT</th>
                    <th>DATE ANNONCE</th>
                </tr>
            </thead>
            <tbody>
`;

    let totalAnnonces = 0;
    let totalAvecPrix = 0;
    let totalSansPrix = 0;

    dataToExport.forEach(row => {
      totalAnnonces++;
      if (row.sansPrix) {
        totalSansPrix++;
      } else {
        totalAvecPrix++;
      }

      const titre = row.titre && row.titre !== 'Non spécifié' ? row.titre : '-';
      const categorie = row.categorie?.nom && row.categorie?.nom !== 'Non spécifié' ? row.categorie.nom : '-';
      const sousCategorie = row.sousCategorie?.nom && row.sousCategorie?.nom !== 'Non spécifié' ? row.sousCategorie.nom : '-';
      const prix = getPrixExport(row);
      const proprietaire = row.proprietaire?.nom && row.proprietaire?.nom !== 'Non spécifié' ? row.proprietaire.nom : '-';
      const contact = row.proprietaire?.contact && row.proprietaire?.contact !== 'Non spécifié' ? row.proprietaire.contact : '-';
      const statut = getStatutExport(row.statut);
      const dateCreation = row.dateCreation ? formatDateExport(row.dateCreation) : '-';

      let statutClass = '';
      if (statut === 'Active') statutClass = 'statut-active';
      else if (statut === 'En attente') statutClass = 'statut-attente';
      else if (statut === 'Refusée') statutClass = 'statut-refusee';

      html += `
        <tr>
            <td>${this.escapeHtml(titre)}</td>
            <td>${this.escapeHtml(categorie)}</td>
            <td>${this.escapeHtml(sousCategorie)}</td>
            <td>${this.escapeHtml(prix)}</td>
            <td>${this.escapeHtml(proprietaire)}</td>
            <td>${this.escapeHtml(contact)}</td>
            <td class="${statutClass}">${statut}</td>
            <td>${dateCreation}</td>
        </tr>
    `;
    });

    html += `
            <tr class="total-row">
                <td colspan="6"><strong>TOTAL</strong></td>
                <td><strong>${totalAnnonces} annonce(s)</strong></td>
                <td></td>
            </tr>
            <tr class="total-row">
                <td colspan="6"><strong>RÉPARTITION</strong></td>
                <td colspan="2"><strong>Avec prix: ${totalAvecPrix} | Sans prix: ${totalSansPrix}</strong></td>
            </tr>
        </tbody>
    </table>
    </body>
    </html>
`;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `LISTE_ANNONCES_${moment().format('DD-MM-YYYY_HH-mm-ss')}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // =========================================================
  // EXPORT PDF
  // =========================================================

  exportPdf(): void {
    const dataToExport = this.annonceDataSource.filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

    const formatMontantExport = (montant: number): string => {
      if (!montant && montant !== 0) return '0 FCFA';
      return montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
    };

    const formatDateExport = (date: any): string => {
      if (!date) return '-';
      try {
        const dateObj = moment(date);
        if (!dateObj.isValid()) return date.toString();
        return dateObj.format('DD/MM/YYYY HH:mm');
      } catch (error) {
        return date.toString();
      }
    };

    const getPrixExport = (row: any): string => {
      if (row.sansPrix) {
        return 'Non défini';
      }
      return row.prixFormatte || formatMontantExport(row.prix) || '0 FCFA';
    };

    const getStatutExport = (statut: string): string => {
      switch (statut) {
        case 'Actives': return 'Active';
        case 'En attente': return 'En attente';
        case 'Réfusées': return 'Refusée';
        default: return statut || 'Active';
      }
    };

    let totalAnnonces = 0;
    let totalAvecPrix = 0;
    let totalSansPrix = 0;

    let printContent = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Liste des annonces</title>
        <style>
            @media print {
                body { margin: 20mm; }
                .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; color: #333; margin-bottom: 5px; }
            h3 { text-align: center; color: #666; margin-top: 0; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th { background-color: #4472C4; color: white; font-weight: bold; padding: 12px; border: 1px solid black; text-align: center; }
            td { padding: 8px; border: 1px solid #D3D3D3; text-align: center; }
            .total-row { background-color: #E7E6E6; font-weight: bold; }
            .total-row td { border: 1px solid black; }
            .statut-active { color: #10B981; font-weight: bold; }
            .statut-attente { color: #F59E0B; font-weight: bold; }
            .statut-refusee { color: #EF4444; font-weight: bold; }
            button {
                display: block;
                margin: 20px auto;
                padding: 10px 20px;
                background-color: #4472C4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            button:hover { background-color: #3461a1; }
        </style>
    </head>
    <body>
        <h2>LISTE DES ANNONCES</h2>
        <h3>Période: ${this.getPeriodeTexte()}</h3>

        <table>
            <thead>
                <tr>
                    <th>TITRE</th>
                    <th>CATÉGORIE</th>
                    <th>SOUS-CATÉGORIE</th>
                    <th>PRIX</th>
                    <th>PROPRIÉTAIRE</th>
                    <th>CONTACT</th>
                    <th>STATUT</th>
                    <th>DATE ANNONCE</th>
                </tr>
            </thead>
            <tbody>
`;

    dataToExport.forEach(row => {
      totalAnnonces++;
      if (row.sansPrix) {
        totalSansPrix++;
      } else {
        totalAvecPrix++;
      }

      const titre = row.titre && row.titre !== 'Non spécifié' ? row.titre : '-';
      const categorie = row.categorie?.nom && row.categorie?.nom !== 'Non spécifié' ? row.categorie.nom : '-';
      const sousCategorie = row.sousCategorie?.nom && row.sousCategorie?.nom !== 'Non spécifié' ? row.sousCategorie.nom : '-';
      const prix = getPrixExport(row);
      const proprietaire = row.proprietaire?.nom && row.proprietaire?.nom !== 'Non spécifié' ? row.proprietaire.nom : '-';
      const contact = row.proprietaire?.contact && row.proprietaire?.contact !== 'Non spécifié' ? row.proprietaire.contact : '-';
      const statut = getStatutExport(row.statut);
      const dateCreation = row.dateCreation ? formatDateExport(row.dateCreation) : '-';

      let statutClass = '';
      if (statut === 'Active') statutClass = 'statut-active';
      else if (statut === 'En attente') statutClass = 'statut-attente';
      else if (statut === 'Refusée') statutClass = 'statut-refusee';

      printContent += `
                <tr>
                    <td>${this.escapeHtml(titre)}</td>
                    <td>${this.escapeHtml(categorie)}</td>
                    <td>${this.escapeHtml(sousCategorie)}</td>
                    <td>${this.escapeHtml(prix)}</td>
                    <td>${this.escapeHtml(proprietaire)}</td>
                    <td>${this.escapeHtml(contact)}</td>
                    <td class="${statutClass}">${statut}</td>
                    <td>${dateCreation}</td>
                </tr>
        `;
    });

    printContent += `
                <tr class="total-row">
                    <td colspan="6"><strong>TOTAL</strong></td>
                    <td><strong>${totalAnnonces} annonce(s)</strong></td>
                    <td></td>
                </tr>
                <tr class="total-row">
                    <td colspan="6"><strong>RÉPARTITION</strong></td>
                    <td colspan="2"><strong>Avec prix: ${totalAvecPrix} | Sans prix: ${totalSansPrix}</strong></td>
                </tr>
            </tbody>
        </table>

        <button class="no-print" onclick="window.print()">🖨️ Imprimer le document</button>
    </body>
    </html>
`;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();

      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }

  private escapeHtml(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // =========================================================
  // HELPERS
  // =========================================================

  getPeriodeTexte(): string {
    if (!this.searchForm) return 'Toutes périodes';
    const vals = this.searchForm.value;

    if (this.recensementPeriode === 'jour' && vals.dateJour) {
      return `le ${moment(vals.dateJour).format('DD/MM/YYYY')}`;
    }
    if (this.recensementPeriode === 'semaine' && vals.dateDebut && vals.dateFin) {
      return `du ${moment(vals.dateDebut).format('DD/MM/YYYY')} au ${moment(vals.dateFin).format('DD/MM/YYYY')}`;
    }
    if (this.recensementPeriode === 'mois' && vals.mois) {
      return `du mois de ${this.getMoisNom(vals.mois - 1)} ${vals.annee}`;
    }
    if (this.recensementPeriode === 'annee' && vals.annee) {
      return `de l'année ${vals.annee}`;
    }
    return 'Toutes périodes';
  }

  getMoisNom(index: number): string {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return months[index] || '';
  }

  get totalFilteredItems(): number {
    return this.annonceDataSource.filteredData.length;
  }

  // =========================================================
  // STYLES
  // =========================================================

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

  getIconBgColor(index: number): string {
    return this.iconBgColors[index % this.iconBgColors.length];
  }

  getIconColor(index: number): string {
    return this.iconColors[index % this.iconColors.length];
  }

  // =========================================================
  // ACTIONS
  // =========================================================

  // ✅ NOUVELLE ACTION : Publier une annonce
  publierAnnonce(): void {
    this.router.navigate(['/annonce/ajouter']);
  }

  valider(annonce: any): void {
    this.inProgress = true;
    this._annonceService.valider(annonce.id).subscribe({
      next: () => { this.inProgress = false; this.loadAnnonces(); },
      error: () => { this.inProgress = false; },
    });
  }

  refuser(annonce: any): void {
    this.inProgress = true;
    this._annonceService.refuser(annonce.id).subscribe({
      next: () => { this.inProgress = false; this.loadAnnonces(); },
      error: () => { this.inProgress = false; },
    });
  }

  voirDetail(annonce: any): void {
    this._annonceService.findById(annonce.id).subscribe({
      next: (result: any) => {
        this._dialog.open(AnnonceModalListComponent, {
          width: '600px',
          disableClose: false,
          data: result?.data,
        });
      },
    });
  }

  modifier(annonce: any): void {
    this.router.navigate(['/annonce/modifier', annonce.id]);
  }

  deleteElement(annonce: any): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une annonce',
      message: 'Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action ne peut pas être annulée !',
      icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
      actions: {
        confirm: { label: 'Supprimer', color: 'warn' },
        cancel: { show: true, label: 'Annuler' },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(annonce);
      }
    });
  }

  supprimer(annonce: any): void {
    this.inProgress = true;
    this._annonceService.supprimer(annonce.id).subscribe({
      next: () => { this.inProgress = false; this.loadAnnonces(); },
      error: () => { this.inProgress = false; },
    });
  }
}