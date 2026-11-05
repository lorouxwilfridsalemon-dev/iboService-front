import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class AnnonceCaracteristiquesService {
    constructor(private _http: HttpClient) {}

    // ✅ CRÉATION
    save(data: any): Observable<any> {
        return this._http.post<any>(`${environment.api}/annonce-caracteristique/`, data);
    }

    // ✅ MODIFICATION (avec ID dans l'URL)
    update(data: any): Observable<any> {
        return this._http.put<any>(`${environment.api}/annonce-caracteristique/${data.id}`, data);
    }

    // ✅ SUPPRESSION (DELETE)
    delete(primaryKey: any): Observable<any> {
        return this._http.delete<any>(`${environment.api}/annonce-caracteristique/${primaryKey}`);
    }

    // ✅ RECHERCHE
    findAll(): Observable<any> {
        return this._http.get<any>(`${environment.api}/annonce-caracteristique/`);
    }

    // ✅ RECHERCHE AVEC FILTRE
    query(queryParameter: any): Observable<any[]> {
        return this._http.get<any[]>(
            `${environment.api}/annonce-caracteristique/query/${encodeURI(JSON.stringify(queryParameter))}`
        );
    }

    // ✅ RECHERCHE UNIQUE
    findOne(primaryKey: any): Observable<any> {
        return this._http.get<any>(`${environment.api}/annonce-caracteristique/${encodeURI(JSON.stringify(primaryKey))}`);
    }
} 