// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class PlanAbonnementService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'planAbonnement';

//   save(planAbonnement: any): Observable<any> {
//     return this._http.post<any>(`${environment.api}/${this._endpoint}`, planAbonnement);
//   }

//   /**
//    * ✅ CORRIGÉ : l'ID doit être dans l'URL (PUT /planAbonnement/:primaryKey),
//    * pas juste PUT /planAbonnement/ — c'était la cause exacte du 404.
//    */
//   update(planAbonnement: any): Observable<any> {
//     const primaryKey = encodeURI(JSON.stringify({ id: planAbonnement.id }));
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/${primaryKey}`, planAbonnement);
//   }

//   delete(primaryKey: any): Observable<any> {
//     const cle = encodeURI(JSON.stringify(primaryKey));
//     return this._http.delete<any>(`${environment.api}/${this._endpoint}/${cle}`);
//   }

//   findAll(): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}`);
//   }

//   query(queryParameter: any): Observable<any[]> {
//     return this._http.get<any[]>(
//       `${environment.api}/${this._endpoint}/query/${encodeURI(JSON.stringify(queryParameter))}`,
//     );
//   }

//   findOne(primaryKey: any): Observable<any> {
//     return this._http.get<any>(
//       `${environment.api}/${this._endpoint}/${encodeURI(JSON.stringify(primaryKey))}`,
//     );
//   }

//   /** ✅ AJOUT : méthode dédiée appelée par le composant liste. */
//   deletePlanAbonnement(planAbonnement: any): Observable<any> {
//     return this.delete({ id: planAbonnement.id });
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class PlanAbonnementService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'plan-abonnement';

  // POST
  save(plan: any): Observable<any> {
    return this._http.post<any>(
      `${environment.api}/${this._endpoint}`,
      plan,
    );
  }

  ajouterPlanAbonnement(plan: any): Observable<any> {
    return this.save(plan);
  }

  // PUT — ✅ URL simple
  updateWithId(id: number, plan: any): Observable<any> {
    console.log('🔵 PUT /plan-abonnement/' + id);
    return this._http.put<any>(
      `${environment.api}/${this._endpoint}/${id}`,
      plan,
    );
  }

  update(plan: any): Observable<any> {
    return this.updateWithId(plan.id, plan);
  }

  modifierPlanAbonnement(id: number, plan: any): Observable<any> {
    return this.updateWithId(id, plan);
  }

  // DELETE — ✅ URL simple
  supprimerPlanAbonnement(id: number): Observable<any> {
    console.log('🔵 DELETE /plan-abonnement/' + id);
    return this._http.delete<any>(
      `${environment.api}/${this._endpoint}/${id}`,
    );
  }

  delete(id: number): Observable<any> {
    return this.supprimerPlanAbonnement(id);
  }

  // GET
  listerPlanAbonnements(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}`);
  }

  findAll(): Observable<any> {
    return this.listerPlanAbonnements();
  }

  findOne(id: number): Observable<any> {
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/${id}`,
    );
  }

  query(queryParameter: any): Observable<any[]> {
    return this._http.get<any[]>(
      `${environment.api}/${this._endpoint}/query/${encodeURI(JSON.stringify(queryParameter))}`,
    );
  }
} 