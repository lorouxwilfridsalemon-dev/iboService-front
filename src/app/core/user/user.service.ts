// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { map, Observable, ReplaySubject, tap } from 'rxjs';
// import { User } from 'app/core/user/user.types';

// @Injectable({
//     providedIn: 'root'
// })
// export class UserService
// {
//     private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

//     /**
//      * Constructor
//      */
//     constructor(private _httpClient: HttpClient)
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Setter & getter for user
//      *
//      * @param value
//      */
//     set user(value: User)
//     {
//         // Store the value
//         this._user.next(value);
//     }

//     get user$(): Observable<User>
//     {
//         return this._user.asObservable();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Get the current logged in user data
//      */
//     get(): Observable<User>
//     {
//         return this._httpClient.get<User>('api/common/user').pipe(
//             tap((user) => {
//                 this._user.next(user);
//             })
//         );
//     }

//     /**
//      * Update the user
//      *
//      * @param user
//      */
//     update(user: User): Observable<any>
//     {
//         return this._httpClient.patch<User>('api/common/user', {user}).pipe(
//             map((response) => {
//                 this._user.next(response);
//             })
//         );
//     }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

/**
 * ✅ CORRIGÉ — get() appelait 'api/common/user', une URL FACTICE
 * interceptée par le faux backend de démo Fuse, qui renvoyait un mock
 * statique (mock-api/common/user/data.ts) — écrasant à chaque appel les
 * vraies données déjà chargées par AuthService à la connexion. Pointe
 * maintenant vers la vraie route GET /auth/user.
 */
@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set user(value: User)
    {
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Récupère l'utilisateur actuellement connecté — vraie route,
     * protégée par JWT (le token est ajouté automatiquement par
     * l'intercepteur HTTP existant).
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>(`${environment.api}/auth/user`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * ⚠️ Mise à jour du profil — pointe désormais vers la vraie route
     * PUT /metier/profil/informations-personnelles (nom, prénom,
     * contact uniquement). Si vous avez besoin de modifier d'autres
     * champs depuis le dashboard, utilisez plutôt UtilisateurService
     * (metier/utilisateur/:id), qui couvre tous les champs.
     */
    update(user: Partial<User>): Observable<any>
    {
        return this._httpClient.put<any>(`${environment.api}/metier/profil/informations-personnelles`, {
            nom: user.nom,
            prenom: user.prenom,
            contact: user.contact,
        }).pipe(
            map((response) => {
                this._user.next(response?.data ?? response);
                return response;
            })
        );
    }
} 