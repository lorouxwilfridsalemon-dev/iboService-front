
// sans periodicité

// import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { FuseConfirmationService } from '@fuse/services/confirmation';
// import { ReservationService } from '../reservation.service';
// import { ReservationInterface } from '../reservation.interface';
// import { ReservationAdminFormComponent } from '../form/reservation-admin-form.component';

// @Component({
//   selector: 'app-reservation-list',
//   templateUrl: './reservation-list.component.html',
//   styleUrls: ['./reservation-list.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class ReservationListComponent implements OnInit {

//   constructor(
//     private _dialog: MatDialog,
//     private _reservationService: ReservationService,
//     private _fuseConfirmationService: FuseConfirmationService,
//   ) { }

//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatSort, { static: true }) sort: MatSort;

//   public displayedColumns: string[] = ['annonce', 'client', 'proprietaire', 'dates', 'montant', 'statut', 'action'];
//   public reservationDataSource = new MatTableDataSource<any>([]);
//   public inProgress = false;

//   public listeReservation: ReservationInterface[] = [];
//   public total = 0;
//   public totalEnAttente = 0;
//   public totalConfirmees = 0;
//   public totalAnnulees = 0;

//   ngOnInit() {
//     this.getListeReservation();
//   }

//   ngAfterViewInit(): void {
//     this.reservationDataSource.sort = this.sort;
//     this.reservationDataSource.paginator = this.paginator;
//   }

//   getListeReservation() {
//     this.inProgress = true;
//     this._reservationService.listeAdmin().subscribe({
//       next: (result: any) => {
//         this.inProgress = false;
//         this.listeReservation = result?.data ?? [];
//         this.total = this.listeReservation.length;
//         this._calculerStats();
//         this.reservationDataSource.data = this.listeReservation;
//         this.reservationDataSource.sort = this.sort;
//         this.reservationDataSource.paginator = this.paginator;
//       },
//       error: () => {
//         this.inProgress = false;
//       },
//     });
//   }

//   private _calculerStats(): void {
//     this.totalEnAttente = this.listeReservation.filter((r: any) => r.statut === 'en_attente').length;
//     this.totalConfirmees = this.listeReservation.filter((r: any) => r.statut === 'confirmee').length;
//     this.totalAnnulees = this.listeReservation.filter((r: any) => r.statut === 'annulee').length;
//   }

//   applyFilter(event?: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.reservationDataSource.filter = filterValue.trim().toLowerCase();
//     if (this.reservationDataSource.paginator) {
//       this.reservationDataSource.paginator.firstPage();
//     }
//   }

//   /** ✅ AJOUT : ouvre le formulaire de création manuelle. */
//   ouvrirFormulaireCreation(): void {
//     const dialogRef = this._dialog.open(ReservationAdminFormComponent, {
//       width: '600px',
//       disableClose: true,
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.getListeReservation();
//       }
//     });
//   }

//   valider(reservation: any): void {
//     this.inProgress = true;
//     this._reservationService.valider(reservation.id).subscribe({
//       next: () => { this.inProgress = false; this.getListeReservation(); },
//       error: () => { this.inProgress = false; },
//     });
//   }

//   annuler(reservation: any): void {
//     this.inProgress = true;
//     this._reservationService.annuler(reservation.id).subscribe({
//       next: () => { this.inProgress = false; this.getListeReservation(); },
//       error: () => { this.inProgress = false; },
//     });
//   }

//   deleteElement(reservation: any): void {
//     const confirmation = this._fuseConfirmationService.open({
//       title: 'Supprimer une réservation',
//       message: 'Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée !',
//       icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
//       actions: {
//         confirm: { label: 'Supprimer', color: 'warn' },
//         cancel: { show: true, label: 'Annuler' },
//       },
//       dismissible: false,
//     });

//     confirmation.afterClosed().subscribe((result) => {
//       if (result === 'confirmed') {
//         this.supprimer(reservation);
//       }
//     });
//   }

//   supprimer(reservation: any): void {
//     this.inProgress = true;
//     this._reservationService.supprimer(reservation.id).subscribe({
//       next: () => { this.inProgress = false; this.getListeReservation(); },
//       error: () => { this.inProgress = false; },
//     });
//   }
// }

// avec periodicité
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

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ReservationService } from '../reservation.service';
import { ReservationInterface } from '../reservation.interface';
import { ReservationAdminFormComponent } from '../form/reservation-admin-form.component';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReservationListComponent implements OnInit, AfterViewInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _dialog: MatDialog,
    private _reservationService: ReservationService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _adapter: DateAdapter<any>,
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

  public displayedColumns: string[] = ['annonce', 'client', 'proprietaire', 'dates', 'montant', 'statut', 'action'];
  public reservationDataSource = new MatTableDataSource<any>([]);
  public inProgress = false;

  public listeReservation: ReservationInterface[] = [];
  public allData: ReservationInterface[] = [];
  public total = 0;
  public totalEnAttente = 0;
  public totalConfirmees = 0;
  public totalAnnulees = 0;

  // ✅ Données pour les filtres
  mois: any[] = [
    { id: 1, name: 'Janvier' },
    { id: 2, name: 'Février' },
    { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' },
    { id: 5, name: 'Mai' },
    { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' },
    { id: 8, name: 'Août' },
    { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' },
    { id: 11, name: 'Novembre' },
    { id: 12, name: 'Décembre' }
  ];

  annees: any[] = [];
  ListeSemaineGeneral: any[] = [];
  currentWeek: number;

  private initializing = true;

  // =========================================================
  // LIFE CYCLE
  // =========================================================

  ngOnInit() {
    this.initAnnees();
    this.initSemaines();
    this.initForm();
    this.loadReservations();
    this.setupSearchFilter();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.reservationDataSource.paginator = this.paginator;
      this.reservationDataSource.sort = this.sort;
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
  // LOAD DATA
  // =========================================================

  loadReservations(): void {
    this.inProgress = true;
    const params = this.buildRequestParams();

    this._reservationService.listeAdmin()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (result: any) => {
          this.inProgress = false;
          this.listeReservation = result?.data ?? [];
          this.allData = [...this.listeReservation];
          this.total = this.listeReservation.length;

          // ✅ Filtrer selon la périodicité
          const filteredData = this.filterDataByPeriod(this.allData);
          this.reservationDataSource.data = filteredData;
          this.total = filteredData.length;

          this.reservationDataSource.paginator = this.paginator;
          this.reservationDataSource.sort = this.sort;

          this._calculerStats(filteredData);

          setTimeout(() => {
            this.initializing = false;
          }, 100);
        },
        error: (error) => {
          this.inProgress = false;
          console.error('Erreur lors du chargement des réservations:', error);
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
            moment(item.dateCreation).format('YYYY-MM-DD') === dateFilter ||
            moment(item.dateDebut).format('YYYY-MM-DD') === dateFilter
          );
        }
        break;
      case 'semaine':
        if (formValue.semaine && formValue.annee) {
          const weekDates = this.getWeekDates(formValue.annee, formValue.semaine);
          const dateDebut = moment(weekDates.dateDebut);
          const dateFin = moment(weekDates.dateFin);
          filteredData = filteredData.filter(item =>
            moment(item.dateCreation).isBetween(dateDebut, dateFin, 'day', '[]') ||
            moment(item.dateDebut).isBetween(dateDebut, dateFin, 'day', '[]')
          );
        }
        break;
      case 'mois':
        if (formValue.mois && formValue.annee) {
          filteredData = filteredData.filter(item => {
            const dateItem = moment(item.dateCreation);
            const dateDebutItem = moment(item.dateDebut);
            return (dateItem.month() + 1 === parseInt(formValue.mois) && dateItem.year() === parseInt(formValue.annee)) ||
                   (dateDebutItem.month() + 1 === parseInt(formValue.mois) && dateDebutItem.year() === parseInt(formValue.annee));
          });
        }
        break;
      case 'annee':
        if (formValue.annee) {
          filteredData = filteredData.filter(item =>
            moment(item.dateCreation).year() === parseInt(formValue.annee) ||
            moment(item.dateDebut).year() === parseInt(formValue.annee)
          );
        }
        break;
    }

    return filteredData;
  }

  // =========================================================
  // STATISTIQUES
  // =========================================================

  private _calculerStats(data?: any[]): void {
    const sourceData = data || this.reservationDataSource.filteredData;
    this.totalEnAttente = sourceData.filter((r: any) => r.statut === 'en_attente').length;
    this.totalConfirmees = sourceData.filter((r: any) => r.statut === 'confirmee').length;
    this.totalAnnulees = sourceData.filter((r: any) => r.statut === 'annulee').length;
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

    this.reservationDataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = filter.toLowerCase();
      const searchableFields = [
        data.annonce?.titre,
        data.client?.nom,
        data.client?.contact,
        data.proprietaire?.nom,
        data.proprietaire?.contact,
        data.montantFormatte,
        data.statut
      ];

      return searchableFields.some(field =>
        field && field.toString().toLowerCase().includes(searchTerms)
      );
    };

    this.reservationDataSource.filter = searchText;

    if (this.reservationDataSource.paginator) {
      this.reservationDataSource.paginator.firstPage();
    }

    this._calculerStats();
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

    this.loadReservations();
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
    this.loadReservations();
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
  // EXPORT
  // =========================================================

  exportExcel(): void {
    const dataToExport = this.reservationDataSource.filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

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

    const getStatutExport = (statut: string): string => {
      switch (statut) {
        case 'en_attente': return 'En attente';
        case 'confirmee': return 'Confirmée';
        case 'annulee': return 'Annulée';
        default: return statut || '-';
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
            .statut-attente { color: #F59E0B; font-weight: bold; }
            .statut-confirmee { color: #10B981; font-weight: bold; }
            .statut-annulee { color: #EF4444; font-weight: bold; }
        </style>
    </head>
    <body>
        <h2>LISTE DES RÉSERVATIONS</h2>
        <h3>Période: ${this.getPeriodeTexte()}</h3>
        <table>
            <thead>
                <tr>
                    <th>ANNONCE</th>
                    <th>CLIENT</th>
                    <th>CONTACT CLIENT</th>
                    <th>PROPRIÉTAIRE</th>
                    <th>DATE DÉBUT</th>
                    <th>DATE FIN</th>
                    <th>MONTANT</th>
                    <th>STATUT</th>
                </tr>
            </thead>
            <tbody>
`;

    let totalReservations = 0;
    let totalAttente = 0;
    let totalConfirmees = 0;
    let totalAnnulees = 0;

    dataToExport.forEach(row => {
      totalReservations++;

      const statut = getStatutExport(row.statut);
      let statutClass = '';
      
      if (statut === 'En attente') {
        totalAttente++;
        statutClass = 'statut-attente';
      } else if (statut === 'Confirmée') {
        totalConfirmees++;
        statutClass = 'statut-confirmee';
      } else if (statut === 'Annulée') {
        totalAnnulees++;
        statutClass = 'statut-annulee';
      }

      const annonce = row.annonce?.titre || '-';
      const client = row.client?.nom || '-';
      const contactClient = row.client?.contact || '-';
      const proprietaire = row.proprietaire?.nom || '-';
      const dateDebut = row.dateDebut ? formatDateExport(row.dateDebut) : '-';
      const dateFin = row.dateFin ? formatDateExport(row.dateFin) : '-';
      const montant = row.montantFormatte || '0 FCFA';

      html += `
        <tr>
            <td>${this.escapeHtml(annonce)}</td>
            <td>${this.escapeHtml(client)}</td>
            <td>${this.escapeHtml(contactClient)}</td>
            <td>${this.escapeHtml(proprietaire)}</td>
            <td>${dateDebut}</td>
            <td>${dateFin}</td>
            <td>${this.escapeHtml(montant)}</td>
            <td class="${statutClass}">${statut}</td>
        </tr>
    `;
    });

    html += `
            <tr class="total-row">
                <td colspan="7"><strong>TOTAL</strong></td>
                <td><strong>${totalReservations} réservation(s)</strong></td>
            </tr>
            <tr class="total-row">
                <td colspan="7"><strong>RÉPARTITION</strong></td>
                <td><strong>Attente: ${totalAttente} | Confirmées: ${totalConfirmees} | Annulées: ${totalAnnulees}</strong></td>
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
    link.download = `LISTE_RESERVATIONS_${moment().format('DD-MM-YYYY_HH-mm-ss')}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportPdf(): void {
    const dataToExport = this.reservationDataSource.filteredData;

    if (!dataToExport || dataToExport.length === 0) {
      console.warn('Aucune donnée à exporter');
      return;
    }

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

    const getStatutExport = (statut: string): string => {
      switch (statut) {
        case 'en_attente': return 'En attente';
        case 'confirmee': return 'Confirmée';
        case 'annulee': return 'Annulée';
        default: return statut || '-';
      }
    };

    let totalReservations = 0;
    let totalAttente = 0;
    let totalConfirmees = 0;
    let totalAnnulees = 0;

    let printContent = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Liste des réservations</title>
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
            .statut-attente { color: #F59E0B; font-weight: bold; }
            .statut-confirmee { color: #10B981; font-weight: bold; }
            .statut-annulee { color: #EF4444; font-weight: bold; }
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
        <h2>LISTE DES RÉSERVATIONS</h2>
        <h3>Période: ${this.getPeriodeTexte()}</h3>
        
        <table>
            <thead>
                <tr>
                    <th>ANNONCE</th>
                    <th>CLIENT</th>
                    <th>CONTACT CLIENT</th>
                    <th>PROPRIÉTAIRE</th>
                    <th>DATE DÉBUT</th>
                    <th>DATE FIN</th>
                    <th>MONTANT</th>
                    <th>STATUT</th>
                </tr>
            </thead>
            <tbody>
`;

    dataToExport.forEach(row => {
      totalReservations++;

      const statut = getStatutExport(row.statut);
      let statutClass = '';
      
      if (statut === 'En attente') {
        totalAttente++;
        statutClass = 'statut-attente';
      } else if (statut === 'Confirmée') {
        totalConfirmees++;
        statutClass = 'statut-confirmee';
      } else if (statut === 'Annulée') {
        totalAnnulees++;
        statutClass = 'statut-annulee';
      }

      const annonce = row.annonce?.titre || '-';
      const client = row.client?.nom || '-';
      const contactClient = row.client?.contact || '-';
      const proprietaire = row.proprietaire?.nom || '-';
      const dateDebut = row.dateDebut ? formatDateExport(row.dateDebut) : '-';
      const dateFin = row.dateFin ? formatDateExport(row.dateFin) : '-';
      const montant = row.montantFormatte || '0 FCFA';

      printContent += `
                <tr>
                    <td>${this.escapeHtml(annonce)}</td>
                    <td>${this.escapeHtml(client)}</td>
                    <td>${this.escapeHtml(contactClient)}</td>
                    <td>${this.escapeHtml(proprietaire)}</td>
                    <td>${dateDebut}</td>
                    <td>${dateFin}</td>
                    <td>${this.escapeHtml(montant)}</td>
                    <td class="${statutClass}">${statut}</td>
                </tr>
        `;
    });

    printContent += `
                <tr class="total-row">
                    <td colspan="7"><strong>TOTAL</strong></td>
                    <td><strong>${totalReservations} réservation(s)</strong></td>
                </tr>
                <tr class="total-row">
                    <td colspan="7"><strong>RÉPARTITION</strong></td>
                    <td><strong>Attente: ${totalAttente} | Confirmées: ${totalConfirmees} | Annulées: ${totalAnnulees}</strong></td>
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
    return this.reservationDataSource.filteredData.length;
  }

  // =========================================================
  // ACTIONS
  // =========================================================

  ouvrirFormulaireCreation(): void {
    const dialogRef = this._dialog.open(ReservationAdminFormComponent, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReservations();
      }
    });
  }

  valider(reservation: any): void {
    this.inProgress = true;
    this._reservationService.valider(reservation.id).subscribe({
      next: () => { this.inProgress = false; this.loadReservations(); },
      error: () => { this.inProgress = false; },
    });
  }

  annuler(reservation: any): void {
    this.inProgress = true;
    this._reservationService.annuler(reservation.id).subscribe({
      next: () => { this.inProgress = false; this.loadReservations(); },
      error: () => { this.inProgress = false; },
    });
  }

  deleteElement(reservation: any): void {
    const confirmation = this._fuseConfirmationService.open({
      title: 'Supprimer une réservation',
      message: 'Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée !',
      icon: { show: true, name: 'mat_solid:delete_forever', color: 'warn' },
      actions: {
        confirm: { label: 'Supprimer', color: 'warn' },
        cancel: { show: true, label: 'Annuler' },
      },
      dismissible: false,
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.supprimer(reservation);
      }
    });
  }

  supprimer(reservation: any): void {
    this.inProgress = true;
    this._reservationService.supprimer(reservation.id).subscribe({
      next: () => { this.inProgress = false; this.loadReservations(); },
      error: () => { this.inProgress = false; },
    });
  }
}