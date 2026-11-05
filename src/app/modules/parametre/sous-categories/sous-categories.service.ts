import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class SousCategoriesService {

    constructor(private _http: HttpClient) { }


    private readonly _endpoint = 'sousCategories';

    /** Ajoute un nouvel enregistrement de sous-catégorie */
    save(sousCategories: any): Observable<any> {
        return this._http.post<any>(`${environment.api}/${this._endpoint}`, sousCategories);
    }


    update(sousCategories: any): Observable<any> {
        const primaryKey = encodeURI(JSON.stringify({ id: sousCategories.id }));
        return this._http.put<any>(`${environment.api}/${this._endpoint}/${primaryKey}`, sousCategories);
    }


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

    deleteSousCategories(sousCategories: any): Observable<any> {
        return this.delete({ id: sousCategories.id });
    }

    //   les services metier

    getListeSousCategories(): Observable<any> {
        return this._http.get<any>(`${environment.api}/metier/sous-categories/getListeSousCategories`);
    }

    ajouterSousCategories(query): Observable<any> {
        console.log('Appel API avec query :', query);
        return this._http.post<any>(`${environment.api}/metier/sous-categories/ajouterSousCategories`, query);
    }

    /** ✅ AJOUT : modification via le métier, même principe que l'ajout —
     * évite le DTO générique qui échouait avec un message trop vague
     * pour être diagnostiqué précisément.
     */
    modifierSousCategories(id: number, query: any): Observable<any> {
        return this._http.put<any>(
            `${environment.api}/metier/sous-categories/modifierSousCategories/${id}`,
            query,
        );
    }

    /** ✅ AJOUT : suppression via le métier (suppression douce, geler=1)
     * — la route générique fait une suppression physique, qui échoue
     * dès qu'une annonce référence encore cette sous-catégorie.
     */
    supprimerSousCategories(id: number): Observable<any> {
        return this._http.delete<any>(
            `${environment.api}/metier/sous-categories/supprimerSousCategories/${id}`,
        );
    }

} 