import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class StatutService {

    constructor(private _http: HttpClient) {}
	
 
	 
    save(statut: StatutService): Observable<any> {
        return this._http.post<any>(`${environment.api}/statut/`, statut);
    }


	// Modifie un nouvel enregistrement de statut 
    update(statut: StatutService): Observable<any> {
        return this._http.put<any>(`${environment.api}/statut/`, statut);
    }
	
    // Supprime un enregistrement de statut
    delete(primaryKey: any): Observable<any> {
        return this._http.delete<any>(`${environment.api}/statut/${primaryKey}`);
    }
	
    // Trouve tous les enregistrements de statut
    findAll(): Observable<any> {
        return this._http.get<any>(`${environment.api}/statut/`);
    }
	
	// Trouve tous les enregistrements de statut selon le filtre
    query(queryParameter: any): Observable<any[]> {
        return this._http.get<any[]>(`${environment.api}/statut/query/${encodeURI(JSON.stringify(queryParameter))}`);
    }
	
    // Trouve un seul enregistrements de statut
    findOne(primaryKey: any): Observable<any> {
        return this._http.get<any>(`${environment.api}/statut/${encodeURI(JSON.stringify(primaryKey))}`);
    }


    //  geler un projet niveauImportance
    deleteStatut(statut: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/metier/projet/deleteStatut`, statut);
}




}

