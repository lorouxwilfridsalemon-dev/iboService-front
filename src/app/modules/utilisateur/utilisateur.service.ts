
// utilisateur.service.ts sans
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'environments/environment';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class UtilisateurService {

//   private baseUrl = `${environment.api}/metier/utilisateur`;

//   constructor(private _http: HttpClient) {}

//   findAll(): Observable<any> {
//     console.log('URL appelée:', this.baseUrl); // Pour déboguer
//     return this._http.get<any>(this.baseUrl);
//   }

//   findById(id: number): Observable<any> {
//     return this._http.get<any>(`${this.baseUrl}/${id}`);
//   }

//   create(utilisateur: any): Observable<any> {
//     return this._http.post<any>(this.baseUrl, utilisateur);
//   }

//   update(id: number, utilisateur: any): Observable<any> {
//     return this._http.put<any>(`${this.baseUrl}/${id}`, utilisateur);
//   }

//   delete(id: number): Observable<any> {
//     return this._http.delete<any>(`${this.baseUrl}/${id}`);
//   }
// }

// utilisateur.service.ts avec
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  private baseUrl = `${environment.api}/metier/utilisateur`;

  constructor(private _http: HttpClient) {}

  /**
   * ✅ Récupère tous les utilisateurs
   * Possibilité d'ajouter des paramètres de filtrage
   */
  findAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this._http.get<any>(this.baseUrl, { params: httpParams });
  }

  /**
   * ✅ NOUVEAU : Récupère les utilisateurs par périodicité
   * @param params - { periodicite: 'jour'|'semaine'|'mois'|'annee', dateJour?, semaine?, mois?, annee? }
   */
  findAllParPeriode(params: any): Observable<any> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this._http.get<any>(`${this.baseUrl}/par-periode`, { params: httpParams });
  }

  /**
   * ✅ NOUVEAU : Récupère le nombre d'utilisateurs par statut
   */
  getStatistiques(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this._http.get<any>(`${this.baseUrl}/statistiques`, { params: httpParams });
  }

  findById(id: number): Observable<any> {
    return this._http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(utilisateur: any): Observable<any> {
    return this._http.post<any>(this.baseUrl, utilisateur);
  }

  update(id: number, utilisateur: any): Observable<any> {
    return this._http.put<any>(`${this.baseUrl}/${id}`, utilisateur);
  }

  delete(id: number): Observable<any> {
    return this._http.delete<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * ✅ NOUVEAU : Active/désactive un utilisateur
   */
  activerDesactiver(id: number, geler: number): Observable<any> {
    return this._http.put<any>(`${this.baseUrl}/${id}/statut`, { geler });
  }

  /**
   * ✅ NOUVEAU : Export des utilisateurs
   */
  exportUtilisateurs(format: 'excel' | 'pdf', params?: any): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this._http.get(`${this.baseUrl}/export/${format}`, {
      params: httpParams,
      responseType: 'blob'
    });
  }
}