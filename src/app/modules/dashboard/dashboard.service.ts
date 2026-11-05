// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class DashboardService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'metier/dashboard';

//   // =========================================================
//   // ANNONCES
//   // =========================================================

//   /** Nombre d'annonces par périodicité (jour / semaine / mois / année / total) */
//   annoncesParPeriodicite(): Observable<any> {
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/annonces-periodicite`
//     );
//   }

//   /** Tendance des annonces sur les 12 derniers mois */
//   annoncesTendance(): Observable<any> {
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/annonces-tendance`
//     );
//   }

//   // =========================================================
//   // VUE D'ENSEMBLE
//   // =========================================================

//   /**
//    * Vue d'ensemble : annonces + utilisateurs + réservations + catégories
//    * Accepte une plage de dates optionnelle.
//    */
//   vueEnsemble(dateDebut?: Date | null, dateFin?: Date | null): Observable<any> {
//     const params: string[] = [];
//     if (dateDebut) params.push(`dateDebut=${this._formaterDate(dateDebut)}`);
//     if (dateFin) params.push(`dateFin=${this._formaterDate(dateFin)}`);
//     const suffixe = params.length > 0 ? `?${params.join('&')}` : '';
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/vue-ensemble${suffixe}`
//     );
//   }

//   // =========================================================
//   // ✅ ABONNEMENTS
//   // =========================================================

//   /**
//    * Statistiques globales des abonnements.
//    * Accepte une plage de dates optionnelle.
//    */
//   abonnementsStats(dateDebut?: Date | null, dateFin?: Date | null): Observable<any> {
//     const params: string[] = [];
//     if (dateDebut) params.push(`dateDebut=${this._formaterDate(dateDebut)}`);
//     if (dateFin) params.push(`dateFin=${this._formaterDate(dateFin)}`);
//     const suffixe = params.length > 0 ? `?${params.join('&')}` : '';
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/abonnements-stats${suffixe}`
//     );
//   }

//   // =========================================================
//   // HELPERS
//   // =========================================================

//   private _formaterDate(date: Date): string {
//     const annee = date.getFullYear();
//     const mois = String(date.getMonth() + 1).padStart(2, '0');
//     const jour = String(date.getDate()).padStart(2, '0');
//     return `${annee}-${mois}-${jour}`;
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class DashboardService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'metier/dashboard';
  private readonly _endpointAbonnement = 'metier/abonnement';

  // =========================================================
  // ANNONCES
  // =========================================================

  /** Nombre d'annonces par périodicité (jour / semaine / mois / année / total) */
  annoncesParPeriodicite(): Observable<any> {
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/annonces-periodicite`
    );
  }

  /** Tendance des annonces sur les 12 derniers mois */
  annoncesTendance(): Observable<any> {
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/annonces-tendance`
    );
  }

  // =========================================================
  // VUE D'ENSEMBLE
  // =========================================================

  /**
   * Vue d'ensemble : annonces + utilisateurs + réservations + catégories
   * Accepte une plage de dates optionnelle.
   */
  vueEnsemble(dateDebut?: Date | null, dateFin?: Date | null): Observable<any> {
    const params: string[] = [];
    if (dateDebut) params.push(`dateDebut=${this._formaterDate(dateDebut)}`);
    if (dateFin) params.push(`dateFin=${this._formaterDate(dateFin)}`);
    const suffixe = params.length > 0 ? `?${params.join('&')}` : '';
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/vue-ensemble${suffixe}`
    );
  }

  // =========================================================
  // ✅ ABONNEMENTS
  // =========================================================

  /**
   * Statistiques globales des abonnements pour le dashboard.
   * Endpoint : GET /metier/abonnement/admin/stats
   * Accepte une plage de dates optionnelle.
   */
  abonnementsStats(dateDebut?: Date | null, dateFin?: Date | null): Observable<any> {
    const params: string[] = [];
    if (dateDebut) params.push(`dateDebut=${this._formaterDate(dateDebut)}`);
    if (dateFin) params.push(`dateFin=${this._formaterDate(dateFin)}`);
    const suffixe = params.length > 0 ? `?${params.join('&')}` : '';
    return this._http.get<any>(
      `${environment.api}/${this._endpointAbonnement}/admin/stats${suffixe}`
    );
  }

  // =========================================================
  // HELPERS
  // =========================================================

  private _formaterDate(date: Date): string {
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');
    return `${annee}-${mois}-${jour}`;
  }
} 