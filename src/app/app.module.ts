import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TerapeutItemComponent } from './terapeut-item/terapeut-item.component';
import { TerapeutListComponent } from './terapeut-list/terapeut-list.component';
import { MatCardModule } from '@angular/material/card';
import { TerapijaItemComponent } from './terapija-item/terapija-item.component';
import { TerapijaListComponent } from './terapija-list/terapija-list.component';
import { TerapeutNavbarComponent } from './terapeut-navbar/terapeut-navbar.component';
import { TerapeutPageComponent } from './terapeut-page/terapeut-page.component';
import { TerapeutService } from './services/terapeut.service';
import { SavetovalisteService } from './services/savetovaliste.service';
import { EditProfilComponent } from './edit-profil/edit-profil.component';
import { KlijentService } from './services/klijent.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TerapijaEditComponent } from './terapija-edit/terapija-edit.component';
import { TipTerapijaService } from './services/tipTerapija.service';
import { TerapeutViewComponent } from './terapeut-view/terapeut-view.component';
import { TestItemComponent } from './test-item/test-item.component';
import { TestListComponent } from './test-list/test-list.component';
import { TestEditComponent } from './test-edit/test-edit.component';
import { PitanjeItemComponent } from './pitanje-item/pitanje-item.component';
import { PocetnaStranaComponent } from './pocetna-strana/pocetna-strana.component';
import { KlijentNavbarComponent } from './klijent-navbar/klijent-navbar.component';
import { KlijentViewComponent } from './klijent-view/klijent-view.component';
import { PitanjeEditComponent } from './pitanje-edit/pitanje-edit.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavljivanjeComponent } from './prijavljivanje/prijavljivanje.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KlijentItemComponent } from './klijent-item/klijent-item.component';
import { KlijentListComponent } from './klijent-list/klijent-list.component';
import { TerminItemComponent } from './termin-item/termin-item.component';
import { TerminListComponent } from './termin-list/termin-list.component';
import { KorisnikProfilComponent } from './korisnik-profil/korisnik-profil.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TerapeutProfilComponent } from './terapeut-profil/terapeut-profil.component';
import { TerminEditComponent } from './termin-edit/termin-edit.component';
import { TerapeutCardComponent } from './terapeut-card/terapeut-card.component';
import { TerapeutCardListComponent } from './terapeut-card-list/terapeut-card-list.component';
import { TerapijaCardItemComponent } from './terapija-card-item/terapija-card-item.component';
import { TerapijaCardListComponent } from './terapija-card-list/terapija-card-list.component';
import { TerminListSimpleComponent } from './termin-list-simple/termin-list-simple.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecenziranjeComponent } from './recenziranje/recenziranje.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TipTerapijeCardComponent } from './tip-terapije-card/tip-terapije-card.component';
import { TipTerapijeCardListComponent } from './tip-terapije-card-list/tip-terapije-card-list.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ZakazivanjePageComponent } from './zakazivanje-page/zakazivanje-page.component';
import { ZakazivanjeKlijentItemComponent } from './zakazivanje-klijent-item/zakazivanje-klijent-item.component';
import { OtkazivanjeKlijentItemComponent } from './otkazivanje-klijent-item/otkazivanje-klijent-item.component';
import { TerminKlijentComponent } from './termin-klijent/termin-klijent.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpozorenjeDialogComponent } from './upozorenje-dialog/upozorenje-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { AdminProfilComponent } from './admin-profil/admin-profil.component';
import { SavetovalisteInfoComponent } from './savetovaliste-info/savetovaliste-info.component';
import { KorisnikItemComponent } from './korisnik-item/korisnik-item.component';
import { AdminTerapeutListComponent } from './admin-terapeut-list/admin-terapeut-list.component';
import { AdminKlijentListComponent } from './admin-klijent-list/admin-klijent-list.component';
import { AdminRecenzijaListComponent } from './admin-recenzija-list/admin-recenzija-list.component';
import { AdminRecenzijaItemComponent } from './admin-recenzija-item/admin-recenzija-item.component';
import { AdminEditTipterapijaComponent } from './admin-edit-tipterapija/admin-edit-tipterapija.component';
import { AdminTipterapijeItemComponent } from './admin-tipterapije-item/admin-tipterapije-item.component';
import { AdminTipterapijeListComponent } from './admin-tipterapije-list/admin-tipterapije-list.component';
import { KlijentTestItemComponent } from './klijent-test-item/klijent-test-item.component';
import { KlijentTestListComponent } from './klijent-test-list/klijent-test-list.component';
import { KlijentPitanjeComponent } from './klijent-pitanje/klijent-pitanje.component';
import { MatNativeDateModule } from '@angular/material/core';
import { TerapijaBasicItemComponent } from './terapija-basic-item/terapija-basic-item.component';
import { TerapijaBasicListComponent } from './terapija-basic-list/terapija-basic-list.component';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './footer/footer.component';
import { LogoComponent } from './logo/logo.component';
import { AuthInterceptor } from './services/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    TerapeutItemComponent,
    TerapeutListComponent,
    TerapijaItemComponent,
    TerapijaListComponent,
    TerapeutNavbarComponent,
    TerapeutPageComponent,
    EditProfilComponent,
    TerapijaEditComponent,
    TerapeutViewComponent,
    TestItemComponent,
    TestListComponent,
    TestEditComponent,
    PitanjeItemComponent,
    PocetnaStranaComponent,
    KlijentNavbarComponent,
    KlijentViewComponent,
    PitanjeEditComponent,
    RegistracijaComponent,
    PrijavljivanjeComponent,
    HomePageComponent,
    KlijentItemComponent,
    KlijentListComponent,
    TerminItemComponent,
    TerminListComponent,
    KorisnikProfilComponent,
    LoadingSpinnerComponent,
    TerapeutProfilComponent,
    TerminEditComponent,
    TerapeutCardComponent,
    TerapeutCardListComponent,
    TerapijaCardItemComponent,
    TerapijaCardListComponent,
    TerminListSimpleComponent,
    RecenziranjeComponent,
    TipTerapijeCardComponent,
    TipTerapijeCardListComponent,
    ZakazivanjePageComponent,
    ZakazivanjeKlijentItemComponent,
    OtkazivanjeKlijentItemComponent,
    TerminKlijentComponent,
    UpozorenjeDialogComponent,
    AdminProfilComponent,
    SavetovalisteInfoComponent,
    KorisnikItemComponent,
    AdminTerapeutListComponent,
    AdminKlijentListComponent,
    AdminRecenzijaListComponent,
    AdminRecenzijaItemComponent,
    AdminEditTipterapijaComponent,
    AdminTipterapijeItemComponent,
    AdminTipterapijeListComponent,
    KlijentTestItemComponent,
    KlijentTestListComponent,
    KlijentPitanjeComponent,
    TerapijaBasicItemComponent,
    TerapijaBasicListComponent,
    FooterComponent,
    LogoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    FontAwesomeModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSelectModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  providers: [
    SavetovalisteService,
    KlijentService,
    TerapeutService,
    TipTerapijaService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
