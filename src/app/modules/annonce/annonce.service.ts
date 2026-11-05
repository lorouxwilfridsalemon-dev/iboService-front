

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AnnonceService {

//   constructor(private _http: HttpClient) {}

//   private readonly _endpoint = 'metier/annonces';
//   private readonly _endpointGenerique = 'annonce';

//   /**
//    * ✅ CORRIGÉ : Liste toutes les annonces avec filtres optionnels par périodicité
//    */
//   getListeAnnonceAll(params?: any): Observable<any> {
//     let httpParams = new HttpParams();
    
//     if (params) {
//       Object.keys(params).forEach(key => {
//         if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
//           httpParams = httpParams.set(key, params[key].toString());
//         }
//       });
//     }

//     return this._http.get<any>(`${environment.api}/${this._endpoint}`, { params: httpParams });
//   }

//   /** Détail d'une annonce (métier, formaté) */
//   findById(id: number): Observable<any> {
//     return this._http.get<any>(`${environment.api}/${this._endpoint}/${id}`);
//   }

//   /** ✅ AJOUT : modifie les champs principaux d'une annonce */
//   modifier(id: number, data: any): Observable<any> {
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/${id}`, data);
//   }

//   /** Valide une annonce (statut → Actives) */
//   valider(id: number): Observable<any> {
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/valider/${id}`, {});
//   }

//   /** Refuse une annonce (statut → Réfusées) */
//   refuser(id: number): Observable<any> {
//     return this._http.put<any>(`${environment.api}/${this._endpoint}/refuser/${id}`, {});
//   }

//   /** Supprime (suppression douce) une annonce */
//   supprimer(id: number): Observable<any> {
//     return this._http.delete<any>(`${environment.api}/${this._endpoint}/${id}`);
//   }

//   // ====================================================================
//   // MÉTHODES GÉNÉRIQUES (restaurées pour compatibilité)
//   // ====================================================================

//   save(annonce: any): Observable<any> {
//     return this._http.post<any>(`${environment.api}/${this._endpointGenerique}`, annonce);
//   }

//   update(annonce: any): Observable<any> {
//     const primaryKey = encodeURI(JSON.stringify({ id: annonce.id }));
//     return this._http.put<any>(`${environment.api}/${this._endpointGenerique}/${primaryKey}`, annonce);
//   }

//   delete(primaryKey: any): Observable<any> {
//     const cle = encodeURI(JSON.stringify(primaryKey));
//     return this._http.delete<any>(`${environment.api}/${this._endpointGenerique}/${cle}`);
//   }

//   query(queryParameter: any): Observable<any[]> {
//     return this._http.get<any[]>(
//       `${environment.api}/${this._endpointGenerique}/query/${encodeURI(JSON.stringify(queryParameter))}`,
//     );
//   }

//   findOne(primaryKey: any): Observable<any> {
//     const cle = encodeURI(JSON.stringify(primaryKey));
//     return this._http.get<any>(`${environment.api}/${this._endpointGenerique}/${cle}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AnnonceService {

  constructor(private _http: HttpClient) {}

  private readonly _endpoint = 'metier/annonces';
  private readonly _endpointGenerique = 'annonce';

  /** Liste toutes les annonces avec filtres optionnels */
  getListeAnnonceAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this._http.get<any>(`${environment.api}/${this._endpoint}`, { params: httpParams });
  }

  /** Détail d'une annonce */
  findById(id: number): Observable<any> {
    return this._http.get<any>(`${environment.api}/${this._endpoint}/${id}`);
  }

  // =========================================================
  // ✅ PUBLIER — création avec upload de fichiers
  // =========================================================
  /**
   * Publication d'une annonce depuis le web.
   * Utilise FormData pour envoyer images/vidéos/CV/pièce.
   */
  publier(data: {
    champs: any;
    images?: File[];
    videos?: File[];
    cv?: File | null;
    piece?: File | null;
  }): Observable<any> {
    const formData = new FormData();

    // ✅ 1. Ajouter tous les champs texte
    Object.keys(data.champs).forEach(key => {
      const value = data.champs[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    // ✅ 2. Ajouter les images
    if (data.images && data.images.length > 0) {
      data.images.forEach((file, i) => {
        formData.append('images', file, file.name);
      });
    }

    // ✅ 3. Ajouter les vidéos
    if (data.videos && data.videos.length > 0) {
      data.videos.forEach((file, i) => {
        formData.append('videos', file, file.name);
      });
    }

    // ✅ 4. Ajouter le CV (optionnel)
    if (data.cv) {
      formData.append('cv', data.cv, data.cv.name);
    }

    // ✅ 5. Ajouter la pièce d'identité (optionnelle)
    if (data.piece) {
      formData.append('piece', data.piece, data.piece.name);
    }

    // ⚠️ Ne PAS définir Content-Type manuellement :
    // le navigateur le fait automatiquement avec le boundary pour FormData
    return this._http.post<any>(
      `${environment.api}/${this._endpoint}`,
      formData,
    );
  }

  /** Modifier une annonce */
  modifier(id: number, data: any): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/${id}`, data);
  }

  /** Valider / Refuser */
  valider(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/valider/${id}`, {});
  }

  refuser(id: number): Observable<any> {
    return this._http.put<any>(`${environment.api}/${this._endpoint}/refuser/${id}`, {});
  }

  supprimer(id: number): Observable<any> {
    return this._http.delete<any>(`${environment.api}/${this._endpoint}/${id}`);
  }

  // =========================================================
  // MÉTHODES GÉNÉRIQUES (compatibilité)
  // =========================================================
  save(annonce: any): Observable<any> {
    return this._http.post<any>(`${environment.api}/${this._endpointGenerique}`, annonce);
  }

  update(annonce: any): Observable<any> {
    const primaryKey = encodeURI(JSON.stringify({ id: annonce.id }));
    return this._http.put<any>(`${environment.api}/${this._endpointGenerique}/${primaryKey}`, annonce);
  }

  delete(primaryKey: any): Observable<any> {
    const cle = encodeURI(JSON.stringify(primaryKey));
    return this._http.delete<any>(`${environment.api}/${this._endpointGenerique}/${cle}`);
  }

  query(queryParameter: any): Observable<any[]> {
    return this._http.get<any[]>(
      `${environment.api}/${this._endpointGenerique}/query/${encodeURI(JSON.stringify(queryParameter))}`,
    );
  }

  findOne(primaryKey: any): Observable<any> {
    const cle = encodeURI(JSON.stringify(primaryKey));
    return this._http.get<any>(`${environment.api}/${this._endpointGenerique}/${cle}`);
  }
}