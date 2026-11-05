import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import { TypeProjetModule } from './type-projet/type-projet.module';
// import { NiveauImportanceModule } from './niveau-importance/niveau-importance.module';
import { StatutModule } from './statut/statut.module';
import { SousCategoriesModule } from './sous-categories/sous-categories.module';
import { AnnonceCaracteristiquesModule } from './annonce-caracteristiques/annonce-caracteristiques.module';
import { CaracteristiquesModule } from './caracteristiques/caracteristiques.module';
import { CategoriesModule } from './categories/categories.module';
import { ProfilModule } from './profil/profil.module';



@NgModule({
    declarations: [],
    imports     : [
        // RouterModule.forChild(parametreRoutes),
        SousCategoriesModule,
        StatutModule,
        AnnonceCaracteristiquesModule,
        CaracteristiquesModule,
        CategoriesModule,
        ProfilModule
    ]
})
export class ParametreModule { }
