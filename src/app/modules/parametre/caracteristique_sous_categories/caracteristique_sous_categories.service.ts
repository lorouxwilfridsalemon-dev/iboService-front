

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class CaracteristiqueSousCategoriesService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'metier/caracteristique-sous-categories';

//   /**
//    * ✅ TOUT passe par le métier ici, dès le départ — l'entité pivot n'a
//    * pas de "nom"/"description" comme le générique le suppose partout
//    * ailleurs, donc autant éviter cette confusion complètement.
//    */
//   findAll(): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}`);
//   }

//   /** Crée une liaison caractéristique ↔ sous-catégorie */
//   create(caracteristiqueId: number, sousCategorieId: number): Observable<any> {
//     return this._http.post<any>(`${environment.api}/${this._endpoint}`, {
//       caracteristiqueId,
//       sousCategorieId,
//     });
//   }

//   /** Supprime une liaison (suppression douce) */
//   supprimer(id: number): Observable<any> {
//     return this._http.delete<any>(`${environment.api}/${this._endpoint}/${id}`);
//   }
// } 


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class CaracteristiqueSousCategoriesService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'metier/caracteristique-sous-categories';

  /**
   * ✅ TOUT passe par le métier ici, dès le départ — l'entité pivot n'a
   * pas de "nom"/"description" comme le générique le suppose partout
   * ailleurs, donc autant éviter cette confusion complètement.
   */
  findAll(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}`);
  }

  /** Crée une liaison caractéristique ↔ sous-catégorie */
  create(caracteristiqueId: number, sousCategorieId: number): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}`, {
      caracteristiqueId,
      sousCategorieId,
    });
  }

  /** Supprime une liaison (suppression douce) */
  supprimer(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/${id}`);
  }
}