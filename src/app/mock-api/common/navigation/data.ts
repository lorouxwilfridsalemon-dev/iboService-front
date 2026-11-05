/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // ==================== NAVIGATION PRINCIPALE ====================
    {
        id: 'accueil',
        title: 'Accueil',
        subtitle: 'Vue d\'ensemble',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/accueil'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        subtitle: 'Statistiques globales',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/dashboard'
    },
    
    // ==================== GESTION MÉTIER ====================
    {
        id: 'gestion',
        title: 'Gestion',
        type: 'group',
        children: [
            {
                id: 'annonce',
                title: 'Annonces',
                subtitle: 'Gérer les annonces',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/annonce',
                badge: {
                    title: 'Nouveau',
                    classes: 'bg-primary-500 text-white'
                }
            },
            {
                id: 'reservation',
                title: 'Réservations',
                subtitle: 'Suivre les réservations',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/reservation'
            },
            {
                id: 'abonnement',
                title: 'abonnement',
                subtitle: 'Suivre les abonnement',
                type: 'basic',
                icon: 'heroicons_outline:calendar',
                link: '/abonnement'
            },

            {
                id: 'utilisateur',
                title: 'Utilisateurs',
                subtitle: 'Gestion des comptes',
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/utilisateur'
            }
        ]
    },
    
    // ==================== PARAMÈTRES ====================
    {
        id: 'parametre',
        title: 'Paramètres',
        subtitle: 'Configuration',
        type: 'collapsable',
        icon: 'heroicons_outline:cog',
        children: [
            // ----- Sous-section : Annonces -----
            {
                id: 'gestion-annonces',
                title: 'ANNONCES',
                type: 'group',
                children: [
                    {
                        id: 'caracteristiques',
                        title: 'Caractéristiques',
                        subtitle: 'Liste des attributs',
                        type: 'basic',
                        icon: 'heroicons_outline:clipboard-list',
                        link: '/caracteristiques'
                    },
                    {
                        id: 'caracteristique_sous_categories',
                        title: 'Caract. par sous-catégorie',
                        subtitle: 'Associer aux catégories',
                        type: 'basic',
                        icon: 'heroicons_outline:view-list',
                        link: '/caracteristique_sous_categories'
                    }
                ]
            },
            
            // ----- Sous-section : Organisation -----
            {
                id: 'organisation',
                title: 'ORGANISATION',
                type: 'group',
                children: [
                    {
                        id: 'categories',
                        title: 'Catégories',
                        subtitle: 'Classification principale',
                        type: 'basic',
                        icon: 'heroicons_outline:folder',
                        link: '/categories'
                    },
                    {
                        id: 'sous-categories',
                        title: 'Sous-catégories',
                        subtitle: 'Niveaux secondaires',
                        type: 'basic',
                        icon: 'heroicons_outline:folder-open',
                        link: '/sous-categories'
                    },
                     {
                        id: 'plan_abonnement',
                        title: 'Plan abonnement',
                        subtitle: 'Niveaux secondaires',
                        type: 'basic',
                        icon: 'heroicons_outline:shield-check',
                        link: '/plan_abonnement'
                    }
                ]
            },
            
            // ----- Sous-section : Administration -----
            {
                id: 'administration',
                title: 'ADMINISTRATION',
                type: 'group',
                children: [
                    {
                        id: 'profil',
                        title: 'Profils',
                        subtitle: 'Rôles et permissions',
                        type: 'basic',
                        icon: 'heroicons_outline:shield-check',
                        link: '/profil'
                    }
                ]
            }
        ]
    }
];

// ==================== NAVIGATION COMPACTE ====================
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'accueil',
        title: 'Accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/accueil'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/dashboard'
    },
    {
        id: 'annonce',
        title: 'Annonces',
        type: 'basic',
        icon: 'heroicons_outline:megaphone',
        link: '/annonce'
    },
    {
        id: 'reservation',
        title: 'Réservations',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/reservation'
    },
    {
        id: 'utilisateur',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/utilisateur'
    }
];

// ==================== NAVIGATION FUTURISTE ====================
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'accueil',
        title: 'Accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/accueil'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/dashboard'
    },
    {
        id: 'annonce',
        title: 'Annonces',
        type: 'basic',
        icon: 'heroicons_outline:campaign',
        link: '/annonce'
    },
    {
        id: 'reservation',
        title: 'Réservations',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/reservation'
    },
    {
        id: 'utilisateur',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/utilisateur'
    },
    {
        id: 'parametre',
        title: 'Paramètres',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/parametre'
    }
];

// ==================== NAVIGATION HORIZONTALE ====================
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'accueil',
        title: 'Accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/accueil'
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-bar',
        link: '/dashboard'
    },
    {
        id: 'annonce',
        title: 'Annonces',
        type: 'basic',
        icon: 'heroicons_outline:megaphone',
        link: '/annonce'
    },
    {
        id: 'reservation',
        title: 'Réservations',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/reservation'
    },
    {
        id: 'utilisateur',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/utilisateur'
    },
    {
        id: 'parametre',
        title: 'Paramètres',
        type: 'basic',
        icon: 'heroicons_outline:cog',
        link: '/parametre'
    }
]; 







// /* tslint:disable:max-line-length */
// import { FuseNavigationItem } from '@fuse/components/navigation';

// // export const defaultNavigation: FuseNavigationItem[] = [
// //     {
// //         id: 'accueil',
// //         title: 'Accueil',
// //         type: 'basic',
// //         icon: 'mat_outline:home_work',
// //         link: '/accueil'
// //     },
// //      {
// //         id: 'dashboard',
// //         title: 'Dashboard',
// //         type: 'basic',
// //         icon: 'mat_outline:home_work',
// //         link: '/dashboard'
// //     },
// //     {
// //         id: 'annonce',
// //         title: 'Annonce',
// //         type: 'basic',
// //         icon: 'iconsmind:find_user',
// //         link: '/annonce'
// //     },
// //     {
// //         id: 'reservation',
// //         title: 'Reservation',
// //         type: 'basic',
// //         icon: 'iconsmind:folder_search',
// //         link: '/reservation'
// //     }
// //     ,
// //     {
// //         id: 'utilisateur',
// //         title: 'Utilisateur',
// //         type: 'basic',
// //         icon: 'iconsmind:user',
// //         link: '/utilisateur'
// //     }
// //     ,

// //    {
// //     id: 'parametre',
// //     title: 'Paramètres',
// //     type: 'collapsable',
// //     icon: 'heroicons_outline:home',
// //     link: '/parametre',
// //     children: [
// //         {
// //             id: 'gestion-annonces',
// //             title: 'GESTION DES ANNONCES',
// //             type: 'group',
// //             children: [
// //                 // {
// //                 //     id: 'caracteristique_sous_categories',
// //                 //     title: 'Caractéristiques des annonces',
// //                 //     type: 'basic',
// //                 //     // ✅ CORRIGÉ : 'list-bullet' n'existe pas dans la
// //                 //     // version d'Heroicons embarquée ici (nom introduit
// //                 //     // en v2) — remplacé par 'clipboard-list', qui existe
// //                 //     // bien en v1 et garde le même esprit "liste".
// //                 //     icon: 'heroicons_outline:clipboard-list',
// //                 //     link: '/caracteristique_sous_categories'
// //                 // },
// //                 {
// //                     id: 'caracteristiques',
// //                     title: 'Liste des caractéristiques',
// //                     type: 'basic',
// //                     // ✅ CORRIGÉ : 'iconsmind:find_user' — le pack
// //                     // 'iconsmind' n'est pas enregistré dans ce projet.
// //                     icon: 'heroicons_outline:tag',
// //                     link: '/caracteristiques'
// //                 },
// //                 {
// //                     id: 'caracteristique_sous_categories',
// //                     title: 'Caractéristiques par sous-catégorie',
// //                     type: 'basic',
// //                     // ✅ CORRIGÉ : 'iconsmind:find_user' — le pack
// //                     // 'iconsmind' n'est pas enregistré dans ce projet.
// //                     icon: 'heroicons_outline:tag',
// //                     link: '/caracteristique_sous_categories'
// //                 }
// //             ]
// //         },
// //         {
// //             id: 'organisation',
// //             title: 'ORGANISATION',
// //             type: 'group',
// //             children: [
// //                 {
// //                     id: 'categories',
// //                     title: 'Catégories',
// //                     type: 'basic',
// //                     // ✅ CORRIGÉ : 'iconsmind:Folder' → équivalent
// //                     // heroicons_outline, casse correcte (minuscule).
// //                     icon: 'heroicons_outline:folder',
// //                     link: '/categories'
// //                 },
// //                 {
// //                     id: 'sous-categories',
// //                     title: 'Sous-catégories',
// //                     type: 'basic',
// //                     // ✅ CORRIGÉ : 'iconsmind:Folder-Add' n'existe pas en
// //                     // heroicons v1 — 'collection' (plusieurs éléments
// //                     // groupés) illustre bien l'idée de sous-éléments,
// //                     // tout en restant visuellement distinct de Catégories.
// //                     icon: 'heroicons_outline:collection',
// //                     link: '/sous-categories'
// //                 }
// //             ]
// //         },
// //         {
// //             id: 'etats',
// //             title: 'ÉTATS ET RÈGLES',
// //             type: 'group',
// //             children: [
// //                 // {
// //                 //     id: 'statut',
// //                 //     title: 'Statuts',
// //                 //     type: 'basic',
// //                 //     icon: 'heroicons_outline:flag',
// //                 //     link: '/statut'
// //                 // },
// //                 {
// //                     id: 'profil',
// //                     title: 'Profils', 
// //                     type: 'basic',
// //                     // Déjà en heroicons_outline (fonctionnel), mais
// //                     // dupliquait l'icône du parent "Paramètres" — remplacé
// //                     // par une icône plus distincte pour "Profils".
// //                     icon: 'heroicons_outline:annotation',
// //                     link: '/profil'
// //                 }
// //             ]
// //         }
// //     ]
// // } 


// // ];
// export const defaultNavigation: FuseNavigationItem[] = [
//     {
//         id: 'accueil',
//         title: 'Accueil',
//         type: 'basic',
//         icon: 'heroicons_outline:home',
//         link: '/accueil'
//     },
//     {
//         id: 'dashboard',
//         title: 'Dashboard',
//         type: 'basic',
//         icon: 'heroicons_outline:chart-pie',
//         link: '/dashboard'
//     },
//     {
//         id: 'annonce',
//         title: 'Annonce',
//         type: 'basic',
//         icon: 'heroicons_outline:badge-check',
//         link: '/annonce'
//     },
//     {
//         id: 'reservation',
//         title: 'Reservation',
//         type: 'basic',
//         icon: 'heroicons_outline:calendar',
//         link: '/reservation'
//     },
//     {
//         id: 'utilisateur',
//         title: 'Utilisateur',
//         type: 'basic',
//         icon: 'heroicons_outline:user',
//         link: '/utilisateur'
//     },
//     {
//         id: 'parametre',
//         title: 'Paramètres',
//         type: 'collapsable',
//         icon: 'heroicons_outline:cog',
//         link: '/parametre',
//         children: [
//             {
//                 id: 'gestion-annonces',
//                 title: 'GESTION DES ANNONCES',
//                 type: 'group',
//                 children: [
//                     {
//                         id: 'caracteristiques',
//                         title: 'Liste des caractéristiques',
//                         type: 'basic',
//                         icon: 'heroicons_outline:tag',
//                         link: '/caracteristiques'
//                     },
//                     {
//                         id: 'caracteristique_sous_categories',
//                         title: 'Caractéristiques par sous-catégorie',
//                         type: 'basic',
//                         icon: 'heroicons_outline:tag',
//                         link: '/caracteristique_sous_categories'
//                     }
//                 ]
//             },
//             {
//                 id: 'organisation',
//                 title: 'ORGANISATION',
//                 type: 'group',
//                 children: [
//                     {
//                         id: 'categories',
//                         title: 'Catégories',
//                         type: 'basic',
//                         icon: 'heroicons_outline:folder',
//                         link: '/categories'
//                     },
//                     {
//                         id: 'sous-categories',
//                         title: 'Sous-catégories',
//                         type: 'basic',
//                         icon: 'heroicons_outline:collection',
//                         link: '/sous-categories'
//                     }
//                 ]
//             },
//             {
//                 id: 'etats',
//                 title: 'ÉTATS ET RÈGLES',
//                 type: 'group',
//                 children: [
//                     {
//                         id: 'profil',
//                         title: 'Profils',
//                         type: 'basic',
//                         // ✅ MODIFIÉ : icône de badge / identité pour "Profil"
//                         icon: 'heroicons_outline:badge-check',
//                         link: '/profil'
//                     }
//                 ]
//             }
//         ]
//     }
// ]; 
// export const compactNavigation: FuseNavigationItem[] = [
//     {
//         id: 'example',
//         title: 'Example',
//         type: 'basic',
//         icon: 'heroicons_outline:chart-pie',
//         link: '/example'
//     }
// ];
// export const futuristicNavigation: FuseNavigationItem[] = [
//     {
//         id: 'example',
//         title: 'Example',
//         type: 'basic',
//         icon: 'heroicons_outline:chart-pie',
//         link: '/example'
//     }
// ];
// export const horizontalNavigation: FuseNavigationItem[] = [
//     {
//         id: 'example',
//         title: 'Example',
//         type: 'basic',
//         icon: 'heroicons_outline:chart-pie',
//         link: '/example'
//     }
// ];
