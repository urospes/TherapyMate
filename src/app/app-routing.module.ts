import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProfilComponent } from './edit-profil/edit-profil.component';
import { KlijentViewComponent } from './klijent-view/klijent-view.component';
import { PrijavljivanjeComponent } from './prijavljivanje/prijavljivanje.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { TerapeutListComponent } from './terapeut-list/terapeut-list.component';
import { TerapeutPageComponent } from './terapeut-page/terapeut-page.component';
import { TerapeutViewComponent } from './terapeut-view/terapeut-view.component';
import { TerapijaEditComponent } from './terapija-edit/terapija-edit.component';
import { TerapijaListComponent } from './terapija-list/terapija-list.component';
import { TestEditComponent } from './test-edit/test-edit.component';
import { TestListComponent } from './test-list/test-list.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KlijentListComponent } from './klijent-list/klijent-list.component';
import { TerminListComponent } from './termin-list/termin-list.component';
import { KorisnikProfilComponent } from './korisnik-profil/korisnik-profil.component';
import { TerminEditComponent } from './termin-edit/termin-edit.component';
import { TerapeutCardListComponent } from './terapeut-card-list/terapeut-card-list.component';
import { TerminListSimpleComponent } from './termin-list-simple/termin-list-simple.component';
import { TerapijaCardListComponent } from './terapija-card-list/terapija-card-list.component';
import { TipTerapijeCardListComponent } from './tip-terapije-card-list/tip-terapije-card-list.component';
import { TerapeutProfilComponent } from './terapeut-profil/terapeut-profil.component';
import { ZakazivanjePageComponent } from './zakazivanje-page/zakazivanje-page.component';
import { Role } from './shared/role.model';
import { AuthGuard } from './app-routing.gard';
import { AdminProfilComponent } from './admin-profil/admin-profil.component';
import { SavetovalisteInfoComponent } from './savetovaliste-info/savetovaliste-info.component';
import { AdminKlijentListComponent } from './admin-klijent-list/admin-klijent-list.component';
import { RecenziranjeComponent } from './recenziranje/recenziranje.component';
import { AdminRecenzijaListComponent } from './admin-recenzija-list/admin-recenzija-list.component';
import { AdminEditTipterapijaComponent } from './admin-edit-tipterapija/admin-edit-tipterapija.component';
import { AdminTerapeutListComponent } from './admin-terapeut-list/admin-terapeut-list.component';
import { AdminTipterapijeListComponent } from './admin-tipterapije-list/admin-tipterapije-list.component';
import { KlijentTestListComponent } from './klijent-test-list/klijent-test-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'registracija', component: RegistracijaComponent, children: [] },
  { path: 'prijavljivanje', component: PrijavljivanjeComponent, children: [] },
  { path: 'home', component: HomePageComponent },
  { path: 'terapeuti', component: TerapeutListComponent },
  { path: 'terapeuti/:id', component: TerapeutPageComponent },
  { path: 'terapije', component: TipTerapijeCardListComponent },
  {
    path: 'terapeut',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Terapeut],
    },
    component: TerapeutViewComponent,
    children: [
      { path: 'testovi', component: TestListComponent },
      { path: 'testovi/new', component: TestEditComponent },
      { path: ':id/testovi/new', component: TestEditComponent },
      { path: 'terapije', component: TerapijaListComponent },
      { path: 'terapije/:id/edit', component: TerapijaEditComponent },
      { path: 'terapije/new', component: TerapijaEditComponent },
      { path: 'klijenti', component: KlijentListComponent },
      { path: 'klijenti/:id/testovi', component: TestListComponent },
      { path: 'klijenti/:idK/testovi/new', component: TestListComponent },
      { path: 'termini', component: TerminListComponent },
      { path: 'termini/new', component: TerminEditComponent },
      { path: 'termini/zakazani', component: TerminListSimpleComponent },
      { path: 'termini/slobodni', component: TerminListSimpleComponent },
      { path: 'termini/prethodni', component: TerminListSimpleComponent },
      { path: 'licniprofil', component: TerapeutProfilComponent },
      { path: 'izmeniprofil', component: EditProfilComponent },
    ],
  },
  {
    path: 'admin',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminProfilComponent,
  },
  {
    path: 'admin/savetovaliste',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: SavetovalisteInfoComponent,
  },
  {
    path: 'admin/terapeuti',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminTerapeutListComponent,
  },
  {
    path: 'admin/klijenti',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminKlijentListComponent,
  },
  {
    path: 'admin/terapije',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminTipterapijeListComponent,
  },
  {
    path: 'admin/terapije/new',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminEditTipterapijaComponent,
  },
  {
    path: 'admin/:id/terapije',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminEditTipterapijaComponent,
  },
  {
    path: 'admin/recenzije',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin],
    },
    component: AdminRecenzijaListComponent,
  },

  {
    path: 'klijent/terapeuti',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: TerapeutListComponent,
  },
  {
    path: 'klijent/terapeuti/:id',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: TerapeutPageComponent,
  },
  {
    path: 'klijent/terapije',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: TipTerapijeCardListComponent,
  },
  {
    path: 'klijent/testovi',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: KlijentTestListComponent,
  },
  {
    path: 'klijent/izmeniprofil',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: EditProfilComponent,
  },
  {
    path: 'klijent/upravljanjeTerminima',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: ZakazivanjePageComponent,
  },

  {
    path: ':id/profil',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: KorisnikProfilComponent,
    children: [{ path: 'edit', component: EditProfilComponent }],
  },
  {
    path: ':id/profil/terapeuti',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: TerapeutCardListComponent,
  },
  {
    path: ':id/profil/terapije',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Klijent],
    },
    component: TerapijaCardListComponent,
  },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
