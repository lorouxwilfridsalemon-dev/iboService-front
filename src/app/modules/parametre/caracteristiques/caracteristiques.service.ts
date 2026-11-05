// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from 'environments/environment';

// @Injectable()
// export class CaracteristiquesService {

//     constructor(private _http: HttpClient) {}
	
//     // Ajoute un nouvel enregistrement de personne 
//     save(natureProjet: CaracteristiquesService): Observable<any> {
//         return this._http.post<any>(`${environment.api}/caracteristique/`, natureProjet);
//     } 
	
// 	// Modifie un nouvel enregistrement de caracteristiques 
//     update(natureProjet: CaracteristiquesService): Observable<any> {
//         return this._http.put<any>(`${environment.api}/caracteristique/`, natureProjet);
//     }
	
//     // Supprime un enregistrement de caracteristiques
//     delete(primaryKey: any): Observable<any> {
//         return this._http.delete<any>(`${environment.api}/caracteristique/${primaryKey}`);
//     }
	
//     // Trouve tous les enregistrements de caracteristiques
//     findAll(): Observable<any> {
//         return this._http.get<any>(`${environment.api}/caracteristique/`);
//     }
	
// 	// Trouve tous les enregistrements de caracteristiques selon le filtre
//     query(queryParameter: any): Observable<any[]> {
//         return this._http.get<any[]>(`${environment.api}/caracteristique/query/${encodeURI(JSON.stringify(queryParameter))}`);
//     }
	
//     // Trouve un seul enregistrements de caracteristiques
//     findOne(primaryKey: any): Observable<any> {
//         return this._http.get<any>(`${environment.api}/caracteristique/${encodeURI(JSON.stringify(primaryKey))}`);
//     }


//     deleteCaracteristiques(caracteristiques:any): Observable<any> {
//         return this._http.post<any>(`${environment.api}/metier/projet/deleteCaracteristique`, caracteristiques);
//     }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class CaracteristiquesService {

    constructor(private _http: HttpClient) {}
	
    // Ajoute un nouvel enregistrement (POST)
    save(caracteristique: any): Observable<any> {
        return this._http.post<any>(`${environment.api}/caracteristique/`, caracteristique);
    } 
	
    // ✅ CORRIGÉ : Modifie un enregistrement (PUT avec ID dans l'URL)
    update(caracteristique: any): Observable<any> {
        // IMPORTANT : l'ID doit être dans l'URL
        return this._http.put<any>(`${environment.api}/caracteristique/${caracteristique.id}`, caracteristique);
    }
	
    // Supprime un enregistrement (DELETE avec ID dans l'URL)
    delete(primaryKey: any): Observable<any> {
        return this._http.delete<any>(`${environment.api}/caracteristique/${primaryKey}`);
    }
	
    // Trouve tous les enregistrements
    findAll(): Observable<any> {
        return this._http.get<any>(`${environment.api}/caracteristique/`);
    }
	
    // Trouve tous les enregistrements selon le filtre
    query(queryParameter: any): Observable<any[]> {
        return this._http.get<any[]>(`${environment.api}/caracteristique/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }
	
    // Trouve un seul enregistrement
    findOne(primaryKey: any): Observable<any> {
        return this._http.get<any>(`${environment.api}/caracteristique/${encodeURI(JSON.stringify(primaryKey))}`);
    }

    // ❌ SUPPRIME cette méthode (elle est fausse et inutile)
    // deleteCaracteristiques(caracteristiques:any): Observable<any> {
    //     return this._http.post<any>(`${environment.api}/metier/projet/deleteCaracteristique`, caracteristiques);
    // }

    /** ✅ AJOUT : suppression via le métier (suppression douce, geler=1)
   * — la route générique renvoyait une erreur 500.
   */
  supprimerCaracteristiques(id: number): Observable<any> {
    return this._http.delete<any>(
      `${environment.api}/metier/caracteristiques/supprimerCaracteristiques/${id}`,
    );
  }
  
} 
