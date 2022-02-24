import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KlijentService } from '../services/klijent.service';
import { TerapeutService } from '../services/terapeut.service';

@Component({
  selector: 'app-terapeut-navbar',
  templateUrl: './terapeut-navbar.component.html',
  styleUrls: ['./terapeut-navbar.component.css'],
})
export class TerapeutNavbarComponent {
  constructor(
    private terapeutService: TerapeutService,
    private klijentService: KlijentService,
    private router: Router
  ) {}
  logout() {
    if (this.terapeutService.getTerapeutID() != '') {
      //this.terapeutService.logout();
    } else if (this.klijentService.getKlijentID() != '') {
      //this.klijentService.logout();
    }
    console.log('nesto');
    console.log(this.router.url);
    this.router.navigateByUrl('../../home');
  }
}
