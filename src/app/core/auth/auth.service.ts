// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
// import { AuthUtils } from 'app/core/auth/auth.utils';
// import { UserService } from 'app/core/user/user.service';

// @Injectable()
// export class AuthService
// {
//     private _authenticated: boolean = false;

//     /**
//      * Constructor
//      */
//     constructor(
//         private _httpClient: HttpClient,
//         private _userService: UserService
//     )
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Setter & getter for access token
//      */
//     set accessToken(token: string)
//     {
//         localStorage.setItem('accessToken', token);
//     }

//     get accessToken(): string
//     {
//         return localStorage.getItem('accessToken') ?? '';
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Forgot password
//      *
//      * @param email
//      */
//     forgotPassword(email: string): Observable<any>
//     {
//         return this._httpClient.post('api/auth/forgot-password', email);
//     }

//     /**
//      * Reset password
//      *
//      * @param password
//      */
//     resetPassword(password: string): Observable<any>
//     {
//         return this._httpClient.post('api/auth/reset-password', password);
//     }

//     /**
//      * Sign in
//      *
//      * @param credentials
//      */
//     signIn(credentials: { email: string; password: string }): Observable<any>
//     {
//         // Throw error, if the user is already logged in
//         if ( this._authenticated )
//         {
//             return throwError('User is already logged in.');
//         }

//         return this._httpClient.post('api/auth/sign-in', credentials).pipe(
//             switchMap((response: any) => {

//                 // Store the access token in the local storage
//                 this.accessToken = response.accessToken;

//                 // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // Store the user on the user service
//                 this._userService.user = response.user;

//                 // Return a new observable with the response
//                 return of(response);
//             })
//         );
//     }

//     /**
//      * Sign in using the access token
//      */
//     signInUsingToken(): Observable<any>
//     {
//         // Renew token
//         return this._httpClient.post('api/auth/refresh-access-token', {
//             accessToken: this.accessToken
//         }).pipe(
//             catchError(() =>

//                 // Return false
//                 of(false)
//             ),
//             switchMap((response: any) => {

//                 // Store the access token in the local storage
//                 this.accessToken = response.accessToken;

//                 // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // Store the user on the user service
//                 this._userService.user = response.user;

//                 // Return true
//                 return of(true);
//             })
//         );
//     }

//     /**
//      * Sign out
//      */
//     signOut(): Observable<any>
//     {
//         // Remove the access token from the local storage
//         localStorage.removeItem('accessToken');

//         // Set the authenticated flag to false
//         this._authenticated = false;

//         // Return the observable
//         return of(true);
//     }

//     /**
//      * Sign up
//      *
//      * @param user
//      */
//     signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
//     {
//         return this._httpClient.post('api/auth/sign-up', user);
//     }

//     /**
//      * Unlock session
//      *
//      * @param credentials
//      */
//     unlockSession(credentials: { email: string; password: string }): Observable<any>
//     {
//         return this._httpClient.post('api/auth/unlock-session', credentials);
//     }

//     /**
//      * Check the authentication status
//      */
//     check(): Observable<boolean>
//     {
//         // Check if the user is logged in
//         if ( this._authenticated )
//         {
//             return of(true);
//         }

//         // Check the access token availability
//         if ( !this.accessToken )
//         {
//             return of(false);
//         }

//         // Check the access token expire date
//         if ( AuthUtils.isTokenExpired(this.accessToken) )
//         {
//             return of(false);
//         }

//         // If the access token exists and it didn't expire, sign in using it
//         return this.signInUsingToken();
//     }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';

/**
 * ✅ RECONSTRUIT — l'ancienne version postait vers 'api/auth/sign-in',
 * une URL FICTIVE gérée par le faux backend de démo Fuse (jamais votre
 * vrai serveur NestJS). Cette version se branche sur les vraies routes
 * (POST /auth/login, GET /auth/user, GET /auth/logout), avec la forme
 * de réponse réelle : { etat, message, data: { user, access_token... } }
 * — pas { accessToken, user } comme le mock le supposait.
 * ⚠️ La connexion se fait par TÉLÉPHONE (contact), pas par email.
 */
@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Mot de passe oublié
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post(`${environment.api}/auth/forgotPassword`, { email });
    }

    /**
     * Réinitialisation du mot de passe.
     * ✅ CORRIGÉ : signature restaurée à 1 seul argument (password) —
     * d'autres pages du template (reset-password.component.ts) appellent
     * encore cette méthode ainsi. On envoie passwordConfirm = password
     * en interne (le formulaire Angular doit déjà garantir que les deux
     * champs correspondent avant d'appeler cette méthode).
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post(`${environment.api}/auth/changePassword`, {
            password,
            passwordConfirm: password,
        });
    }

    /**
     * ✅ Connexion — par téléphone (contact), pas par email.
     */
    signIn(credentials: { contact: string; password: string }): Observable<any>
    {
        if ( this._authenticated )
        {
            return throwError(() => new Error('User is already logged in.'));
        }

        return this._httpClient.post(`${environment.api}/auth/login`, credentials).pipe(
            switchMap((response: any) => {

                // ✅ Le backend renvoie 'warning' (pas une erreur HTTP) en
                // cas d'identifiants incorrects — il faut le traiter comme
                // un échec explicitement.
                if (response?.etat !== 'succes') {
                    return throwError(() => new Error(response?.message || 'Connexion échouée'));
                }

                this.accessToken = response.data.access_token;
                this._authenticated = true;
                this._userService.user = response.data.user;

                return of(response);
            })
        );
    }

    /**
     * ✅ Vérifie le token actuel en récupérant le profil (GET /auth/user).
     * Ne génère PAS de nouveau token — le vôtre n'a pas de route de
     * rafraîchissement dédiée, contrairement au mock d'origine.
     */
    signInUsingToken(): Observable<any>
    {
        return this._httpClient.get(`${environment.api}/auth/user`).pipe(
            catchError(() => of(false)),
            switchMap((response: any) => {

                if (!response || !response.id) {
                    return of(false);
                }

                this._authenticated = true;
                this._userService.user = response;

                return of(true);
            })
        );
    }

    /**
     * Déconnexion
     */
    signOut(): Observable<any>
    {
        localStorage.removeItem('accessToken');
        this._authenticated = false;
        return of(true);
    }

    /**
     * ✅ RESTAURÉ pour compatibilité avec sign-up.component.ts.
     * ⚠️ Le backend réel attend { nomComplet, contact, email?, password,
     * typeCompte } (RegisterDto), pas { name, email, password, company }
     * comme le formulaire Fuse d'origine — si vous utilisez vraiment
     * cette page d'inscription, il faudra adapter le formulaire pour
     * envoyer les bons champs. Pour l'instant, ceci compile et transmet
     * simplement ce qui est fourni.
     */
    signUp(user: any): Observable<any>
    {
        return this._httpClient.post(`${environment.api}/auth/register`, user);
    }

    /**
     * ✅ RESTAURÉ pour compatibilité avec unlock-session.component.ts.
     * Réutilise la route de connexion réelle.
     * ⚠️ Le backend attend 'contact' (téléphone), pas 'email' — si cette
     * page est vraiment utilisée, adaptez son formulaire.
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post(`${environment.api}/auth/login`, credentials);
    }

    /**
     * Vérifie l'état d'authentification
     */
    check(): Observable<boolean>
    {
        if ( this._authenticated )
        {
            return of(true);
        }

        if ( !this.accessToken )
        {
            return of(false);
        }

        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        return this.signInUsingToken();
    }
} 