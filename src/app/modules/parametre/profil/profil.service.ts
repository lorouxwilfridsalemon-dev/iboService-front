import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class ProfilService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'profil';

  save(profil: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpoint}`, profil);
  }

  /**
   * ✅ CORRIGÉ : l'ID doit être dans l'URL (PUT /profil/:primaryKey),
   * pas juste PUT /profil/ — c'était la cause exacte du 404.
   */
  update(profil: any): Observable<any> {
    const primaryKey = encodeURI(JSON.stringify({ id: profil.id }));
    return this._http.put<any>(`${environment.api}/${this._endpoint}/${primaryKey}`, profil);
  }

  delete(primaryKey: any): Observable<any> {
    const cle = encodeURI(JSON.stringify(primaryKey));
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/${cle}`);
  }

  findAll(): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}`);
  }

  query(queryParameter: any): Observable<any[]> {
    return this._http.get<any[]>(
      `${environment.api}/${this._endpoint}/query/${encodeURI(JSON.stringify(queryParameter))}`,
    );
  }

  findOne(primaryKey: any): Observable<any> {
    return this._http.get<any>(
      `${environment.api}/${this._endpoint}/${encodeURI(JSON.stringify(primaryKey))}`,
    );
  }

  /** ✅ AJOUT : méthode dédiée appelée par le composant liste. */
  deleteProfil(profil: any): Observable<any> {
    return this.delete({ id: profil.id });
  }

  // ====================================================================
  // ✅ AJOUT : passe par le métier pour save/update/delete — le CRUD
  // générique échouait avec "Validation object failed" (ParseJsonPipe).
  // ====================================================================

  listeProfils(): Observable<any> {
    return this._http.get<any>(`${environment.api}/metier/profil/listeProfils`);
  }

  ajouterProfil(data: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/metier/profil/ajouterProfil`, data);
  }

  modifierProfil(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${environment.api}/metier/profil/modifierProfil/${id}`, data);
  }

  supprimerProfil(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/metier/profil/supprimerProfil/${id}`);
  }
}