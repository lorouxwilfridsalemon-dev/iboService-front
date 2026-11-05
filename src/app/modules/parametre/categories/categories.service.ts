// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class CategoriesService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'categories';

//   /** Ajoute un nouvel enregistrement de catégorie */
//   save(categories: any): Observable<any> {
//     return this._http.post<any>(`${environment.api}/${this._endpoint}`, categories);
//   }

//   /**
//    * Modifie un enregistrement existant.
//    * ✅ primaryKey correctement encodé en JSON dans l'URL.
//    */
//   update(categories: any): Observable<any> {
//     const primaryKey = encodeURI(JSON.stringify({ id: categories.id }));
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/${primaryKey}`, categories);
//   }

//   /**
//    * Supprime un enregistrement.
//    * ✅ CORRIGÉ : primaryKey encodé en JSON — avant, l'objet était inséré
//    * brut dans l'URL, donnant littéralement '/categories/[object Object]'
//    * (d'où le 500 Internal Server Error).
//    */
//   delete(primaryKey: any): Observable<any> {
//     const cle = encodeURI(JSON.stringify(primaryKey));
//     return this._http.delete<any>(`${environment.api}/${this._endpoint}/${cle}`);
//   }

//   /** Trouve tous les enregistrements */
//   findAll(): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}`);
//   }

//   /** Trouve tous les enregistrements selon le filtre */
//   query(queryParameter: any): Observable<any[]> {
//     return this._http.get<any[]>(
//       `${environment.api}/${this._endpoint}/query/${encodeURI(JSON.stringify(queryParameter))}`,
//     );
//   }

//   /** Trouve un seul enregistrement */
//   findOne(primaryKey: any): Observable<any> {
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/${encodeURI(JSON.stringify(primaryKey))}`,
//     );
//   }

//   /**
//    * ✅ AJOUT : méthode dédiée, même convention de nommage que
//    * SousCategoriesService.deleteSousCategories() — extrait l'id de
//    * l'objet complet reçu du composant et délègue à delete() (donc
//    * correctement encodé en JSON).
//    */
//   deleteCategories(categories: any): Observable<any> {
//     return this.delete({ id: categories.id });
//   }

//   /**
//    * ✅ AJOUT : suppression via le métier (suppression douce, geler=1)
//    * — la route générique échouait avec "Validation object failed".
//    */
//   supprimerCategories(id: number): Observable<any> {
//     return this._http.delete<any>(
//       `${environment.api}/metier/categories/supprimerCategories/${id}`,
//     );
//   }
// } 

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class CategoriesService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'categories';

  /** Ajoute un nouvel enregistrement de catégorie */
  save(categories: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}`, categories);
  }

  /**
   * Modifie un enregistrement existant.
   * ✅ primaryKey correctement encodé en JSON dans l'URL.
   */
  update(categories: any): Observable<any> {
    const primaryKey = encodeURI(JSON.stringify({ id: categories.id }));
    return this._http.put<any>(`${environment.api}/${this._endpoint}/${primaryKey}`, categories);
  }

  /**
   * Supprime un enregistrement.
   * ✅ CORRIGÉ : primaryKey encodé en JSON — avant, l'objet était inséré
   * brut dans l'URL, donnant littéralement '/categories/[object Object]'
   * (d'où le 500 Internal Server Error).
   */
  delete(primaryKey: any): Observable<any> {
    const cle = encodeURI(JSON.stringify(primaryKey));
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/${cle}`);
  }

  /** Trouve tous les enregistrements */
  findAll(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}`);
  }

  /** Trouve tous les enregistrements selon le filtre */
  query(queryParameter: any): Observable<any[]> {
    return this._http.get<any[]>(
      `${environment.api}/${this._endpoint}/query/${encodeURI(JSON.stringify(queryParameter))}`,
    );
  }

  /** Trouve un seul enregistrement */
  findOne(primaryKey: any): Observable<any> {
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/${encodeURI(JSON.stringify(primaryKey))}`,
    );
  }

  /**
   * ✅ AJOUT : méthode dédiée, même convention de nommage que
   * SousCategoriesService.deleteSousCategories() — extrait l'id de
   * l'objet complet reçu du composant et délègue à delete() (donc
   * correctement encodé en JSON).
   */
  deleteCategories(categories: any): Observable<any> {
    return this.delete({ id: categories.id });
  }

  /**
   * ✅ AJOUT : suppression via le métier (suppression douce, geler=1)
   * — la route générique échouait avec "Validation object failed".
   */
  supprimerCategories(id: number): Observable<any> {
    return this._http.delete<any>(
      `${environment.api}/metier/categories/supprimerCategories/${id}`,
    );
  }

  // ====================================================================
  // ✅ AJOUT : ajout/modification via le métier — même bug que la
  // suppression, le DTO générique rejetait les requêtes.
  // ====================================================================

  listeCategories(): Observable<any> {
    return this._http.get<any>(`${environment.api}/metier/categories/listeCategories`);
  }

  ajouterCategories(data: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/metier/categories/ajouterCategories`, data);
  }

  modifierCategories(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${environment.api}/metier/categories/modifierCategories/${id}`, data);
  }
}