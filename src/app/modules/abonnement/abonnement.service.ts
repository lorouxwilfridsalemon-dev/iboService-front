
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class AbonnementService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'metier/abonnement';

//   /** Liste TOUTES les réservations (vue admin) */
//   listeAdmin(): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste`);
//   }

//   /** ✅ NOUVEAU : Liste des réservations avec filtres de périodicité */
//   listeAdminParPeriode(params: any): Observable<any> {
//     let httpParams = new HttpParams();
//     Object.keys(params).forEach(key => {
//       if (params[key] !== null && params[key] !== undefined) {
//         httpParams = httpParams.set(key, params[key]);
//       }
//     });
//     return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste-par-periode`, { params: httpParams });
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

//   //  routr du Metier
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class AbonnementService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'metier/abonnement';

  // =========================================================================
  // ROUTES PUBLIQUES / UTILISATEUR
  // =========================================================================

  /** Liste des plans disponibles (public) */
  getPlans(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}/plans`);
  }

  /** Abonnement actif de l'utilisateur connecté */
  getMonAbonnement(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}/mon-abonnement`);
  }

  /** Historique des abonnements de l'utilisateur connecté */
  getHistorique(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}/historique`);
  }

  /** Souscrire à un plan */
  souscrire(codePlan: string): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}/souscrire`, { codePlan });
  }

  /** Annuler l'abonnement actif (utilisateur connecté) */
  annuler(raison?: string): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}/annuler`, { raison });
  }

  // =========================================================================
  // ROUTES ADMIN
  // =========================================================================

  /** Liste des abonnements (vue admin) avec filtres de périodicité */
  listeAdmin(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this._http.get<any>(`${environment.api}/${this._endpoint}/admin/liste`, { params: httpParams });
  }

  /** ✅ Création manuelle d'un abonnement par l'admin */
  creerAdmin(data: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}/admin/creer`, data);
  }

  /** Activer un abonnement (statut → actif) */
  activerAdmin(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/activer/${id}`, {});
  }

  /** Annuler un abonnement (admin) */
  annulerAdmin(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/admin/annuler/${id}`, {});
  }

  /** Supprimer un abonnement (admin) */
  supprimerAdmin(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/admin/${id}`);
  }
}  