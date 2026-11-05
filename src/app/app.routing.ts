import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'accueil'},

    // Redirect signed in user to the '/example' 
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'accueil'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty' 
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    }, 

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'accueil', loadChildren: () => import('app/modules/accueil/accueil.module').then(m => m.AccueilModule)},
            {path: 'dashboard', loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
            {path: 'utilisateur', loadChildren: () => import('app/modules/utilisateur/utilisateur.module').then(m => m.UtilisateurModule)},  
            {path: 'reservation', loadChildren: () => import('app/modules/reservation/reservation.module').then(m => m.ReservationModule)},
            {path: 'abonnement', loadChildren: () => import('app/modules/abonnement/abonnement.module').then(m => m.AbonnementModule)},
            {path: 'annonce', loadChildren: () => import('app/modules/annonce/annonce.module').then(m => m.AnnonceModule)},
            {path: 'parametre', loadChildren: () => import('app/modules/parametre/parametre.module').then(m => m.ParametreModule)},
            {path: 'annonce-caracteristiques', loadChildren: () => import('app/modules/parametre/annonce-caracteristiques/annonce-caracteristiques.module').then(m => m.AnnonceCaracteristiquesModule)},
            {path: 'caracteristique_sous_categories', loadChildren: () => import('app/modules/parametre/caracteristique_sous_categories/caracteristique_sous_categories.module').then(m => m.CaracteristiqueSousCategoriesModule)},
            {path: 'statut', loadChildren: () => import('app/modules/parametre/statut/statut.module').then(m => m.StatutModule)},
            {path: 'categories', loadChildren: () => import('app/modules/parametre/categories/categories.module').then(m => m.CategoriesModule)},  
            {path: 'profil', loadChildren: () => import('app/modules/parametre/profil/profil.module').then(m => m.ProfilModule)},
            {path: 'plan_abonnement', loadChildren: () => import('app/modules/parametre/plan_abonnement/plan_abonnement.module').then(m => m.PlanAbonnementModule)},
            {path: 'sous-categories', loadChildren: () => import('app/modules/parametre/sous-categories/sous-categories.module').then(m => m.SousCategoriesModule)},
            {path: 'caracteristiques', loadChildren: () => import('app/modules/parametre/caracteristiques/caracteristiques.module').then(m => m.CaracteristiquesModule)},

        ]
    }
];
