import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;

    // ✅ AJOUT : URL complète de la photo — le backend ne renvoie qu'un
    // nom de fichier ('photo'), pas une URL, même convention que le mobile.
    urlPhoto: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService
    )
    {
    }

    ngOnInit(): void
    {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // ✅ Reconstruit l'URL de la photo à chaque changement
                // d'utilisateur (plus besoin de 'as any' — le typage
                // User a maintenant le vrai champ 'photo').
                this.urlPhoto = user?.photo
                    ? `${environment.api}/files/profils/${user.photo}`
                    : '';

                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // ✅ RETIRÉ : updateUserStatus() supprimée — reposait sur un champ
    // 'status' qui n'existe pas sur UtilisateurEntity (c'était un champ
    // fictif du template Fuse d'origine, jamais utilisé nulle part
    // ailleurs dans ce projet).

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }
}


// import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { Router } from '@angular/router';
// import { BooleanInput } from '@angular/cdk/coercion';
// import { Subject, takeUntil } from 'rxjs';
// import { User } from 'app/core/user/user.types';
// import { UserService } from 'app/core/user/user.service';
// import { environment } from 'environments/environment';

// @Component({
//     selector       : 'user',
//     templateUrl    : './user.component.html',
//     encapsulation  : ViewEncapsulation.None,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     exportAs       : 'user'
// })
// export class UserComponent implements OnInit, OnDestroy 
// {
//     /* eslint-disable @typescript-eslint/naming-convention */
//     static ngAcceptInputType_showAvatar: BooleanInput;
//     /* eslint-enable @typescript-eslint/naming-convention */

//     @Input() showAvatar: boolean = true;
//     user: User;

//     // ✅ AJOUT : URL complète de la photo — le backend ne renvoie qu'un
//     // nom de fichier ('photo'), pas une URL, même convention que le mobile.
//     urlPhoto: string = '';

//     private _unsubscribeAll: Subject<any> = new Subject<any>();

//     constructor(
//         private _changeDetectorRef: ChangeDetectorRef,
//         private _router: Router,
//         private _userService: UserService
//     )
//     {
//     }

//     ngOnInit(): void
//     {
//         this._userService.user$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((user: User) => {
//                 this.user = user;

//                 // ✅ Reconstruit l'URL de la photo à chaque changement
//                 // d'utilisateur (plus besoin de 'as any' — le typage
//                 // User a maintenant le vrai champ 'photo').
//                 this.urlPhoto = user?.photo
//                     ? `${environment.api}/files/profils/${user.photo}`
//                     : '';

//                 this._changeDetectorRef.markForCheck();
//             });
//     }

//     ngOnDestroy(): void
//     {
//         this._unsubscribeAll.next(null);
//         this._unsubscribeAll.complete();
//     }

//     // ✅ RETIRÉ : updateUserStatus() supprimée — reposait sur un champ
//     // 'status' qui n'existe pas sur UtilisateurEntity (c'était un champ
//     // fictif du template Fuse d'origine, jamais utilisé nulle part
//     // ailleurs dans ce projet).

//     /**
//      * Sign out
//      */
//     signOut(): void
//     {
//         this._router.navigate(['/sign-out']);
//     }
// }