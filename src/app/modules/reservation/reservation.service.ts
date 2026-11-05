
// sans periodicité
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class ReservationService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'metier/reservation';

//   /** Liste TOUTES les réservations (vue admin) */
//   listeAdmin(): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste`);
//   }

//   /** Valide une réservation (statut → confirmée) */
//   valider(id: number): Observable<any> {
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/valider/${id}`, {});
//   }

//   /** Annule une réservation */
//   annuler(id: number): Observable<any> {
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/annuler/${id}`, {});
//   }

//   /** ✅ AJOUT : création manuelle d'une réservation par l'admin. */
//   creerAdmin(data: any): Observable<any> {
//     return this._http.post<any>(`${environment.api}/${this._endpoint}/admin/creer`, data);
//   }

//   /** Supprime (suppression douce) une réservation */
//   supprimer(id: number): Observable<any> {
//     return this._http.delete<any>(`${environment.api}/${this._endpoint}/admin/${id}`);
//   }
// }

// avec periodicité
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class ReservationService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'metier/reservation';

  /** Liste TOUTES les réservations (vue admin) */
  listeAdmin(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste`);
  }

  /** ✅ NOUVEAU : Liste des réservations avec filtres de périodicité */
  listeAdminParPeriode(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste-par-periode`, { params: httpParams });
  }

  /** Valide une réservation (statut → confirmée) */
  valider(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/valider/${id}`, {});
  }

  /** Annule une réservation */
  annuler(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/annuler/${id}`, {});
  }

  /** ✅ AJOUT : création manuelle d'une réservation par l'admin. */
  creerAdmin(data: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}/admin/creer`, data);
  }

  /** Supprime (suppression douce) une réservation */
  supprimer(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/admin/${id}`);
  }
}