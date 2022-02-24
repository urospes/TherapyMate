import { Component, OnInit } from '@angular/core';
import { KlijentService } from './services/klijent.service';
import { KorisnikLogovanjeService } from './services/korisnikLogovanje.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TherapyMate';

  loadedFeature = '';

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }

  constructor(private korisnikLogovanjeService: KorisnikLogovanjeService) {}

  ngOnInit() {
    this.korisnikLogovanjeService.autoLoginKlorisnik();
  }
}
