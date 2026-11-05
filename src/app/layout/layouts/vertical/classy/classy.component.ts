// import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';
// import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
// import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
// import { Navigation } from 'app/core/navigation/navigation.types';
// import { NavigationService } from 'app/core/navigation/navigation.service';
// import { User } from 'app/core/user/user.types';
// import { UserService } from 'app/core/user/user.service';

// @Component({
//     selector     : 'classy-layout',
//     templateUrl  : './classy.component.html',
//     encapsulation: ViewEncapsulation.None
// })
// export class ClassyLayoutComponent implements OnInit, OnDestroy
// {
//     isScreenSmall: boolean;
//     navigation: Navigation;
//     user: User;
//     private _unsubscribeAll: Subject<any> = new Subject<any>();

//     /**
//      * Constructor
//      */
//     constructor(
//         private _activatedRoute: ActivatedRoute,
//         private _router: Router,
//         private _navigationService: NavigationService,
//         private _userService: UserService,
//         private _fuseMediaWatcherService: FuseMediaWatcherService,
//         private _fuseNavigationService: FuseNavigationService
//     )
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Getter for current year
//      */
//     get currentYear(): number
//     {
//         return new Date().getFullYear();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Lifecycle hooks
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * On init
//      */
//     ngOnInit(): void
//     {
//         // Subscribe to navigation data
//         this._navigationService.navigation$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((navigation: Navigation) => {
//                 this.navigation = navigation;
//             });

//         // Subscribe to the user service
//         this._userService.user$
//             .pipe((takeUntil(this._unsubscribeAll)))
//             .subscribe((user: User) => {
//                 this.user = user;
//             });

//         // Subscribe to media changes
//         this._fuseMediaWatcherService.onMediaChange$
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe(({matchingAliases}) => {

//                 // Check if the screen is small
//                 this.isScreenSmall = !matchingAliases.includes('md');
//             });
//     }

//     /**
//      * On destroy
//      */
//     ngOnDestroy(): void
//     {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next(null);
//         this._unsubscribeAll.complete();
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Toggle navigation
//      *
//      * @param name
//      */
//     toggleNavigation(name: string): void
//     {
//         // Get the navigation
//         const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

//         if ( navigation )
//         {
//             // Toggle the opened status
//             navigation.toggle();
//         }
//     }
// }


import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
// ✅ AJOUT : nécessaire pour construire l'URL complète de la photo.
import { environment } from 'environments/environment';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    /**
     * ✅ AJOUT : URL complète de la photo — le backend ne renvoie qu'un
     * nom de fichier ('photo'), pas une URL, même convention que
     * partout ailleurs dans le projet.
     */
    get urlPhotoUtilisateur(): string
    {
        return this.user?.photo
            ? `${environment.api}/files/profils/${this.user.photo}`
            : '';
    }

    /**
     * ✅ AJOUT : nom complet, puisque 'name' n'existe plus sur User
     * (remplacé par 'nom'/'prenom' séparés, correspondant aux vraies
     * données du backend).
     */
    get nomCompletUtilisateur(): string
    {
        if (!this.user) return '';
        return `${this.user.prenom ?? ''} ${this.user.nom ?? ''}`.trim();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) => {
                this.user = user;
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    toggleNavigation(name: string): void
    {
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            navigation.toggle();
        }
    }
}